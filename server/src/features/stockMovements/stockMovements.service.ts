import { prisma } from "@/lib";
import { createPaginator, PaginationInput } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import {
    getAllStockMovementsSchema,
    GetAllStockMovementsInput,
    GetMovementDetailsInput,
    getMovementDetailsSchema,
    recordMovementSchema,
    RecordMovementInput,
    stockMovementIdSchema,
    StockMovementIdInput,
} from "./stockMovements.validation";
import { throwNotFound, throwConflict } from "@/utils";

export class StockMovementsService {

    /**
     *  Get stock movement details by ID 
     */
    async getMovementDetails(input: GetMovementDetailsInput) {

        const { id } = getMovementDetailsSchema.parse(input);


        const stockMovement = await prisma.stockMovement.findUnique({
            where: {
                id,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!stockMovement) {
            throwNotFound("Stock movement not found");
        }

        return stockMovement;
    }

    /**
     * Get a paginated list of stock movements with optional filters:
     *
     *  - search        → product name or SKU (case-insensitive contains)
     *  - movementType  → IN | OUT | ADJUSTMENT
     *  - productId     → exact product UUID
     *  - userId        → exact user UUID (who performed the movement)
     *  - minQty / maxQty → quantity range (inclusive)
     *  - dateFrom / dateTo → createdAt date range (inclusive)
     *  - orderBy       → createdAt | quantity
     *  - orderDirection → ASC | DESC
     */
    async getAllStockMovements(pagination?: PaginationInput, filter?: GetAllStockMovementsInput) {

        const {
            search,
            movementType,
            productId,
            userId,
            minQty,
            maxQty,
            dateFrom,
            dateTo,
            orderBy,
            orderDirection,
        } = getAllStockMovementsSchema.parse(filter ?? {});

        const { params, buildMeta } = createPaginator(pagination);

        const where: Prisma.StockMovementWhereInput = {

            /** Search by linked product name or SKU */
            ...(search && {
                product: {
                    OR: [
                        { id: search },
                        { name: { contains: search, mode: "insensitive" } },
                        { sku: { contains: search, mode: "insensitive" } },
                    ],
                },
            }),

            /** Exact movement type filter */
            ...(movementType && { type: movementType }),

            /** Exact product filter */
            ...(productId && { productId }),

            /** Exact user filter */
            ...(userId && { userId }),

            /** Quantity range */
            ...((minQty !== undefined || maxQty !== undefined) && {
                quantity: {
                    ...(minQty !== undefined && { gte: minQty }),
                    ...(maxQty !== undefined && { lte: maxQty }),
                },
            }),

            /** createdAt date range */
            ...((dateFrom !== undefined || dateTo !== undefined) && {
                createdAt: {
                    ...(dateFrom !== undefined && { gte: dateFrom }),
                    ...(dateTo !== undefined && { lte: dateTo }),
                },
            }),

        };

        const [stockMovements, total] = await Promise.all([

            prisma.stockMovement.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            sku: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection === "ASC" ? "asc" : "desc" },
            }),

            prisma.stockMovement.count({ where }),

        ]);

        return {
            data: stockMovements,
            meta: buildMeta(total),
        };

    }

    /**
     * Records a new stock movement and updates the product's inventory.
     * 
     * IN: Increments the quantity on hand.
     * OUT: Decrements the quantity on hand.
     * ADJUSTMENT: Sets the quantity on hand to the given quantity.
     * 
     */
    async recordMovement(input: RecordMovementInput) {

        const {
            productId,
            type,
            quantity,
            notes,
            userId,
            reorderLevel,
            reference
        } = recordMovementSchema.parse(input);

        return await prisma.$transaction(async (tx) => {

            /**
             * Find the product and its inventory
             */
            const product = await tx.product.findUnique({
                where: { id: productId },
                include: {
                    inventory: {
                        select: {
                            id: true,
                        }
                    }
                }
            });

            /**
             * Throw error if product not found
             */
            if (!product) throwNotFound("Product not found");

            /**
             * Create the stock movement
             */
            const movement = await tx.stockMovement.create({
                data: {
                    productId,
                    userId,
                    type,
                    quantity,
                    reference,
                    notes,
                },
            });

            /**
             * Update the inventory
             */
            await tx.inventory.update({
                where: { id: product.inventory!.id },
                data: {
                    quantityOnHand: {
                        ...(type === MovementType.IN && { increment: quantity }),
                        ...(type === MovementType.OUT && { decrement: quantity }),
                        ...(type === MovementType.ADJUSTMENT && { set: quantity }),
                    },
                    reorderLevel: reorderLevel ?? undefined,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                        }
                    }
                }
            });

            return movement;

        })

    }

    /**
     * Soft delete a stock movement by setting deletedAt to the current timestamp.
     * Throws 404 if the movement does not exist and 409 if it is already deleted.
     */
    async softDeleteStockMovement(input: StockMovementIdInput) {

        const { id } = stockMovementIdSchema.parse(input);

        /** Stamp deletedAt */
        const softDeletedStockMovement = await prisma.stockMovement.update({
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() }
        });

        /**
         * If the record was already deleted, update returns null, so we throw 409
         */
        if (!softDeletedStockMovement) {
            throwConflict("Stock movement not found or already deleted");
        }

        return softDeletedStockMovement;

    }

    /**
     * Restore a soft-deleted stock movement by setting deletedAt to null.
     * Throws 404 if the movement does not exist and 409 if it is not deleted.
     */
    async restoreStockMovement(input: StockMovementIdInput) {

        const { id } = stockMovementIdSchema.parse(input);

        /** Restore deleted stock movement */
        const restoredStockMovement = await prisma.stockMovement.update({
            where: { id, deletedAt: { not: null } },
            data: { deletedAt: null },
        });

        /**
         * If the record was not deleted, update returns null, so we throw 409
         */
        if (!restoredStockMovement) {
            throwConflict("Stock movement not found or not deleted yet");
        }

        return restoredStockMovement;

    }

};

export const stockMovementsService = new StockMovementsService();