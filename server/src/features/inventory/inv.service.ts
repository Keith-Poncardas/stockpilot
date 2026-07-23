import { prisma } from "@/lib";
import { createPaginator, throwNotFound, throwConflict, generateReference, createInfiniteScroller } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import { AdjustStockInput, adjustStockSchema, CreateInventoryInput, createInventorySchema, PaginatedInventoriesInput, paginatedInventoriesSchema, SearchInventoryProductsInfiniteInput, searchInventoryProductsInfiniteSchema } from "./inv.validation";
import { inventoryIdSchema, UUIDInput } from "@/schemas";
import { ProductStatus, StockStatus } from "@/enums";
import { resolveStockStatus } from "./inv.utils";


export class InventoryService {


    /**
     * Returns counts of inventory items grouped by stock status:
     */
    async getStatuses() {

        const [wellStocked, lowStock, criticalOut] = await Promise.all([

            /** WELL STOCKED: stock is above the reorder threshold */
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT COUNT(*)::int AS count
                FROM inventory
                WHERE quantity_on_hand > reorder_level
            `.then(r => Number(r[0].count)),

            /** LOW STOCK: stock is at or below reorder level but still > 0 */
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT COUNT(*)::int AS count
                FROM inventory
                WHERE quantity_on_hand > 0
                  AND quantity_on_hand <= reorder_level
            `.then(r => Number(r[0].count)),

            /** CRITICAL / OUT OF STOCK: no units remaining */
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT COUNT(*)::int AS count
                FROM inventory
                WHERE quantity_on_hand <= 0
            `.then(r => Number(r[0].count)),

        ]);

        return {
            wellStocked: wellStocked as number,
            lowStock: lowStock as number,
            criticalOut: criticalOut as number,
            belowReorderLevel: (lowStock + criticalOut) as number,
        };

    }

    /**
     * Get a single inventory record by ID.
     */
    async getInventory(inventoryId: UUIDInput) {

        const id = inventoryIdSchema.parse(inventoryId);

        const inventory = await prisma.inventory.findUnique({
            where: { id },
            include: {
                product: true,
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!inventory) {
            throwNotFound("Inventory not found");
        }

        return {
            ...inventory,
            stockStatus: resolveStockStatus(inventory.quantityOnHand, inventory.reorderLevel),
        };

    }

    /**
     * Search products for inventory addition:
     * - Returns up to 5 products if no search is provided.
     * - Returns matching products if search is provided.
     * - Adds boolean 'isAddedInventory' flag.
     */
    /**
     * Search products for inventory addition — cursor-based infinite scroll.
     * - Returns up to `limit` products per page.
     * - Filters out DISCONTINUED products.
     * - Adds boolean `isAddedInventory` flag.
     * - Pass `cursor` (last seen product id) to load the next page.
     */
    async searchInventoryProducts(input: SearchInventoryProductsInfiniteInput) {
        const { search, cursor, limit } = searchInventoryProductsInfiniteSchema.parse(input);
        const { params, buildResult } = createInfiniteScroller({ cursor, limit });

        const where: Prisma.ProductWhereInput = {
            status: { not: ProductStatus.DISCONTINUED },
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { sku:  { contains: search, mode: 'insensitive' as const } },
                ],
            }),
        };

        const rawProducts = await prisma.product.findMany({
            where,
            take: params.take + 1,
            ...(params.cursor && {
                cursor: { id: params.cursor },
                skip: 1,
            }),
            orderBy: { createdAt: 'desc' },
        });

        const { data: products, meta } = buildResult(rawProducts);

        if (products.length === 0) {
            return { data: [], meta };
        }

        const productIds = products.map(p => p.id);
        const inventories = await prisma.inventory.findMany({
            where: { productId: { in: productIds } },
            select: { productId: true },
        });

        const inventorySet = new Set(inventories.map(inv => inv.productId));

        return {
            data: products.map(product => ({
                ...product,
                unitPrice: Number(product.unitPrice),
                costPrice: product.costPrice ? Number(product.costPrice) : null,
                isAddedInventory: inventorySet.has(product.id),
            })),
            meta,
        };
    }

    /**
     * Get a paginated list of inventory records with optional filters:
     *
     *  - search        → product name or SKU (case-insensitive contains)
     *  - stockStatus   → ALL | WELL_STOCKED | LOW_STOCK | CRITICAL_OUT
     *  - minQty        → minimum quantityOnHand (inclusive)
     *  - maxQty        → maximum quantityOnHand (inclusive)
     *  - minReorderLevel / maxReorderLevel → reorder-level range
     *  - orderBy       → quantityOnHand | reorderLevel | updatedAt
     *  - orderDirection → ASC | DESC
     */
    async getInventories(args: PaginatedInventoriesInput) {

        const { filter, limit, page } = paginatedInventoriesSchema.parse(args);

        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            search,
            stockStatus,
            minQty,
            maxQty,
            minReorderLevel,
            maxReorderLevel,
            orderBy,
            orderDirection
        } = filter;

        /**
         * WELL_STOCKED / LOW_STOCK need a column-to-column comparison
         * (quantity_on_hand vs reorder_level). Prisma's `where` only accepts
         * literal values on the right-hand side, so we resolve the matching IDs
         * directly in the DB via $queryRaw — same approach used in getStatuses().
         */
        let stockStatusIds: string[] | undefined;

        if (stockStatus === StockStatus.WELL_STOCKED) {
            stockStatusIds = await prisma.$queryRaw<{ id: string }[]>`
                SELECT id FROM inventory WHERE quantity_on_hand > reorder_level
            `.then(rows => rows.map(r => r.id));
        }

        if (stockStatus === StockStatus.LOW_STOCK) {
            stockStatusIds = await prisma.$queryRaw<{ id: string }[]>`
                SELECT id FROM inventory WHERE quantity_on_hand > 0 AND quantity_on_hand <= reorder_level
            `.then(rows => rows.map(r => r.id));
        }

        const where: Prisma.InventoryWhereInput = {

            /** Search by linked product name or SKU */
            ...(search && {
                product: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { sku: { contains: search, mode: "insensitive" } },
                    ],
                },
            }),

            /** Stock status filter */
            ...(stockStatus === StockStatus.CRITICAL_OUT && {
                quantityOnHand: { lte: 0 },
            }),

            ...(stockStatusIds !== undefined && {
                id: { in: stockStatusIds },
            }),

            /** Quantity-on-hand range */
            ...((minQty !== undefined || maxQty !== undefined) && {
                quantityOnHand: {
                    ...(minQty !== undefined && { gte: minQty }),
                    ...(maxQty !== undefined && { lte: maxQty }),
                },
            }),

            /** Reorder-level range */
            ...((minReorderLevel !== undefined || maxReorderLevel !== undefined) && {
                reorderLevel: {
                    ...(minReorderLevel !== undefined && { gte: minReorderLevel }),
                    ...(maxReorderLevel !== undefined && { lte: maxReorderLevel }),
                },
            }),

        };


        const [inventories, total] = await Promise.all([

            prisma.inventory.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            description: true,
                            unitPrice: true,
                            costPrice: true,
                            status: true,
                        },
                    },
                },
                skip: params.skip,
                take: params.limit,
                orderBy: {
                    [orderBy]: orderDirection
                },
            }
            ),

            prisma.inventory.count({ where }),

        ]);

        const mapped = inventories.map((inv) => ({
            ...inv,
            stockStatus: resolveStockStatus(inv.quantityOnHand, inv.reorderLevel),
        }));

        return {
            data: mapped,
            meta: buildMeta(total),
        };

    }

    /**
     * Adjust stock quantity.
     * Automatically creates a stock movement record.
     */
    async adjustStock(userId: string, input: AdjustStockInput) {

        const {
            inventoryId,
            quantity,
            movementType,
            reorderLevel,
            maxStock,
            reason,
            notes
        } = adjustStockSchema.parse(input);

        /** Compose audit-log notes: prepend [reason] if provided */
        const movementNotes = reason
            ? notes
                ? `[${reason}] ${notes}`
                : `[${reason}]`
            : notes;

        const inventory = await prisma.$transaction(async (tx) => {

            /** Update inventory */
            const inv = await tx.inventory.update({
                where: { id: inventoryId },
                data: {
                    quantityOnHand: {
                        ...(movementType === MovementType.IN && { increment: quantity }),
                        ...(movementType === MovementType.OUT && { decrement: quantity }),
                        ...(movementType === MovementType.ADJUSTMENT && { set: quantity }),
                    },
                    reorderLevel: reorderLevel ?? undefined,
                    maxStock: maxStock ?? undefined,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            description: true,
                            unitPrice: true,
                            costPrice: true,
                            status: true,
                        }
                    },
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            });

            const finalReference = await generateReference("ADJ", tx);

            /** Create stock movement */
            await tx.stockMovement.create({
                data: {
                    productId: inv.product.id,
                    userId: userId,
                    type: movementType,
                    quantity,
                    reference: finalReference,
                    notes: movementNotes,
                },
            });

            return inv;

        });

        return {
            ...inventory,
            stockStatus: resolveStockStatus(inventory.quantityOnHand, inventory.reorderLevel),
        };

    }

    /**
     * Create an initial inventory record for a product.
     * - Validates input
     * - Ensures the product exists
     * - Prevents duplicate inventory records per product
     * - Creates inventory + initial IN stock movement in a transaction
     */
    async createInventory(userId: string, input: CreateInventoryInput) {

        const { productId, quantityOnHand, reorderLevel, maxStock } = createInventorySchema.parse(input);

        /** Ensure the product exists */
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throwNotFound("Product");

        /** Guard against duplicate inventory records */
        const existing = await prisma.inventory.findFirst({ where: { productId } });
        if (existing) throwConflict("An inventory record for this product already exists");

        const inventory = await prisma.$transaction(async (tx) => {

            /** Create the inventory record */
            const inv = await tx.inventory.create({
                data: {
                    productId,
                    userId,
                    quantityOnHand,
                    reorderLevel,
                    maxStock,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            description: true,
                            unitPrice: true,
                            costPrice: true,
                            status: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            const finalReference = await generateReference("INIT", tx);

            /** Record the initial stock-in movement */
            await tx.stockMovement.create({
                data: {
                    productId,
                    userId,
                    type: MovementType.IN,
                    quantity: quantityOnHand,
                    reference: finalReference,
                    notes: "Initial inventory record created",
                },
            });

            return inv;
        });

        return {
            ...inventory,
            stockStatus: resolveStockStatus(inventory.quantityOnHand, inventory.reorderLevel),
        };

    }

}

export const inventoryService = new InventoryService()