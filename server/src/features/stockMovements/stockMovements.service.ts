import { prisma } from "@/lib";
import { buildSearchQuery, createPaginator, throwConflict, throwNotFound } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import {
    PaginatedStockMovementsInput,
    paginatedStockMovementsSchema,
} from "./stockMovements.validation";

export class StockMovementsService {


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
     *  - orderDirection → asc | desc
     */
    async getAllStockMovements(args: PaginatedStockMovementsInput) {

        const { limit, page, filter } = paginatedStockMovementsSchema.parse(args);

        const { params, buildMeta } = createPaginator({ limit, page });

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
        } = filter;

        const where: Prisma.StockMovementWhereInput = {

            /** Search by linked product name or SKU */
            ...(search && {
                product: buildSearchQuery(search, ['name', 'sku']),
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
            ...((dateFrom || dateTo) && {
                createdAt: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
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
                            role: true,
                        },
                    },
                },
                skip: params.skip,
                take: params.limit,
                orderBy: {
                    [orderBy]: orderDirection,
                },
            }),

            prisma.stockMovement.count({ where }),

        ]);

        return {
            data: stockMovements,
            meta: buildMeta(total),
        };

    }

    /**
     * Get dashboard-level stock movement metrics in a single round-trip.
     *
     * Metrics returned:
     *  - totalStockIn          → sum of quantity for all IN movements
     *  - totalStockOut         → sum of quantity for all OUT movements
     *  - totalStockAdjustments → sum of quantity for all ADJUSTMENT movements
     *  - lowStockProducts      → count of inventory records where quantityOnHand <= reorderLevel
     */
    async getStockMovementDashboardMetrics() {

        const [stockIn, stockOut, stockAdjustments, lowStockProducts] = await Promise.all([

            prisma.stockMovement.aggregate({
                where: { type: MovementType.IN },
                _sum: { quantity: true },
            }),

            prisma.stockMovement.aggregate({
                where: { type: MovementType.OUT },
                _sum: { quantity: true },
            }),

            prisma.stockMovement.aggregate({
                where: { type: MovementType.ADJUSTMENT },
                _sum: { quantity: true },
            }),

            prisma.inventory.count({
                where: {
                    quantityOnHand: {
                        lte: prisma.inventory.fields.reorderLevel,
                    },
                },
            }),

        ]);

        return {
            totalStockIn: stockIn._sum.quantity ?? 0,
            totalStockOut: stockOut._sum.quantity ?? 0,
            totalStockAdjustments: stockAdjustments._sum.quantity ?? 0,
            lowStockProducts,
        };

    }

};

export const stockMovementsService = new StockMovementsService();