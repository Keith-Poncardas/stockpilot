import { prisma } from "@/lib";
import { z } from "zod";
import { buildSearchQuery, createPaginator, throwNotFound, throwConflict, generateReference } from "@/utils";
import { Prisma, SaleStatus, MovementType, MovementReason } from "@prisma/client";
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
} from "./sale.validation";

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
            ...(paymentMethod && {
                paymentMethod: { equals: paymentMethod, mode: "insensitive" },
            }),

            /** Filter by saleDate range */
            ...((dateFrom || dateTo) && {
                saleDate: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }),

            /**
             * Full-text search across both the customer's and cashier's names.
             * Each word in the search term must match at least one of the fields.
             */
            ...(search && {
                OR: search.trim().split(/\s+/).flatMap((word) => [
                    { customer: { firstName: { contains: word, mode: "insensitive" as const } } },
                    { customer: { lastName: { contains: word, mode: "insensitive" as const } } },
                    { user: { firstName: { contains: word, mode: "insensitive" as const } } },
                    { user: { lastName: { contains: word, mode: "insensitive" as const } } },
                ]),
            }),

        };

        const [sales, total] = await Promise.all([

            prisma.sale.findMany({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection },
                select: {
                    id: true,
                    saleDate: true,
                    totalAmount: true,
                    paymentMethod: true,
                    status: true,

                    customer: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },

                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true
                        },
                    },

                    _count: {
                        select: { saleItems: true },
                    },
                },
            }),

            prisma.sale.count({ where }),

        ]);

        const data = sales.map((sale) => ({
            id: sale.id,
            saleDate: sale.saleDate.toISOString(),
            totalAmount: Number(sale.totalAmount),
            paymentMethod: sale.paymentMethod ?? null,
            status: sale.status,
            customer: sale.customer
                ? { firstName: sale.customer.firstName, lastName: sale.customer.lastName }
                : null,
            user: sale.user,
            itemCount: sale._count.saleItems,
        }));

        return {
            data,
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
    async getSalesMetrics(filter?: GetSalesMetricsFilter | null) {

        const { dateFrom, dateTo } = getSalesMetricsSchema.parse(filter ?? {});

        const dateFilter: Prisma.SaleWhereInput = (dateFrom || dateTo)
            ? {
                saleDate: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }
            : {};

        const [
            revenueAgg,
            totalTransactions,
            completedCount,
            refundedOrVoidedCount,
        ] = await Promise.all([

            /** 1 & 3 — Revenue + completed count (two birds, one stone) */
            prisma.sale.aggregate({
                where: { ...dateFilter, status: SaleStatus.COMPLETED },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),

            /** 2 — Total transactions across all statuses */
            prisma.sale.count({ where: dateFilter }),

            /** (completed count already fetched above in revenueAgg._count.id) */
            Promise.resolve(0),   // placeholder — resolved below

            /** 4 — Refunded or voided */
            prisma.sale.count({
                where: {
                    ...dateFilter,
                    status: { in: [SaleStatus.REFUNDED, SaleStatus.VOIDED] },
                },
            }),

        ]);

        const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
        const completedSales = revenueAgg._count.id;
        const averageOrderValue = completedSales > 0
            ? totalRevenue / completedSales
            : 0;

        return {
            totalRevenue,
            totalTransactions,
            averageOrderValue,
            refundedOrVoidedCount,
        };

    }

    /**
     * Create a new sale from POS.
     * - Validates products exist, are active, and have sufficient stock (if COMPLETED).
     * - In a transaction:
     *   - Creates Sale record + nested SaleItem records
     *   - If COMPLETED:
     *     - Decrements inventory quantityOnHand for each item
     *     - Creates StockMovement (type: OUT, reason: SALE) for each item
     */
    async createSale(input: CreateSaleInput, userId: string) {
        const {
            customerId,
            paymentMethod,
            status,
            items
        } = createSaleSchema.parse(input);

        if (customerId) {
            const customer = await prisma.customer.findUnique({ where: { id: customerId } });
            if (!customer) throwNotFound("Customer not found");
        }

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: { inventory: true },
            });

            if (!product) {
                throwNotFound(`Product ${item.productId} not found`);
            }
            if (product.status === "DISCONTINUED" || product.status === "ARCHIVED") {
                throwConflict(`Product "${product.name}" is discontinued or archived`);
            }

            if (status === SaleStatus.COMPLETED) {
                const available = product.inventory?.quantityOnHand ?? 0;
                if (item.quantity > available) {
                    throwConflict(
                        `Insufficient stock for "${product.name}". Available: ${available}, Requested: ${item.quantity}`
                    );
                }
            }
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );

        const createdSale = await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    customerId: customerId ?? null,
                    userId,
                    paymentMethod,
                    status,
                    totalAmount,
                    saleItems: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                        })),
                    },
                },
                include: {
                    customer: {
                        select: { firstName: true, lastName: true },
                    },
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: { saleItems: true },
                    },
                },
            });

            if (status === SaleStatus.COMPLETED) {

                const ref = await generateReference("SALE", tx);

                for (const item of items) {
                    await tx.inventory.updateMany({
                        where: { productId: item.productId },
                        data: {
                            quantityOnHand: {
                                decrement: item.quantity,
                            },
                        },
                    });

                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            userId,
                            type: MovementType.OUT,
                            quantity: item.quantity,
                            reason: MovementReason.SALE,
                            reference: ref,
                            notes: `Sold in POS sale #${ref}`,
                        },
                    });
                }
            }

            return sale;
        });

        return {
            id: createdSale.id,
            saleDate: createdSale.saleDate.toISOString(),
            totalAmount: Number(createdSale.totalAmount),
            paymentMethod: createdSale.paymentMethod,
            status: createdSale.status,
            customer: createdSale.customer,
            user: createdSale.user,
            itemCount: createdSale._count.saleItems,
        };
    }

    /**
     * Get details of a specific sale by ID.
     */
    async getSale(saleId: string) {
        const id = z.string().uuid("Invalid sale ID").parse(saleId);
        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        email: true,
                    },
                },
                saleItems: {
                    include: {
                        product: {
                            select: {
                                sku: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!sale) throwNotFound("Sale not found");

        return {
            id: sale.id,
            saleDate: sale.saleDate.toISOString(),
            totalAmount: Number(sale.totalAmount),
            paymentMethod: sale.paymentMethod ?? null,
            status: sale.status,
            customer: sale.customer
                ? {
                    id: sale.customer.id,
                    firstName: sale.customer.firstName,
                    lastName: sale.customer.lastName,
                    email: sale.customer.email,
                    phone: sale.customer.phone,
                }
                : null,
            user: {
                id: sale.user.id,
                firstName: sale.user.firstName,
                lastName: sale.user.lastName,
                role: sale.user.role,
                email: sale.user.email,
            },
            items: sale.saleItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                sku: item.product?.sku ?? "N/A",
                name: item.product?.name ?? "Deleted Product",
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: item.quantity * Number(item.unitPrice),
            })),
        };
    }

    /**
     * Change the status of a sale.
     * - Validates against changing VOIDED or REFUNDED sales.
     * - Manages inventory adjustments if changing to/from COMPLETED status.
     */
    async changeStatus(input: ChangeSaleStatusInput, userId: string) {
        const { saleId, status } = changeSaleStatusSchema.parse(input);

        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: {
                saleItems: true,
                customer: {
                    select: { firstName: true, lastName: true },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
                _count: {
                    select: { saleItems: true },
                },
            },
        });

        if (!sale) throwNotFound("Sale not found");

        if (sale.status === SaleStatus.VOIDED || sale.status === SaleStatus.REFUNDED) {
            throwConflict(`Cannot change status of a ${sale.status.toLowerCase()} sale.`);
        }

        if (sale.status === status) {
            return {
                id: sale.id,
                saleDate: sale.saleDate.toISOString(),
                totalAmount: Number(sale.totalAmount),
                paymentMethod: sale.paymentMethod ?? null,
                status: sale.status,
                customer: sale.customer
                    ? { firstName: sale.customer.firstName, lastName: sale.customer.lastName }
                    : null,
                user: sale.user,
                itemCount: sale._count.saleItems,
            };
        }

        const updatedSale = await prisma.$transaction(async (tx) => {
            const updated = await tx.sale.update({
                where: { id: saleId },
                data: { status },
                include: {
                    customer: {
                        select: { firstName: true, lastName: true },
                    },
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: { saleItems: true },
                    },
                },
            });

            // If transitioning TO COMPLETED -> decrement stock & create OUT stock movement
            if (sale.status !== SaleStatus.COMPLETED && status === SaleStatus.COMPLETED) {
                const ref = await generateReference("SALE", tx);

                for (const item of sale.saleItems) {
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        include: { inventory: true },
                    });

                    const available = product?.inventory?.quantityOnHand ?? 0;
                    if (item.quantity > available) {
                        throwConflict(
                            `Insufficient stock for product. Available: ${available}, Requested: ${item.quantity}`
                        );
                    }

                    await tx.inventory.updateMany({
                        where: { productId: item.productId },
                        data: {
                            quantityOnHand: {
                                decrement: item.quantity,
                            },
                        },
                    });

                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            userId,
                            type: MovementType.OUT,
                            quantity: item.quantity,
                            reason: MovementReason.SALE,
                            reference: ref,
                            notes: `Sold in POS sale #${ref} (Status updated to COMPLETED)`,
                        },
                    });
                }
            }

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
            customer: updatedSale.customer
                ? { firstName: updatedSale.customer.firstName, lastName: updatedSale.customer.lastName }
                : null,
            user: updatedSale.user,
            itemCount: updatedSale._count.saleItems,
        };
    }

}

export const saleService = new SaleService();
