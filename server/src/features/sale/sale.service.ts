import { prisma } from "@/lib";
import { z } from "zod";
import { buildSearchQuery, createPaginator, throwNotFound, throwConflict, generateReference } from "@/utils";
import { Prisma, SaleStatus, MovementType, MovementReason, ProductStatus, PaymentMethod, Sale, SaleItem } from "@prisma/client";
import {
    FilterSalesInput,
    GetSalesMetricsFilter,
    PaginatedSalesInput,
    getSalesMetricsSchema,
    paginatedSalesSchema,
    CreateSaleInput,
    createSaleSchema,
    ChangeSaleStatusInput,
    changeSaleStatusSchema,
    CreateSaleItemInput,
} from "./sale.validation";
import { buildSaleSearchQuery, validateSaleItems, formatSaleItems, calculateTotalAmount, ensureSaleIsMutable } from "./sale.utils";
import { UUIDInput } from "@/schemas";
import { customerService } from "../customer";
import { productService } from "../product";
import { inventoryService } from "../inventory";
import { stockMovementsService } from "../stockMovements";

export class SaleService {

    /**
     * Get sale count
     */
    async saleCount(where?: Prisma.SaleWhereInput) {
        return await prisma.sale.count({ where })
    }

    /**
     * Get a paginated list of sales.
     *
     * Returns only the fields needed by the Sales index table:
     *   id, saleDate, totalAmount, paymentMethod, status
     *   customer { firstName, lastName }
     *   user     { firstName, lastName }
     *   itemCount (computed from _count.saleItems)
     */
    async getSales(args: PaginatedSalesInput) {

        const { limit, page, filter } = paginatedSalesSchema.parse(args);
        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            search,
            status,
            paymentMethod,
            dateFrom,
            dateTo,
            orderBy,
            orderDirection,
        } = filter;

        const where: Prisma.SaleWhereInput = {

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

            prisma.sale.count({ where }),

        ]);

        return {
            data: sales,
            meta: buildMeta(total),
        };

    }

    /**
     * Get Sales KPI metrics.
     *
     * Supports an optional date range so that the KPI cards respect
     * whatever date filter the user has applied on the index page.
     *
     * KPIs:
     *   1. totalRevenue          — SUM(totalAmount) WHERE status = COMPLETED
     *   2. totalTransactions     — COUNT(all sales)
     *   3. averageOrderValue     — totalRevenue / COUNT(COMPLETED sales)
     *   4. refundedOrVoidedCount — COUNT WHERE status IN (REFUNDED, VOIDED)
     */
    private async aggregateCompletedSales() {

        const agg = await prisma.sale.aggregate({
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
     * Checks if a customer exists, otherwise throws a 404 error.
     *
     * @param customerId - The unique identifier of the customer.
     * @returns The customer record if found.
     * @throws {CustomerNotFoundException} If the customer does not exist.
     */
    async ensureCustomerExist(customerId?: UUIDInput) {
        if (customerId) {
            await customerService.getCustomer({ id: customerId });
        }
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
        items: { productId: string; quantity: number }[],
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
        items: { productId: string; quantity: number }[],
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
                notes: notesCallback ? notesCallback(ref) : `Sold via POS — Sale #${ref}`,
            }));

        }
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

        const createdSale = await prisma.$transaction(async (tx) => {

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

            if (statusCompleted) {
                await this.deduction(tx, items, userId);
            }

            return sale;
        });

        return createdSale;

    }

    /**
     * Get details of a specific sale by ID.
     */
    async getSale<T extends Prisma.SaleFindUniqueArgs>(
        args: Prisma.SelectSubset<T, Prisma.SaleFindUniqueArgs>
    ) {
        return await prisma.sale.findUniqueOrThrow<T>(args);
    }

    /**
     * Change the status of a sale.
     * - Validates against changing VOIDED or REFUNDED sales.
     * - Manages inventory adjustments if changing to/from COMPLETED status.
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

        if (!saleWasCompleted && newStatusIsCompleted) {
            await this.ensureSaleItemProductExist(sale.saleItems, status);
        }

        const updatedSale = await prisma.$transaction(async (tx) => {

            const updated = await tx.sale.update({
                where: { id: saleId },
                data: { status }
            });

            if (!saleWasCompleted && newStatusIsCompleted) {
                await this.deduction(
                    tx,
                    sale.saleItems,
                    userId,
                    (ref) => `Sold in POS sale #${ref} (Status updated to COMPLETED)`
                );
            };

            // If transitioning FROM COMPLETED to REFUNDED or VOIDED -> restock & create IN stock movement
            if (sale.status === SaleStatus.COMPLETED && (status === SaleStatus.REFUNDED || status === SaleStatus.VOIDED)) {
                const ref = await generateReference("SALE", tx);

                for (const item of sale.saleItems) {
                    await tx.inventory.updateMany({
                        where: { productId: item.productId },
                        data: {
                            quantityOnHand: {
                                increment: item.quantity,
                            },
                        },
                    });

                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            userId,
                            type: MovementType.IN,
                            quantity: item.quantity,
                            reason: status === SaleStatus.REFUNDED ? MovementReason.RETURN : MovementReason.ADJUSTMENT,
                            reference: ref,
                            notes: `Restocked from ${status.toLowerCase()} sale #${ref}`,
                        },
                    });
                }
            }

            return updated;
        });

        return {
            id: updatedSale.id,
            saleDate: updatedSale.saleDate.toISOString(),
            totalAmount: Number(updatedSale.totalAmount),
            paymentMethod: updatedSale.paymentMethod ?? null,
            status: updatedSale.status,
            customer: sale.customer
                ? { firstName: sale.customer.firstName, lastName: sale.customer.lastName }
                : null,
            user: sale.user,
            itemCount: sale._count.saleItems,
        };
    }

}

export const saleService = new SaleService();
