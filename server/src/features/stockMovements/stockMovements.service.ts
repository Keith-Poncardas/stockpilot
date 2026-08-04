import { prisma } from "@/lib";
import { buildSearchQuery, createPaginator } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import { UUIDInput } from "@/schemas";
import { inventoryService } from "../inventory";
import { PaginatedStockMovementsInput } from "./types";

export class StockMovementsService {

    /**
     * Returns the total number of stock movement records.
     *
     * If a `where` filter is provided, only the matching records are counted.
     *
     * @param where - Optional Prisma filter used to count specific stock movements.
     * @returns The total number of matching stock movement records.
     */
    async stockMovementCount(where?: Prisma.StockMovementWhereInput) {
        return await prisma.stockMovement.count({ where })
    }

    /**
     * Returns a paginated list of stock movement records.
     *
     * Supports filtering, searching, sorting, and pagination.
     * Filters can be applied by movement type, product, user,
     * quantity range, and creation date range.
     *
     * @param args - Pagination, filter, and sorting options.
     * @returns An object containing the stock movement list and pagination metadata.
     */
    async getAllStockMovements(args: PaginatedStockMovementsInput) {

        const { limit, page, filter } = args;

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
     * Returns a stock movement record by its ID.
     *
     * Throws an error if the stock movement does not exist.
     *
     * @param movementId - The unique ID of the stock movement.
     * @returns The matching stock movement record.
     */
    async getStockMovement(movementId: UUIDInput) {
        return await prisma.stockMovement.findUniqueOrThrow({
            where: { id: movementId }
        });
    }

    /**
      * Performs an aggregate query on stock movement records.
      *
      * Supports Prisma aggregate operations such as count, sum,
      * average, minimum, and maximum using the provided arguments.
      *
      * @template T - The Prisma aggregate argument type.
      * @param args - Prisma aggregate query arguments.
      * @returns The aggregate result based on the provided arguments.
      */
    async aggregateStockMovements<
        T extends Prisma.StockMovementAggregateArgs
    >(args: T) {
        return await prisma.stockMovement.aggregate(args);
    }

    /**
     * Returns the total quantity for a specific stock movement type.
     *
     * Calculates the sum of all movement quantities that match
     * the given movement type.
     *
     * @param movementType - The stock movement type to aggregate.
     * @returns The aggregate result containing the total quantity.
     */
    private async sumStockMovementByType(movementType: MovementType) {
        return await this.aggregateStockMovements({
            _sum: { quantity: true },
            where: { type: movementType },
        })
    }

    /**
     * Returns the total number of low-stock products.
     *
     * Counts inventory records where the quantity on hand is
     * less than or equal to the reorder level.
     *
     * @returns The total number of low-stock products.
     */
    private async lowStockProducts() {
        return inventoryService.countInventory({
            quantityOnHand: {
                lte: prisma.inventory.fields.reorderLevel
            }
        })
    }

    /**
     * Returns summary metrics for stock movements.
     *
     * Includes the total stock in, stock out, stock adjustments,
     * and the number of low-stock products.
     *
     * @returns An object containing stock movement summary metrics.
     */
    async getStockMovementsMetrics() {

        const [
            stockIn,
            stockOut,
            stockAdjustments,
            lowStockProducts
        ] = await Promise.all([
            this.sumStockMovementByType(MovementType.IN),
            this.sumStockMovementByType(MovementType.OUT),
            this.sumStockMovementByType(MovementType.ADJUSTMENT),
            this.lowStockProducts(),
        ]);

        return {
            totalStockIn: stockIn._sum?.quantity ?? 0,
            totalStockOut: stockOut._sum?.quantity ?? 0,
            totalStockAdjustments: stockAdjustments._sum?.quantity ?? 0,
            lowStockProducts,
        };

    }

    /**
     * Creates a new stock movement record within a database transaction.
     *
     * This method uses the provided transaction client to ensure
     * the stock movement is created as part of the current transaction.
     *
     * @param tx - The Prisma transaction client.
     * @param movement - The stock movement data to create.
     * @returns The newly created stock movement record.
     */
    async recordStockMovement(
        tx: Prisma.TransactionClient,
        movement: Prisma.StockMovementCreateInput
    ) {
        return await tx.stockMovement.create({ data: movement });
    }

};

export const stockMovementsService = new StockMovementsService();