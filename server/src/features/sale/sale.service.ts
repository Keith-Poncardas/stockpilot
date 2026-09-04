import { prisma } from "@/lib";
import { createPaginator, throwConflict } from "@/utils";
import {
    Prisma,
    SaleStatus,
    MovementType,
    MovementReason
} from '@/generated/client.js';
import {
    PaginatedSalesInput,
    CreateSaleInput,
    ChangeSaleStatusInput,
    SalesOverviewInput,
    SalesOverviewItem,
    SalesAggregationRow,
    SalesLocationRow,
} from "./types";
import {
    buildSaleSearchQuery,
    validateSaleItems,
    formatSaleItems,
    calculateTotalAmount,
    ensureSaleIsMutable,
    getManilaToday,
    isSameDay,
    isSameWeek,
    isSameMonth,
    getWeekOfMonth,
    buildSalesAggregationQuery,
    formatShortWeekday,
    formatShortMonth,
    formatSalesOverviewRows,
    formatSalesLocationRanking,
    buildSalesLocationQuery
} from "./sale.utils";
import { UUIDInput } from "@/schemas";
import { customerService } from "../customer";
import { SortOrder, SaleOrderBy, OrderDirectionLower } from "@/enums";
import { getSalesByLocationInput, productService } from "../product";
import { inventoryService } from "../inventory";
import { stockMovementsService } from "../stockMovements";
import { SaleItemData } from "./types";
import { SalesOverviewPeriod } from "./constants";
import { calculateVatInclusiveBreakdown } from "./tax.utils";

export class SaleService {

    /**
     * Aggregates sale data based on the given arguments.
     *
     * @param args - Prisma query arguments to aggregate sale data.
     * @returns The aggregated sale data.
     */
    private async aggregateSale<T extends Prisma.SaleAggregateArgs>(
        args: Prisma.Subset<T, Prisma.SaleAggregateArgs>
    ) {
        return await prisma.sale.aggregate<T>(args);
    }


    /**
     * Validates that all items in a sale correspond to existing products when transitioning
     * the sale to a completed status.
     *
     * @param saleWasCompleted - Flag indicating whether the sale was already in a completed state.
     * @param newStatusIsCompleted - Flag indicating whether the new sale status is completed.
     * @param saleItems - Sale items containing the products to be validated.
     * @param status - The new sale status being applied.
     */
    private async validateSaleCompletionProducts(
        saleWasCompleted: boolean,
        newStatusIsCompleted: boolean,
        saleItems: SaleItemData[],
        status: SaleStatus
    ) {
        const isCompletedSaleTransition =
            !saleWasCompleted &&
            newStatusIsCompleted;

        if (!isCompletedSaleTransition) return;
        await this.ensureSaleItemProductExist(saleItems, status);
    }

    /**
     * Conditionally processes inventory deductions when a sale's status changes to completed.
     * Deductions are only applied if the sale was not previously completed but is now being marked as completed.
     *
     * @param tx - Prisma transaction client used to execute inventory updates atomically.
     * @param saleWasCompleted - Flag indicating whether the sale was previously in a completed state.
     * @param newStatusIsCompleted - Flag indicating whether the new sale status is completed.
     * @param saleItems - Sale items containing the products and quantities sold.
     * @param userId - ID of the user performing the status change.
     */


    /**
     * Retrieves summary metrics for sales.
     *
     * Aggregates key sales statistics, including total revenue,
     * completed sales, total transactions, and the number of
     * refunded or voided transactions.
     *
     * @returns An object containing aggregated sales metrics.
     */
    private async aggregateCompletedSales() {

        const agg = await this.aggregateSale({
            where: { status: SaleStatus.COMPLETED },
            _sum: { totalAmount: true, vatAmount: true, vatableSales: true },
            _count: { id: true },
        });

        const grossSales = Number(agg._sum.totalAmount ?? 0);
        const totalTaxCollected = Number(agg._sum.vatAmount) > 0
            ? Number(agg._sum.vatAmount)
            : Math.round((grossSales - (grossSales / 1.12)) * 100) / 100;

        // Product SRP is tax-inclusive: Total Revenue reflects gross sales amount (no tax deduction from SRP)
        const totalRevenue = grossSales;

        return {
            totalRevenue,
            totalTaxCollected,
            completedSales: agg._count.id,
        }

    }

