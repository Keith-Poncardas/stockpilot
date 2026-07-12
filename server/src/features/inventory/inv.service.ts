import { prisma } from "@/lib";
import { createPaginator, throwNotFound } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import { AdjustStockInput, adjustStockSchema, PaginatedInventoriesInput, paginatedInventoriesSchema } from "./inv.validation";
import { inventoryIdSchema, UUIDInput } from "@/schemas";
import { OrderDirection, OrderDirectionLower, StockStatus } from "@/enums";

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
                product: true
            }
        });

        if (!inventory) {
            throwNotFound("Inventory not found");
        }

        return inventory;

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
                            isActive: true,
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

        return {
            data: inventories,
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
            reference,
            quantity,
            movementType,
            reorderLevel,
            maxStock,
            notes
        } = adjustStockSchema.parse(input);

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
                        }
                    }
                }
            });

            /** Create stock movement */
            await tx.stockMovement.create({
                data: {
                    productId: inv.product.id,
                    userId: userId,
                    type: movementType,
                    quantity,
                    reference,
                    notes
                },
            });

            return inv;

        });

        return inventory;

    }

}

export const inventoryService = new InventoryService()