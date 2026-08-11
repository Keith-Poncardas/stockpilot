import { prisma } from "@/lib";
import {
    createPaginator
} from "@/utils";
import { MovementReason, MovementType, Prisma } from "@prisma/client";
import {
    AdjustStockInput,
    CreateInventoryInput,
    PaginatedInventoriesInput,
} from "./types";
import { InventoryOrderBy, OrderDirectionLower, StockStatus } from "@/enums";
import {
    resolveStockStatus,
    mapInventoriesWithStatus,
    calculateQuantityUpdate
} from "./inv.utils";
import { UUIDInput } from "@/schemas";
import { stockMovementsService } from "../stockMovements";
import { productService } from "../product";

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
    async inventoryCount(where?: Prisma.InventoryWhereInput) {
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
        const inventory = await prisma.inventory.findUniqueOrThrow({ where });
        return {
            ...inventory,
            stockStatus: resolveStockStatus(inventory.quantityOnHand, inventory.reorderLevel)
        };
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
     * Retrieves inventory IDs that satisfy a raw SQL condition.
     *
     * **Warning:** The `condition` must come from a trusted source.
     * Do not pass user input directly, as this method uses
     * `prisma.$queryRawUnsafe()`.
     *
     * @param condition The SQL `WHERE` clause condition to apply.
     * @returns An array of matching inventory IDs.
     */
    private async getIdsByCondition(condition: string) {
        return prisma.$queryRawUnsafe<{ id: string }[]>(
            `SELECT id FROM inventory WHERE ${condition}`
        ).then(rows => rows.map(r => r.id));
    }

    /**
     * Retrieves the IDs of inventory records matching the specified
     * stock status.
     *
     * Resolves stock status into the corresponding inventory IDs using
     * predefined stock level conditions. Returns `undefined` when no
     * ID-based filtering is required.
     *
     * @param stockStatus The stock status to resolve.
     * @returns An array of matching inventory IDs, or `undefined` if no filter applies.
     */
    private async getStockStatusIds(stockStatus?: StockStatus) {
        switch (stockStatus) {

            case StockStatus.WELL_STOCKED:
                return this.getIdsByCondition(
                    "quantity_on_hand > reorder_level"
                );

            case StockStatus.LOW_STOCK:
                return this.getIdsByCondition(
                    "quantity_on_hand > 0 AND quantity_on_hand <= reorder_level"
                );

            default:
                return undefined;
        }
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
     * Retrieves a paginated list of inventory records.
     *
     * Supports searching by product name or SKU, filtering by stock
     * status, quantity-on-hand range, and reorder-level range, with
     * customizable sorting and pagination. Each inventory record is
     * enriched with its computed stock status before being returned.
     *
     * @param args The pagination, filtering, and sorting options.
     * @returns A paginated collection of inventory records with stock status metadata.
     */
    async getInventories(args: PaginatedInventoriesInput) {

        const { filter, limit, page } = args;
        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            search,
            stockStatus,
            minQty,
            maxQty,
            minReorderLevel,
            maxReorderLevel,
            orderBy = InventoryOrderBy.UPDATED_AT,
            orderDirection = OrderDirectionLower.DESC
        } = filter;

        const stockStatusIds = await this.getStockStatusIds(stockStatus);

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
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection },
            }),

            prisma.inventory.count({ where }),

        ]);

        const mapped = mapInventoriesWithStatus(inventories);

        return {
            data: mapped,
            meta: buildMeta(total),
        };

    }

    /**
     * Updates the stock level of an inventory item.
     *
     * Updates the inventory quantity and stock thresholds in a single
     * transaction. The updated inventory is returned together with its resolved stock status.
     *
     * @param productId The ID of the inventory item to update.
     * @param data The stock update data.
     */
    async inventoryUpdateInternal(
        tx: Prisma.TransactionClient,
        productId: UUIDInput,
        data: Prisma.InventoryUpdateManyArgs['data']
    ) {
        await tx.inventory.updateMany({
            where: { productId },
            data,
        })
    }

    /**
     * Adjusts the stock level of an inventory item.
     *
     * Updates the inventory quantity and stock thresholds in a single
     * transaction, then records the adjustment as a stock movement to
     * maintain an accurate inventory audit trail. The updated inventory
     * is returned together with its resolved stock status.
     *
     * @param userId The ID of the user performing the stock adjustment.
     * @param input The validated stock adjustment details.
     * @returns The updated inventory record with its computed stock status.
     */
    async adjustStock(userId: UUIDInput, input: AdjustStockInput) {

        const { inventoryId, movement } = input;
        const { quantity, type, notes } = movement;

        const { recordStockMovement } = stockMovementsService;
        const quantityOnHand = calculateQuantityUpdate(type, quantity);

        const inventory = await prisma.$transaction(async (tx) => {

            const inv = await tx.inventory.update({
                where: { id: inventoryId },
                data: { quantityOnHand },
            });

            await recordStockMovement(tx, "ADJ", {
                productId: inv.productId,
                userId,
                type,
                quantity,
                reason: MovementReason.ADJUSTMENT,
                notes
            });

            return inv;
        });

        const stockStatus = resolveStockStatus(
            inventory.quantityOnHand,
            inventory.reorderLevel
        );

        return {
            ...inventory,
            stockStatus,
        };

    }

    /**
     * Creates an inventory record within an existing database transaction.
     *
     * Intended for internal use by service methods that need to create
     * inventory records as part of a larger transactional workflow.
     *
     * @param tx The active Prisma transaction client.
     * @param inventoryData The inventory data to be persisted.
     * @returns The newly created inventory record.
     */
    async createInventoryInternal(
        tx: Prisma.TransactionClient,
        inventoryData: Prisma.InventoryUncheckedCreateInput
    ) {
        return tx.inventory.create({ data: inventoryData });
    }


    /**
     * Ensures that a product with the given ID exists.
     *
     * Delegates the lookup to the product service and throws an error
     * if no matching product is found.
     *
     * @param productId The unique identifier of the product.
     * @returns The matching product.
     */
    async ensureProductExist(productId: UUIDInput) {
        return productService.getProduct({ id: productId });
    }

    /**
     * Ensures that an inventory record exists for the given product.
     *
     * Retrieves the inventory associated with the specified product
     * and throws an error if no inventory record is found.
     *
     * @param productId The unique identifier of the product.
     * @returns The matching inventory record.
     */
    async ensureInventoryExist(productId: UUIDInput) {
        return this.getInventory({ productId });
    }

    /**
     * Creates an inventory record for a product.
     *
     * Ensures the product exists before creating the inventory record
     * within a transaction. If an initial stock quantity is provided,
     * an inventory stock movement is recorded to establish the initial
     * inventory history. The created inventory is returned together
     * with its resolved stock status.
     *
     * @param userId The ID of the user performing the operation.
     * @param input The validated inventory creation data.
     * @returns The newly created inventory record with its computed stock status.
     */
    async createInventory(userId: UUIDInput, input: CreateInventoryInput) {

        const { productId, inventory: data } = input;
        const { quantityOnHand, reorderLevel, maxStock } = data;

        await this.ensureProductExist(productId);
        await this.ensureInventoryExist(productId);

        const { recordStockMovement } = stockMovementsService;

        const inventory = await prisma.$transaction(async (tx) => {

            const inv = await tx.inventory.create({
                data: {
                    productId,
                    userId,
                    quantityOnHand,
                    reorderLevel,
                    maxStock
                },
            });

            await recordStockMovement(tx, "INIT", {
                productId,
                userId,
                type: MovementType.IN,
                quantity: quantityOnHand,
                notes: "Initial inventory record created",
            });

            return inv;
        });

        const stockStatus = resolveStockStatus(
            inventory.quantityOnHand,
            inventory.reorderLevel
        );

        return {
            ...inventory,
            stockStatus,
        };

    }

}

export const inventoryService = new InventoryService()