    /**
 * Checks if a customer exists, otherwise throws a 404 error.
 *
 * @param customerId - The unique identifier of the customer.
 * @returns The customer record if found.
 * @throws {CustomerNotFoundException} If the customer does not exist.
 */
    private async ensureCustomerExist(customerId?: UUIDInput | null) {
        if (!customerId) return;
        await customerService.getCustomer({ id: customerId });
    }

    /**
     * Ensures that all products referenced by sale items exist and
     * validates the sale items (and any bundled products) against the retrieved product data.
     *
     * @param items - Sale items containing the product IDs to validate.
     * @param status - Current sale status used during item validation.
     * @throws {Error} If a referenced product does not exist or a sale item / bundled item
     * fails validation.
     */
    private async ensureSaleItemProductExist(
        items: SaleItemData[],
        status: SaleStatus
    ) {
        const productIds = items.map((i) => i.productId);
        const { findProducts } = productService;

        const products = await findProducts({
            where: {
                id: { in: productIds },
            },
            include: {
                inventory: { select: { quantityOnHand: true, quantityReserved: true } },
                bundleItems: {
                    include: {
                        bundledProduct: {
                            include: { inventory: { select: { quantityOnHand: true, quantityReserved: true } } },
                        },
                    },
                },
                pricingTiers: {
                    orderBy: { minQuantity: 'asc' },
                    include: {
                        freeProduct: {
                            include: { inventory: { select: { quantityOnHand: true, quantityReserved: true } } },
                        },
                    },
                },
            },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));
        validateSaleItems(items, productMap, status);

        // Validate stock for bundled items and tiered free items if sale is completed or pending
        if (status === SaleStatus.COMPLETED || status === SaleStatus.PENDING) {
            for (const item of items) {
                const parent = productMap.get(item.productId);
                if (parent?.bundleItems) {
                    for (const bundle of parent.bundleItems) {
                        const requiredQty = item.quantity * bundle.quantity;
                        const bp = bundle.bundledProduct;
                        const available = (bp?.inventory?.quantityOnHand ?? 0) - (bp?.inventory?.quantityReserved ?? 0);
                        if (requiredQty > available) {
                            throwConflict(
                                `Insufficient stock for bundled component "${bp.name}" included with "${parent.name}". Required: ${requiredQty}, Available: ${available}`
                            );
                        }
                    }
                }

                // Check pricing tier free gifts
                if (parent?.pricingTiers) {
                    const matchedTier = parent.pricingTiers.find(
                        (t: any) => item.quantity >= t.minQuantity && (!t.maxQuantity || item.quantity <= t.maxQuantity)
                    ) || parent.pricingTiers.slice().reverse().find((t: any) => item.quantity >= t.minQuantity);

                    if (matchedTier && matchedTier.freeProductId && matchedTier.freeQuantity > 0) {
                        const fp = matchedTier.freeProduct;
                        const available = (fp?.inventory?.quantityOnHand ?? 0) - (fp?.inventory?.quantityReserved ?? 0);
                        if (matchedTier.freeQuantity > available) {
                            throwConflict(
                                `Insufficient stock for free gift "${fp?.name || 'Free Item'}" for tier on "${parent.name}". Required: ${matchedTier.freeQuantity}, Available: ${available}`
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * Helper to load products, their bundle items, and pricing tiers for the given sale items.
     */
    private async getProductsWithBundles(items: SaleItemData[]) {
        const productIds = items.map((i) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                inventory: true,
                bundleItems: {
                    include: {
                        bundledProduct: true,
                    },
                },
                pricingTiers: {
                    orderBy: { minQuantity: 'asc' },
                    include: {
                        freeProduct: true,
                    },
                },
            },
        });
        return new Map(products.map((p) => [p.id, p]));
    }

    /**
     * Helper to get applicable tier free gift for an item.
     */
    private getTierFreeGift(product: any, quantity: number) {
        if (!product?.pricingTiers || product.pricingTiers.length === 0) return null;
        const matched = product.pricingTiers.find(
            (t: any) => quantity >= t.minQuantity && (!t.maxQuantity || quantity <= t.maxQuantity)
        ) || product.pricingTiers.slice().reverse().find((t: any) => quantity >= t.minQuantity);

        if (matched && matched.freeProductId && matched.freeQuantity > 0) {
            return {
                freeProductId: matched.freeProductId,
                freeQuantity: matched.freeQuantity,
                freeProduct: matched.freeProduct,
            };
        }
        return null;
    }

    /**
     * Processes inventory changes for a completed sale by deducting the
     * sold quantity from each product's inventory (and bundled/free items) and recording the
     * corresponding stock movements.
     *
     * @param tx - Prisma transaction client used to execute all inventory
     * updates and stock movement records atomically.
     * @param items - Sale items containing the products and quantities sold.
     * @param userId - ID of the user who completed the sale.
     */
    private async deduction(
        tx: Prisma.TransactionClient,
        items: SaleItemData[],
        userId: UUIDInput,
        notesCallback?: (ref: string) => string
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;
        const productMap = await this.getProductsWithBundles(items);

        for (const item of items) {
            const product = productMap.get(item.productId);

            if (product?.inventory) {
                await inventoryUpdateInternal(tx, item.productId, {
                    quantityOnHand: {
                        decrement: item.quantity,
                    },
                });

                await recordStockMovement(tx, "SALE", (ref) => ({
                    productId: item.productId,
                    userId,
                    type: MovementType.OUT,
                    quantity: item.quantity,
                    reason: MovementReason.SALE,
                    notes: notesCallback
                        ? notesCallback(ref)
                        : `Sold via POS — Sale #${ref}`,
                }));
            }

            // Deduct bundled items
            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityOnHand: {
                            decrement: bundleQty,
                        },
                    });

                    await recordStockMovement(tx, "SALE", (ref) => ({
                        productId: bundle.bundledProductId,
                        userId,
                        type: MovementType.OUT,
                        quantity: bundleQty,
                        reason: MovementReason.SALE,
                        notes: `Bundled component with "${product.name}" — Sale #${ref}`,
                    }));
                }
            }

            // Deduct volume tier free gifts
            const tierGift = this.getTierFreeGift(product, item.quantity);
            if (tierGift) {
                await inventoryUpdateInternal(tx, tierGift.freeProductId, {
                    quantityOnHand: {
                        decrement: tierGift.freeQuantity,
                    },
                });

                await recordStockMovement(tx, "SALE", (ref) => ({
                    productId: tierGift.freeProductId,
                    userId,
                    type: MovementType.OUT,
                    quantity: tierGift.freeQuantity,
                    reason: MovementReason.SALE,
                    notes: `Volume Tier Free Gift (${tierGift.freeQuantity}x) for "${product?.name}" — Sale #${ref}`,
                }));
            }
        }
    }

    /**
     * Processes initial inventory allocation on sale creation.
     */
    private async processInventoryOnCreation(
        tx: Prisma.TransactionClient,
        status: SaleStatus,
        items: SaleItemData[],
        userId: UUIDInput
    ) {
        if (status === SaleStatus.COMPLETED) {
            await this.deduction(tx, items, userId);
        } else if (status === SaleStatus.PENDING) {
            await this.reserve(tx, items);
        }
    }

    /**
     * Reserves stock for a list of items (and bundled items) by incrementing the quantityReserved.
     */
    private async reserve(
        tx: Prisma.TransactionClient,
        items: SaleItemData[]
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const productMap = await this.getProductsWithBundles(items);

        for (const item of items) {
            const product = productMap.get(item.productId);

            await inventoryUpdateInternal(tx, item.productId, {
                quantityReserved: {
                    increment: item.quantity,
                },
            });

            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityReserved: {
                            increment: bundleQty,
                        },
                    });
                }
            }
        }
    }

    /**
     * Consumes stock from reserved quantity and reduces physical inventory.
     */
    private async consumeReservedStock(
        tx: Prisma.TransactionClient,
        items: SaleItemData[],
        userId: UUIDInput,
        saleId: string
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;
        const productMap = await this.getProductsWithBundles(items);

        for (const item of items) {
            const product = productMap.get(item.productId);

            await inventoryUpdateInternal(tx, item.productId, {
                quantityOnHand: {
                    decrement: item.quantity,
                },
                quantityReserved: {
                    decrement: item.quantity,
                },
            });

            await recordStockMovement(tx, "SALE", () => ({
                productId: item.productId,
                userId,
                type: MovementType.OUT,
                quantity: item.quantity,
                reason: MovementReason.SALE,
                notes: `Sold in POS sale #${saleId} (Status updated from PENDING to COMPLETED)`,
            }));

            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityOnHand: {
                            decrement: bundleQty,
                        },
                        quantityReserved: {
                            decrement: bundleQty,
                        },
                    });

                    await recordStockMovement(tx, "SALE", () => ({
                        productId: bundle.bundledProductId,
                        userId,
                        type: MovementType.OUT,
                        quantity: bundleQty,
                        reason: MovementReason.SALE,
                        notes: `Bundled free item with "${product.name}" in POS sale #${saleId}`,
                    }));
                }
            }
        }
    }

    /**
     * Releases reserved stock without any physical stock movement.
     */
    private async releaseReservation(
        tx: Prisma.TransactionClient,
        items: SaleItemData[]
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const productMap = await this.getProductsWithBundles(items);

        for (const item of items) {
            const product = productMap.get(item.productId);

            await inventoryUpdateInternal(tx, item.productId, {
                quantityReserved: {
                    decrement: item.quantity,
                },
            });

            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityReserved: {
                            decrement: bundleQty,
                        },
                    });
                }
            }
        }
    }

    /**
     * Restocks completed items (and bundled items) back to physical inventory and logs an IN movement.
     */
    private async restock(
        tx: Prisma.TransactionClient,
        items: SaleItemData[],
        userId: UUIDInput,
        saleId: string,
        status: SaleStatus
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;
        const productMap = await this.getProductsWithBundles(items);

        const isRefunded = status === SaleStatus.REFUNDED;
        const reason = isRefunded ? MovementReason.RETURN : MovementReason.ADJUSTMENT;

        for (const item of items) {
            const product = productMap.get(item.productId);

            await inventoryUpdateInternal(tx, item.productId, {
                quantityOnHand: {
                    increment: item.quantity,
                },
            });

            await recordStockMovement(tx, "SALE", () => ({
                productId: item.productId,
                userId,
                type: MovementType.IN,
                quantity: item.quantity,
                reason,
                notes: `Restocked from ${status.toLowerCase()} sale #${saleId}`,
            }));

            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityOnHand: {
                            increment: bundleQty,
                        },
                    });

                    await recordStockMovement(tx, "SALE", () => ({
                        productId: bundle.bundledProductId,
                        userId,
                        type: MovementType.IN,
                        quantity: bundleQty,
                        reason,
                        notes: `Restocked bundled free item with "${product.name}" from ${status.toLowerCase()} sale #${saleId}`,
                    }));
                }
            }
        }
    }

    /**
     * Puts a completed sale back to pending state by physically restocking it and reserving it again.
     */
    private async returnCompletedToPending(
        tx: Prisma.TransactionClient,
        items: SaleItemData[],
        userId: UUIDInput,
        saleId: string
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;
        const productMap = await this.getProductsWithBundles(items);

        for (const item of items) {
            const product = productMap.get(item.productId);

            await inventoryUpdateInternal(tx, item.productId, {
                quantityOnHand: {
                    increment: item.quantity,
                },
                quantityReserved: {
                    increment: item.quantity,
                },
            });

            await recordStockMovement(tx, "SALE", () => ({
                productId: item.productId,
                userId,
                type: MovementType.IN,
                quantity: item.quantity,
                reason: MovementReason.ADJUSTMENT,
                notes: `Returned to pending state from completed sale #${saleId}`,
            }));

            if (product?.bundleItems) {
                for (const bundle of product.bundleItems) {
                    const bundleQty = item.quantity * bundle.quantity;
                    await inventoryUpdateInternal(tx, bundle.bundledProductId, {
                        quantityOnHand: {
                            increment: bundleQty,
                        },
                        quantityReserved: {
                            increment: bundleQty,
                        },
                    });

                    await recordStockMovement(tx, "SALE", () => ({
                        productId: bundle.bundledProductId,
                        userId,
                        type: MovementType.IN,
                        quantity: bundleQty,
                        reason: MovementReason.ADJUSTMENT,
                        notes: `Returned bundled free item with "${product.name}" to pending state from sale #${saleId}`,
                    }));
                }
            }
        }
    }

    /**
     * Processes inventory alterations when transitioning sale statuses.
     */
    private async processInventoryOnStatusChange(
        tx: Prisma.TransactionClient,
        oldStatus: SaleStatus,
        newStatus: SaleStatus,
        items: SaleItemData[],
        userId: UUIDInput,
        saleId: string
    ) {
        const saleWasCompleted = oldStatus === SaleStatus.COMPLETED;
        const saleWasPending = oldStatus === SaleStatus.PENDING;
        const newStatusIsCompleted = newStatus === SaleStatus.COMPLETED;
        const newStatusIsPending = newStatus === SaleStatus.PENDING;
        const newStatusIsVoided = newStatus === SaleStatus.VOIDED;
        const newStatusIsRefunded = newStatus === SaleStatus.REFUNDED;
        const newStatusIsVoidedOrRefunded = newStatusIsVoided || newStatusIsRefunded;

        if (saleWasPending && newStatusIsCompleted) {
            await this.consumeReservedStock(tx, items, userId, saleId);
        }
        else if (saleWasPending && newStatusIsVoidedOrRefunded) {
            await this.releaseReservation(tx, items);
        }
        else if (saleWasCompleted && newStatusIsVoidedOrRefunded) {
            await this.restock(tx, items, userId, saleId, newStatus);
        }
        else if (saleWasCompleted && newStatusIsPending) {
            await this.returnCompletedToPending(tx, items, userId, saleId);
        }
    }
    /**
     * Executes a raw SQL query to aggregate sales data over a specified time range.
     * 
     * This method is the bridge between the backend service and the database's 
     * time-series aggregation logic. It constructs and executes a SQL query that 
     * groups sales into buckets (e.g., days, weeks, months) based on the provided 
     * parameters.
     * 
     * @param rangeType - The type of date range for the query (e.g., 'week', 'month').
     * @param rangeInterval - The duration of the overall range (e.g., '7 days', '1 month').
     * @param bucketInterval - The size of each time bucket (e.g., '1 day', '1 week').
     * @param bucketType - The type of date truncation to use for bucketing (e.g., 'day', 'week').
     * @param timezone - The timezone to apply to the date calculations, defaulting to 'Asia/Manila'.
     * @returns A promise that resolves to an array of `SalesAggregationRow` objects, each containing a timestamp bucket and the total sales for that period.
     */
    private async executeSalesAggregationQuery(
        rangeType: string,
        rangeInterval: string,
        bucketInterval: string,
        bucketType: string,
        timezone: string = "Asia/Manila",
        productId?: string
    ) {
        const query = buildSalesAggregationQuery(
            rangeType,
            rangeInterval,
            bucketInterval,
            bucketType,
            timezone,
            productId
        );

        return await prisma.$queryRaw<SalesAggregationRow[]>(query);
    }


    /**
     * Retrieves a single sale by its unique identifier.
     * 
     * @param args - Prisma query arguments to find the sale, including select/include options.
     * @returns The sale record if found.
     * @throws {Prisma.NotFoundError} If the sale does not exist.
     */
    async getSale<T extends Prisma.SaleFindUniqueArgs>(
        args: Prisma.SelectSubset<T, Prisma.SaleFindUniqueArgs>
    ) {
        return await prisma.sale.findUniqueOrThrow<T>(args);
    }

    /**
     * Retrieves a summary of purchases for a specific customer.
     * 
     * @param customerId - The unique identifier of the customer.
     * @returns An object containing the total number of orders, total amount spent, 
     *          and the date of the last purchase.
     */
    async getCustomerPurchaseSummary(customerId: UUIDInput) {

        const salesAgg = await this.aggregateSale({
            where: {
                customerId,
                status: SaleStatus.COMPLETED,
            },
            _count: { id: true },
            _sum: { totalAmount: true },
            _max: { saleDate: true },
            _min: { saleDate: true },
        });

        const totalOrders = salesAgg._count.id;
        const totalSpent = Number(salesAgg._sum.totalAmount ?? 0);

        return {
            totalOrders,
            totalSpent,
            averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
            firstPurchase: salesAgg._min.saleDate?.toISOString() ?? null,
            lastPurchase: salesAgg._max.saleDate?.toISOString() ?? null,
        };

    }

    /**
     * Counts the total number of sales matching the given criteria.
     *
     * @param where - Optional Prisma filter conditions.
     * @returns The total count of matching sales.
     */
    async saleCount(where?: Prisma.SaleWhereInput) {
        return await prisma.sale.count({ where })
    }

    /**
     * Counts the total number of sale items matching the given criteria.
     *
     * @param where - Optional Prisma filter conditions.
     * @returns The total count of matching sale items.
     */
    async saleItemCount(where?: Prisma.SaleItemWhereInput) {
        return await prisma.saleItem.count({ where });
    }

    /**
     * Retrieves a paginated list of sales based on filter and sorting criteria.
     *
     * @param args - Input containing pagination settings (page, limit) and filters (status, date range, etc.).
     * @returns An object containing the paginated sales data and metadata (total count, pages, etc.).
     */
    async getSales(args: PaginatedSalesInput) {

        const { limit, page, filter } = args;
        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            search,
            customerId,
            status,
            paymentMethod,
            dateFrom,
            dateTo,
            orderBy = SaleOrderBy.SALE_DATE,
            orderDirection = OrderDirectionLower.DESC,
        } = filter;

        const where: Prisma.SaleWhereInput = {

            /** Filter by customer ID */
            ...(customerId && { customerId }),

            /** Filter by status */
            ...(status && { status }),

            /** Filter by payment method */
            ...(paymentMethod && { paymentMethod }),

            /** Filter by saleDate range */
            ...((dateFrom || dateTo) && {
                saleDate: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }),

            /**
             * Full-text search across both the customer's and cashier's names.
             */
            ...buildSaleSearchQuery(search),

        };

        const [sales, total] = await Promise.all([

            prisma.sale.findMany({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection },
            }),

            this.saleCount(where),

        ]);

        return {
            data: sales,
            meta: buildMeta(total),
        };

    }

    /**
     * Retrieves a list of sale items based on the given filter.
     *
     * @param where - Optional Prisma filter conditions.
     * @returns The list of sale items.
     */
    async getSaleItems(where?: Prisma.SaleItemWhereInput) {
        return await prisma.saleItem.findMany({ where });
    }

    /**
     * Retrieves summary metrics for sales.
     *
     * Aggregates key sales statistics, including total revenue,
     * completed sales, total transactions, and the number of
     * refunded or voided transactions.
     *
     * @returns An object containing aggregated sales metrics.
     */
    async getSalesMetrics() {

        const status = { in: [SaleStatus.REFUNDED, SaleStatus.VOIDED] }

        const [
            revenueAgg,
            totalTransactions,
            refundedOrVoidedCount,
        ] = await Promise.all([
            this.aggregateCompletedSales(),
            this.saleCount(),
            this.saleCount({ status })
        ]);

        const { totalRevenue, totalTaxCollected, completedSales } = revenueAgg;

        return {
            totalRevenue,
            totalTaxCollected,
            completedSales,
            totalTransactions,
            refundedOrVoidedCount
        };

    }

    /**
     * Retrieves an overview of sales aggregated over a specified time period.
     * 
     * Depending on the requested period, sales are grouped into daily, weekly, or 
     * monthly buckets. This method handles fetching the raw data and formatting 
     * it appropriately for UI consumption (like charts or graphs).
     * 
     * @param period - The time interval by which to aggregate the sales data (e.g., DAILY, WEEKLY, MONTHLY).
     * @param productId - Optional product ID to scope the sales aggregation to a specific product.
     * @returns A promise resolving to an array of sales overview items, each containing the date, a formatted label, total sales amount, and a flag indicating if it's the current period.
     * @throws {Error} If an unsupported sales overview period is provided.
     */
    async getSalesOverview(
        period: SalesOverviewInput,
        productId?: string
    ): Promise<SalesOverviewItem[]> {
        const timezone = "Asia/Manila";

        let rows: SalesAggregationRow[] = [];
        let labelFn: (date: Date) => string;
        let isActiveFn: (date: Date) => boolean;

        switch (period) {
            case SalesOverviewPeriod.DAILY:
                rows = await this.executeSalesAggregationQuery(
                    'week',
                    '7 days',
                    '1 day',
                    'day',
                    timezone,
                    productId
                );
                labelFn = formatShortWeekday;
                isActiveFn = (date) => isSameDay(date, getManilaToday());
                break;

            case SalesOverviewPeriod.WEEKLY:
                rows = await this.executeSalesAggregationQuery(
                    'month',
                    '1 month',
                    '1 week',
                    'week',
                    timezone,
                    productId
                );
                labelFn = (date) => `Week ${getWeekOfMonth(date)}`;
                isActiveFn = (date) => isSameWeek(date, getManilaToday());
                break;

            case SalesOverviewPeriod.MONTHLY:
                rows = await this.executeSalesAggregationQuery(
                    'year',
                    '1 year',
                    '1 month',
                    'month',
                    timezone,
                    productId
                );
                labelFn = formatShortMonth;
                isActiveFn = (date) => isSameMonth(date, getManilaToday());
                break;

            default:
                throw new Error(`Unsupported SalesOverviewPeriod: ${period}`);
        }

        return formatSalesOverviewRows(rows, labelFn!, isActiveFn!);
    }

    /**
     * Retrieves sales by location (city), ranked by revenue.
     * 
     * @param sort - The sort order (HIGH for highest revenue first, LOW for lowest).
     * @param limit - Optional limit for the number of locations to return (default 5).
     */
    async getSalesLocation(args: getSalesByLocationInput) {
        const { sort, limit } = args;

        const query = buildSalesLocationQuery(sort, limit);
        const rows = await prisma.$queryRaw<SalesLocationRow[]>(query);

        return formatSalesLocationRanking(rows);
    }

    /**
     * Creates a new sale and, when completed, updates inventory and
     * records the corresponding stock movements within the same transaction.
     *
     * @param userId - ID of the user creating the sale.
     * @param input - Sale details including customer, payment method,
     * status, and sale items.
     * @returns The newly created sale.
     * @throws {Error} If the customer or products are invalid, or if
     * the sale transaction fails.
     */
    async createSale(userId: UUIDInput, input: CreateSaleInput) {
        const {
            customerId: customerIdUnsafe,
            paymentMethod,
            status,
            items
        } = input;

        await this.ensureCustomerExist(customerIdUnsafe);
        await this.ensureSaleItemProductExist(items, status);

        const totalAmount = calculateTotalAmount(items);
        const { vatableSales, vatAmount, vatExemptSales, zeroRatedSales, taxRate } =
            calculateVatInclusiveBreakdown(totalAmount);
        const customerId = customerIdUnsafe ?? null;
        const saleItems = { create: formatSaleItems(items) };

        return await prisma.$transaction(async (tx) => {

            const sale = await tx.sale.create({
                data: {
                    customerId,
                    userId,
                    paymentMethod,
                    status,
                    totalAmount,
                    vatableSales,
                    vatAmount,
                    vatExemptSales,
                    zeroRatedSales,
                    taxRate,
                    saleItems,
                },
            });

            await this.processInventoryOnCreation(tx, status, items, userId);

            return sale;
        });

    }

    /**
     * Changes the status of an existing sale.
     * 
     * @param userId - ID of the user initiating the status change.
     * @param input - Contains the sale ID and the new status to apply.
     * @returns The updated sale record.
     */
    async changeSaleStatus(userId: UUIDInput, input: ChangeSaleStatusInput) {
        const { saleId, status } = input;

        const sale = await this.getSale({
            where: { id: saleId },
            include: { saleItems: true }
        });

        ensureSaleIsMutable(sale.status);

        const saleWasCompleted = sale.status === SaleStatus.COMPLETED;
        const newStatusIsCompleted = status === SaleStatus.COMPLETED;

        await this.validateSaleCompletionProducts(
            saleWasCompleted,
            newStatusIsCompleted,
            sale.saleItems,
            status
        );

        return await prisma.$transaction(async (tx) => {

            const updated = await tx.sale.update({
                where: { id: saleId },
                data: { status }
            });

            await this.processInventoryOnStatusChange(
                tx,
                sale.status,
                status,
                sale.saleItems,
                userId,
                saleId
            );

            return updated;
        });
    }
}

export const saleService = new SaleService();
