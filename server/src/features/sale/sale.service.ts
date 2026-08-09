import { prisma } from "@/lib";
import { createPaginator } from "@/utils";
import {
    Prisma,
    SaleStatus,
    MovementType,
    MovementReason
} from "@prisma/client";
import {
    PaginatedSalesInput,
    CreateSaleInput,
    ChangeSaleStatusInput,
    SalesOverviewInput,
    SalesOverviewItem,
    SalesAggregationRow,
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
    formatDate,
    getWeekOfMonth,
    buildSalesAggregationQuery,
    formatShortWeekday,
    formatShortMonth
} from "./sale.utils";
import { UUIDInput } from "@/schemas";
import { customerService } from "../customer";
import { productService } from "../product";
import { inventoryService } from "../inventory";
import { stockMovementsService } from "../stockMovements";
import { SaleItemData } from "./types";
import { SalesOverviewPeriod } from "./constants";

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
    private async processDeductionOnCompletion(
        tx: Prisma.TransactionClient,
        saleWasCompleted: boolean,
        newStatusIsCompleted: boolean,
        saleItems: SaleItemData[],
        userId: UUIDInput
    ) {
        const isCompletedSaleTransition =
            !saleWasCompleted &&
            newStatusIsCompleted;

        if (!isCompletedSaleTransition) return;

        await this.deduction(
            tx,
            saleItems,
            userId,
            (ref) => `Sold in POS sale #${ref} (Status updated to COMPLETED)`
        );
    }

    /**
     * Processes inventory changes for a cancelled or refunded sale by restocking the
     * sold quantity to each product's inventory and recording the corresponding IN stock movements.
     *
     * @param tx - Prisma transaction client used to execute inventory updates atomically.
     * @param items - Sale items containing the products and quantities to be restocked.
     * @param userId - ID of the user performing the restock.
     * @param status - The sale status that triggered the restock (e.g., REFUNDED or VOIDED).
     */
    private async restock(
        tx: Prisma.TransactionClient,
        items: SaleItemData[],
        userId: UUIDInput,
        status: SaleStatus
    ) {
        const { inventoryUpdateInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;

        const isRefunded = status === SaleStatus.REFUNDED;

        const reason = isRefunded ?
            MovementReason.RETURN :
            MovementReason.ADJUSTMENT;

        for (const item of items) {
            await inventoryUpdateInternal(tx, item.productId, {
                quantityOnHand: {
                    increment: item.quantity,
                },
            });

            await recordStockMovement(tx, "SALE", (ref) => ({
                productId: item.productId,
                userId,
                type: MovementType.IN,
                quantity: item.quantity,
                reason,
                notes: `Restocked from ${status.toLowerCase()} sale #${ref}`,
            }));
        }
    }

    /**
     * Conditionally processes inventory restocking when a sale's status changes.
     * Restocking only occurs if the sale was previously completed and is now being refunded or voided.
     *
     * @param tx - Prisma transaction client used to execute inventory updates atomically.
     * @param saleWasCompleted - Flag indicating whether the sale was previously in a completed state.
     * @param status - The new status being applied to the sale.
     * @param saleItems - Sale items containing the products and quantities to be restocked.
     * @param userId - ID of the user performing the status change.
     */
    private async processRestock(
        tx: Prisma.TransactionClient,
        saleWasCompleted: boolean,
        status: SaleStatus,
        saleItems: SaleItemData[],
        userId: UUIDInput
    ) {
        const isVoided = status === SaleStatus.VOIDED;
        const isRefunded = status === SaleStatus.REFUNDED;
        const isRefundedOrVoided = isRefunded || isVoided;

        if (!saleWasCompleted || !isRefundedOrVoided) return;
        await this.restock(tx, saleItems, userId, status);
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
    private async aggregateCompletedSales() {

        const agg = await this.aggregateSale({
            where: { status: SaleStatus.COMPLETED },
            _sum: { totalAmount: true },
            _count: { id: true },
        });

        return {
            totalRevenue: Number(agg._sum.totalAmount ?? 0),
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
    private async ensureCustomerExist(customerId?: UUIDInput) {
        if (!customerId) return;
        await customerService.getCustomer({ id: customerId });
    }

    /**
     * Ensures that all products referenced by sale items exist and
     * validates the sale items against the retrieved product data.
     *
     * @param items - Sale items containing the product IDs to validate.
     * @param status - Current sale status used during item validation.
     * @throws {Error} If a referenced product does not exist or a sale item
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
            include: { inventory: { select: { quantityOnHand: true } } },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));
        validateSaleItems(items, productMap, status);
    }

    /**
     * Processes inventory changes for a completed sale by deducting the
     * sold quantity from each product's inventory and recording the
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

        for (const item of items) {

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
    }

    /**
     * Conditionally processes inventory deductions during sale creation.
     * Deductions are only applied if the sale is marked as completed.
     *
     * @param tx - Prisma transaction client used to execute inventory updates atomically.
     * @param isCompleted - Flag indicating whether the sale is completed.
     * @param items - Sale items containing the products and quantities sold.
     * @param userId - ID of the user creating the sale.
     */
    private async processDeductionOnCreation(
        tx: Prisma.TransactionClient,
        isCompleted: boolean,
        items: SaleItemData[],
        userId: UUIDInput
    ) {
        if (!isCompleted) return;
        await this.deduction(tx, items, userId);
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
        timezone: string = "Asia/Manila"
    ) {
        const query = buildSalesAggregationQuery(
            rangeType,
            rangeInterval,
            bucketInterval,
            bucketType,
            timezone
        );

        return await prisma.$queryRaw<SalesAggregationRow[]>(query);
    }

    /**
     * Formats raw sales aggregation rows into structured overview items.
     * 
     * @param rows - The raw sales aggregation rows returned by the database query.
     * @param labelFn - A function that generates a descriptive label for a given bucket date.
     * @param isActiveFn - A function that determines if the given bucket date corresponds to the current active period.
     * @returns An array of formatted sales overview items ready for frontend presentation.
     */
    private formatSalesOverviewRows(
        rows: SalesAggregationRow[],
        labelFn: (date: Date) => string,
        isActiveFn: (date: Date) => boolean
    ): SalesOverviewItem[] {
        return rows.map((row) => {
            const date = new Date(row.bucket);

            return {
                label: labelFn(date),
                date: formatDate(date),
                sales: Number(row.sales) ?? 0,
                isActive: isActiveFn(date),
            };
        });
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
            where: { customerId },
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
            orderBy,
            orderDirection,
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

        const { totalRevenue, completedSales } = revenueAgg;

        return {
            totalRevenue,
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
     * @returns A promise resolving to an array of sales overview items, each containing the date, a formatted label, total sales amount, and a flag indicating if it's the current period.
     * @throws {Error} If an unsupported sales overview period is provided.
     */
    async getSalesOverview(
        period: SalesOverviewInput
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
                    timezone
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
                    timezone
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
                    timezone
                );
                labelFn = formatShortMonth;
                isActiveFn = (date) => isSameMonth(date, getManilaToday());
                break;

            default:
                throw new Error(`Unsupported SalesOverviewPeriod: ${period}`);
        }

        return this.formatSalesOverviewRows(rows, labelFn!, isActiveFn!);
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
        const statusCompleted = status === SaleStatus.COMPLETED;
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
                    saleItems,
                },
            });

            await this.processDeductionOnCreation(
                tx,
                statusCompleted,
                items,
                userId
            );

            return sale;
        });

    }

    /**
     * Changes the status of an existing sale.
     * 
     * This method handles the full lifecycle of a sale status change, including:
     * - Validating that the current status is mutable (not VOIDED or REFUNDED).
     * - Validating that all sale items correspond to existing products if completing the sale.
     * - Managing inventory deductions when transitioning to a COMPLETED status.
     * - Managing inventory restocking when transitioning from COMPLETED to REFUNDED or VOIDED.
     *
     * @param userId - ID of the user initiating the status change.
     * @param input - Contains the sale ID and the new status to apply.
     * @returns The updated sale record.
     * @throws {Error} If the sale doesn't exist, is in an immutable state, or validation fails.
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

            await this.processDeductionOnCompletion(
                tx,
                saleWasCompleted,
                newStatusIsCompleted,
                sale.saleItems,
                userId
            );

            await this.processRestock(
                tx,
                saleWasCompleted,
                status,
                sale.saleItems,
                userId
            );

            return updated;
        });
    }

}

export const saleService = new SaleService();
