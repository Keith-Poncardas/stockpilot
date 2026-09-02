import { prisma, aiService } from "@/lib";
import { z } from "zod";
import {
    createPaginator,
    throwConflict
} from "@/utils";
import { MovementReason, MovementType, Prisma, ProductStatus, SaleStatus } from '@/generated/client.js';
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
     * Retrieves an inventory record by its unique identifier, or null if not found.
     *
     * @param where Unique criteria used to locate the inventory record.
     * @returns The matching inventory record with resolved stockStatus, or null.
     */
    async findInventory(where: Prisma.InventoryWhereUniqueInput) {
        const inventory = await prisma.inventory.findUnique({ where });
        if (!inventory) return null;
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
    async getInventories(args: PaginatedInventoriesInput, forceProductStatus?: ProductStatus) {

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

            /** Search and Product Status Filter */
            ...((search || forceProductStatus) && {
                product: {
                    ...(search && {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { sku: { contains: search, mode: "insensitive" } },
                        ],
                    }),
                    ...(forceProductStatus && {
                        status: forceProductStatus,
                    }),
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
        const movementType = (movement as any).movementType ?? (movement as any).type ?? MovementType.ADJUSTMENT;
        const { quantity, notes } = movement;
        const reason = (movement as any).reason ?? MovementReason.ADJUSTMENT;
        const reorderLevel = (movement as any).reorderLevel;
        const maxStock = (movement as any).maxStock;

        const { recordStockMovement } = stockMovementsService;
        const quantityOnHand = calculateQuantityUpdate(movementType, quantity);

        const inventory = await prisma.$transaction(async (tx) => {

            const inv = await tx.inventory.update({
                where: { id: inventoryId },
                data: {
                    quantityOnHand,
                    ...(reorderLevel !== undefined && { reorderLevel }),
                    ...(maxStock !== undefined && { maxStock }),
                },
            });

            await recordStockMovement(tx, "ADJ", {
                productId: inv.productId,
                userId,
                type: movementType,
                quantity,
                reason,
                notes,
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

        const existingInventory = await prisma.inventory.findUnique({
            where: { productId },
        });

        if (existingInventory) {
            throwConflict("Inventory record for this product already exists.");
        }

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

    /**
     * Retrieves the date of the last restock stock movement for a product.
     *
     * @param productId The product ID to query.
     * @returns ISO timestamp string or null.
     */
    async getLastRestockDate(productId: UUIDInput): Promise<string | null> {
        const lastMovement = await prisma.stockMovement.findFirst({
            where: { productId, type: MovementType.IN },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
        });
        return lastMovement?.createdAt?.toISOString() ?? null;
    }

    /**
     * Calculates estimated days of stock remaining for a product based on recent 30-day sales rate.
     *
     * @param productId The product ID to query.
     * @param quantityOnHand Current stock level.
     * @returns Estimated remaining days of stock.
     */
    async getEstimatedDaysOfStock(productId: UUIDInput, quantityOnHand: number): Promise<number> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const soldAgg = await prisma.saleItem.aggregate({
            where: {
                productId,
                sale: { status: SaleStatus.COMPLETED, saleDate: { gte: thirtyDaysAgo } },
            },
            _sum: { quantity: true },
        });
        const unitsSoldLast30Days = soldAgg._sum.quantity ?? 0;
        if (unitsSoldLast30Days > 0) {
            const avgDailySales = unitsSoldLast30Days / 30;
            return Math.round(quantityOnHand / avgDailySales);
        }
        return quantityOnHand > 0 ? 90 : 0;
    }

    /**
     * Generates an intelligent, context-aware stock replenishment recommendation
     * using the reusable Vercel AI SDK wrapper.
     *
     * Gathers all essential supply-chain context strictly via Prisma (NO SQL GENERATION BY AI):
     * - Current on-hand quantity, reorder alert level, warehouse capacity limit
     * - Sales velocity / run-rate across 30-day and 7-day completed sales items
     * - Estimated depletion days and last restock timestamp
     * - Profit margin and financial capital commitment
     *
     * @param inventoryId The unique inventory ID.
     * @returns AI-generated or deterministic fallback stock recommendation.
     */
    async getAiStockRecommendation(inventoryId: UUIDInput) {
        const inventory = await prisma.inventory.findUniqueOrThrow({
            where: { id: inventoryId },
            include: {
                product: true,
            },
        });

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [sold30DaysAgg, sold7DaysAgg] = await Promise.all([
            prisma.saleItem.aggregate({
                where: {
                    productId: inventory.productId,
                    sale: { status: SaleStatus.COMPLETED, saleDate: { gte: thirtyDaysAgo } },
                },
                _sum: { quantity: true },
            }),
            prisma.saleItem.aggregate({
                where: {
                    productId: inventory.productId,
                    sale: { status: SaleStatus.COMPLETED, saleDate: { gte: sevenDaysAgo } },
                },
                _sum: { quantity: true },
            }),
        ]);

        const unitsSoldLast30Days = sold30DaysAgg._sum.quantity ?? 0;
        const unitsSoldLast7Days = sold7DaysAgg._sum.quantity ?? 0;
        const salesVelocity30 = Number((unitsSoldLast30Days / 30).toFixed(2));
        const salesVelocity7 = Number((unitsSoldLast7Days / 7).toFixed(2));
        const salesVelocityDaily = salesVelocity7 > 0 ? salesVelocity7 : (salesVelocity30 > 0 ? salesVelocity30 : 0.5);

        const estimatedDaysOfStock = await this.getEstimatedDaysOfStock(inventory.productId, inventory.quantityOnHand);
        const lastRestockDate = await this.getLastRestockDate(inventory.productId);

        const isCritical = inventory.quantityOnHand <= 0;
        const isHighUrgency = inventory.quantityOnHand <= Math.floor(inventory.reorderLevel / 2);
        const defaultUrgency: 'CRITICAL' | 'HIGH' | 'MODERATE' = isCritical
            ? 'CRITICAL'
            : isHighUrgency
                ? 'HIGH'
                : 'MODERATE';

        // Deterministic calculation for fallback or sanity bounds
        const targetDaysOfCoverage = 18;
        const desiredStock = Math.min(
            inventory.maxStock > 0 ? Math.round(inventory.maxStock * 0.85) : inventory.reorderLevel * 3,
            Math.max(Math.round(salesVelocityDaily * targetDaysOfCoverage), inventory.reorderLevel * 2)
        );
        const rawRecommended = desiredStock - inventory.quantityOnHand;
        const maxCanAdd = Math.max(inventory.maxStock - inventory.quantityOnHand, 0);
        const fallbackQuantity = Math.max(Math.min(rawRecommended > 0 ? rawRecommended : 15, maxCanAdd > 0 ? maxCanAdd : 15), 5);

        const schema = z.object({
            recommendedQuantity: z.number().int().min(0).describe('Optimal number of units to restock or produce (can be 0 if already well stocked)'),
            urgencyLevel: z.enum(['CRITICAL', 'HIGH', 'MODERATE']).describe('Replenishment urgency assessment'),
            headline: z.string().describe('Short 1-sentence executive headline for the direct supplier'),
            reasoning: z.array(z.string()).describe('2 to 3 concise, highly readable bullet points explaining the strategic rationale'),
            targetDaysOfCoverage: z.number().int().describe('How many days of client demand this restock batch will cover'),
            stockoutRiskAssessment: z.string().describe('Clear assessment of stockout vulnerability'),
        });

        const fallbackGenerator = () => ({
            recommendedQuantity: fallbackQuantity,
            urgencyLevel: defaultUrgency,
            headline: `Optimal restock batch of +${fallbackQuantity} units to maintain ${targetDaysOfCoverage}-day buffer coverage.`,
            reasoning: [
                `Restores on-hand inventory (${inventory.quantityOnHand} units) to safe operational buffer of ${inventory.quantityOnHand + fallbackQuantity} units.`,
                `Based on run-rate of ${salesVelocityDaily} units/day, this batch secures ${targetDaysOfCoverage} days of sustained order fulfillment.`,
                `Maintains inventory safely within maximum warehouse storage capacity (${inventory.maxStock} units).`,
            ],
            targetDaysOfCoverage,
            stockoutRiskAssessment: isCritical
                ? 'Stockout is already active. Immediate replenishment required.'
                : `Depletion anticipated within ~${estimatedDaysOfStock} days at current demand velocity.`,
        });

        const prompt = `
PRODUCT AND INVENTORY CONTEXT (Direct Supplier / Wholesaler Model):
- Product Name: ${inventory.product.name} (SKU: ${inventory.product.sku})
- Product Type: ${inventory.product.productType}
- Unit Selling Price: PHP ${Number(inventory.product.unitPrice).toFixed(2)}
- Cost Price: ${inventory.product.costPrice ? `PHP ${Number(inventory.product.costPrice).toFixed(2)}` : 'N/A'}
- Current Stock On-Hand: ${inventory.quantityOnHand} units
- Reorder Alert Level: ${inventory.reorderLevel} units
- Warehouse Maximum Capacity: ${inventory.maxStock} units
- Last 30-Day Completed Sales: ${unitsSoldLast30Days} units
- Last 7-Day Completed Sales: ${unitsSoldLast7Days} units
- Daily Sales Run-Rate / Velocity: ${salesVelocityDaily} units/day
- Business Model: Direct Supplier / In-House Fulfillment (No external vendor lead times).
- Goal: Recommend the optimal production/restock quantity to achieve 14-21 days of coverage while respecting warehouse limits.
${inventory.quantityOnHand <= inventory.reorderLevel
                ? `
CRITICAL REORDER POLICY RULE:
- The product is currently AT or BELOW the user-defined reorder threshold (${inventory.quantityOnHand} <= ${inventory.reorderLevel}).
- Even if daily sales velocity is low, the business policy dictates restoring inventory safely ABOVE the reorder level.
- Therefore, DO NOT recommend 0 units. Recommend at least enough units to lift the stock back to a safe buffer above the reorder level (minimum suggested post-stock: ${Math.min(inventory.reorderLevel + Math.max(Math.round(inventory.reorderLevel * 0.15), 5), inventory.maxStock > 0 ? inventory.maxStock : inventory.reorderLevel + 10)} units, requiring approx +${Math.max(inventory.reorderLevel - inventory.quantityOnHand + 5, 5)} units), ensuring it does not exceed max capacity of ${inventory.maxStock}.
`
                : ''
            }
`;

        const result = await aiService.generateStructured({
            schema,
            system: 'You are an elite inventory intelligence copilot for a direct supplier and distributor. Always provide realistic, integer unit recommendations that prevent stockouts without exceeding warehouse capacity.',
            prompt,
            fallback: fallbackGenerator,
        });

        // Ensure recommendation does not exceed warehouse capacity if maxStock > 0
        const boundedQuantity = inventory.maxStock > 0
            ? Math.min(result.recommendedQuantity, Math.max(inventory.maxStock - inventory.quantityOnHand, 5))
            : result.recommendedQuantity;

        const costPrice = inventory.product.costPrice ? Number(inventory.product.costPrice) : null;
        const unitPrice = Number(inventory.product.unitPrice);
        const estimatedRestockCost = costPrice ? Number((costPrice * boundedQuantity).toFixed(2)) : null;
        const potentialRevenue = Number((unitPrice * boundedQuantity).toFixed(2));
        const projectedProfit = estimatedRestockCost !== null ? Number((potentialRevenue - estimatedRestockCost).toFixed(2)) : null;

        return {
            recommendedQuantity: boundedQuantity,
            urgencyLevel: result.urgencyLevel,
            headline: result.headline,
            reasoning: result.reasoning,
            targetDaysOfCoverage: result.targetDaysOfCoverage,
            stockoutRiskAssessment: result.stockoutRiskAssessment,
            salesVelocityDaily,
            currentStock: inventory.quantityOnHand,
            reorderLevel: inventory.reorderLevel,
            maxStock: inventory.maxStock,
            financialImpact: {
                estimatedRestockCost,
                potentialRevenue,
                projectedProfit,
            },
            calculatedAt: new Date().toISOString(),
        };
    }
}

export const inventoryService = new InventoryService()