import { prisma } from "@/lib";
import { createPaginator, throwNotFound, throwConflict, generateReference, createInfiniteScroller } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import { AdjustStockInput, adjustStockSchema, CreateInventoryInput, createInventorySchema, PaginatedInventoriesInput, paginatedInventoriesSchema, SearchInventoryProductsInfiniteInput, searchInventoryProductsInfiniteSchema } from "./inv.validation";
import { ProductStatus, StockStatus } from "@/enums";
import { resolveStockStatus } from "./inv.utils";

export class InventoryService {

    /**
     * Counts the number of inventory records that match the given filter.
     *
     * If no filter is provided, returns the total number of inventory
     * records in the system.
     *
     * @param where Optional Prisma filter used to count specific inventory records.
     * @returns The total number of matching inventory records.
     */
    async countInventory(where?: Prisma.InventoryWhereInput) {
        return await prisma.inventory.count({ where });
    }

    /**
     * Retrieves a single inventory record by its unique identifier.
     *
     * Uses Prisma's `findUniqueOrThrow()` to ensure the inventory record
     * exists. Throws an error if no matching record is found.
     *
     * @param where Unique criteria used to locate the inventory record.
     * @returns The matching inventory record.
     * @throws {Prisma.PrismaClientKnownRequestError} If the inventory record does not exist.
     */
    async getInventory(where: Prisma.InventoryWhereUniqueInput) {
        return await prisma.inventory.findUniqueOrThrow({ where })
    }

    /**
     * Counts inventory records that satisfy a raw SQL condition.
     *
     * Executes a raw `COUNT(*)` query using the provided SQL condition
     * and returns the result as a JavaScript number.
     *
     * **Warning:** The `condition` must come from a trusted source.
     * Do not pass user input directly, as this method uses
     * `prisma.$queryRawUnsafe()`.
     *
     * @param condition The SQL `WHERE` clause condition to apply.
     * @returns The number of matching inventory records.
     */
    private async countByCondition(condition: string): Promise<number> {
        return prisma.$queryRawUnsafe<[{ count: bigint }]>(
            `SELECT COUNT(*)::int AS count FROM inventory WHERE ${condition}`
        ).then(r => Number(r[0].count));
    }

    /**
     * Private helper — thin wrapper around `prisma.inventory.findMany`.
     * Centralises the call so both cursor-based and offset-paginated
     * queries go through a single place.
     */
    private findInventories(args: Prisma.InventoryFindManyArgs) {
        return prisma.inventory.findMany(args);
    }

    /**
     * Retrieves inventory stock status metrics.
     *
     * Categorizes inventory records based on their current stock levels
     * and returns the total counts for each category, including the
     * combined count of items below the reorder level.
     *
     * @returns An object containing the counts for well-stocked, low-stock,
     * critical-out, and below-reorder-level inventory records.
     */
    async getStatuses() {

        const [wellStocked, lowStock, criticalOut] = await Promise.all([
            this.countByCondition(
                "quantity_on_hand > reorder_level"
            ),
            this.countByCondition(
                "quantity_on_hand > 0 AND quantity_on_hand <= reorder_level"
            ),
            this.countByCondition(
                "quantity_on_hand <= 0"
            ),
        ]);

        const belowReorderLevel = lowStock + criticalOut;

        return {
            wellStocked,
            lowStock,
            criticalOut,
            belowReorderLevel
        };

    }

    /**
     * Retrieves an infinite-scroll list of inventory products.
     *
     * Returns inventory records whose associated products are not
     * discontinued. Supports keyword searching by product name or SKU
     * and uses cursor-based pagination for efficient infinite scrolling.
     *
     * @param input The search criteria and pagination options.
     * @returns A collection of inventory records with cursor pagination metadata.
     */
    async searchInventoryProducts(input: SearchInventoryProductsInfiniteInput) {

        const { search, cursor, limit } = input;
        const { params, buildResult } = createInfiniteScroller({
            cursor, limit
        });

        const where: Prisma.InventoryWhereInput = {
            product: {
                status: { not: ProductStatus.DISCONTINUED },
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' as const } },
                        { sku: { contains: search, mode: 'insensitive' as const } },
                    ],
                }),
            },
        };

        const inventories = await this.findInventories({
            where,
            take: params.take + 1,
            ...(params.cursor && {
                cursor: { id: params.cursor },
                skip: 1,
            }),
            orderBy: { createdAt: 'desc' },
        });

        const { data, meta } = buildResult(inventories);
        return { data, meta };
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

            this.findInventories({
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
                orderBy: { [orderBy]: orderDirection },
            }),

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

        /** Notes stay as free-text; reason is stored in its own column */
        const movementNotes = notes ?? undefined;

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
                    reason,
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
     * Internal helper to create an inventory record within a transaction.
     * Used by `_createInventory` and other methods that need to
     * create inventory as part of a larger transaction.
     */
    async createInventoryInternal(
        tx: Prisma.TransactionClient,
        inventoryData: Prisma.InventoryUncheckedCreateInput
    ) {
        return tx.inventory.create({ data: inventoryData });
    }

    /**
     * Create an initial inventory record for a product.
     * - Validates input
     * - Ensures the product exists
     * - Prevents duplicate inventory records per product
     * - Creates inventory + initial IN stock movement in a transaction
     */
    async _createInventory(userId: string, input: CreateInventoryInput) {

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