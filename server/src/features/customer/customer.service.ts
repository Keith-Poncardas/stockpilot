import { prisma } from "@/lib";
import { buildSearchQuery, createInfiniteScroller, createPaginator, getCurrentMonthMetrics, throwNotFound, throwConflict } from "@/utils";
import { Prisma } from "@prisma/client";
import { customerId } from "@/schemas";
import {
    GetCustomerInput,
    getCustomerSchema,
    PaginatedCustomersInput,
    paginatedCustomersSchema,
    CreateCustomerInput,
    createCustomerSchema,
    SearchCustomersInfiniteInput,
    searchCustomersInfiniteSchema,
} from "./customer.validation";

export class CustomerService {

    /**
     * Get a paginated list of customers with computed aggregates.
     *
     * Computed per customer (from Sales relation):
     *   - totalOrders  = COUNT(sales)
     *   - totalSpent   = SUM(sales.totalAmount)
     *   - lastPurchase = MAX(sales.saleDate)
     */
    async getCustomers(args: PaginatedCustomersInput) {

        const { limit, page, filter } = paginatedCustomersSchema.parse(args);
        const { params, buildMeta } = createPaginator({ limit, page });

        const { search, dateFrom, dateTo, orderBy, orderDirection } = filter;

        const where: Prisma.CustomerWhereInput = {

            /** Filtering by search (name, phone, email) */
            ...(search && buildSearchQuery(search, ['firstName', 'lastName', 'phone', 'email'])),

            /** Filtering by createdAt date range */
            ...((dateFrom || dateTo) && {
                createdAt: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo  && { lte: dateTo  }),
                },
            }),

        };

        const [customers, total, salesAggregates] = await Promise.all([

            prisma.customer.findMany({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection },
            }),

            prisma.customer.count({ where }),

            /**
             * Compute totalOrders, totalSpent, lastPurchase for all customers
             * on the current page in a single groupBy query.
             */
            prisma.sale.groupBy({
                by: ['customerId'],
                _count: { id: true },
                _sum:   { totalAmount: true },
                _max:   { saleDate: true },
            }),

        ]);

        /** Build a lookup map: customerId → aggregated sales data */
        const salesMap = new Map(
            salesAggregates.map((agg) => [
                agg.customerId,
                {
                    totalOrders: agg._count.id,
                    totalSpent:  Number(agg._sum.totalAmount ?? 0),
                    lastPurchase: agg._max.saleDate?.toISOString() ?? null,
                },
            ])
        );

        const data = customers.map((customer) => {
            const agg = salesMap.get(customer.id);
            return {
                ...customer,
                totalOrders:  agg?.totalOrders  ?? 0,
                totalSpent:   agg?.totalSpent   ?? 0,
                lastPurchase: agg?.lastPurchase ?? null,
            };
        });

        return {
            data,
            meta: buildMeta(total),
        };

    }

    /**
     * Get full customer details by ID, including:
     *   - Personal & address info
     *   - Purchase summary (computed from Sales)
     *   - Recent purchases (last 5 sales)
     */
    async getCustomer(input: GetCustomerInput) {

        const { id } = getCustomerSchema.parse(input);

        const [customer, salesAgg, recentSales] = await Promise.all([

            prisma.customer.findUnique({ where: { id } }),

            /** Compute purchase summary */
            prisma.sale.aggregate({
                where: { customerId: id },
                _count: { id: true },
                _sum:   { totalAmount: true },
                _max:   { saleDate: true },
                _min:   { saleDate: true },
            }),

            /** All customer sales */
            prisma.sale.findMany({
                where: { customerId: id },
                orderBy: { saleDate: 'desc' },
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                    saleDate: true,
                    paymentMethod: true,
                },
            }),

        ]);

        if (!customer) throwNotFound('Customer not found');

        const totalOrders  = salesAgg._count.id;
        const totalSpent   = Number(salesAgg._sum.totalAmount ?? 0);
        const lastPurchase = salesAgg._max.saleDate?.toISOString() ?? null;
        const firstPurchase = salesAgg._min.saleDate?.toISOString() ?? null;
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        const salesList = recentSales.map((s) => ({
            id: s.id,
            totalAmount: Number(s.totalAmount),
            status: s.status,
            saleDate: s.saleDate.toISOString(),
            paymentMethod: s.paymentMethod ?? null,
        }));

        const customerType = totalSpent > 5000 ? "VIP" : "Regular";

        return {
            ...customer,
            totalOrders,
            totalSpent,
            averageOrderValue,
            firstPurchase,
            lastPurchase,
            customerType,
            purchaseSummary: {
                totalOrders,
                totalSpent,
                averageOrderValue,
                firstPurchase,
                lastPurchase,
            },
            recentSales: salesList.slice(0, 5),
            sales: salesList,
        };

    }

    /**
     * Dashboard metric cards:
     *   1. totalCustomers   – COUNT all customers
     *   2. newCustomers     – COUNT customers created this month
     *   3. totalRevenue     – SUM of all sales.totalAmount
     *   4. returningCustomers – COUNT customers with more than 1 sale
     */
    async getCustomerMetrics() {

        const { startOfMonth } = getCurrentMonthMetrics();

        const [
            totalCustomers,
            newCustomers,
            revenueAgg,
            returningCustomers,
        ] = await Promise.all([

            prisma.customer.count(),

            prisma.customer.count({
                where: { createdAt: { gte: startOfMonth } },
            }),

            prisma.sale.aggregate({
                _sum: { totalAmount: true },
            }),

            /**
             * Count customers that appear in > 1 sale.
             * Prisma groupBy + having emulates: COUNT(sales) > 1
             */
            prisma.sale.groupBy({
                by: ['customerId'],
                having: {
                    customerId: {
                        _count: { gt: 1 },
                    },
                },
                _count: { customerId: true },
            }).then((rows) => rows.length),

        ]);

        return {
            totalCustomers,
            newCustomers,
            totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
            returningCustomers,
        };

    }

    /** Get paginated purchase history for a customer (legacy / internal) */
    async customerPurchaseHistory(customerId: string, pagination?: { page?: number; limit?: number }) {

        const { params, buildMeta } = createPaginator(pagination);

        const [sales, total] = await Promise.all([

            prisma.sale.findMany({
                where: { customerId },
                include: {
                    saleItems: {
                        include: { product: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: params.skip,
                take: params.limit,
            }),

            prisma.sale.count({ where: { customerId } }),

        ]);

        return {
            data: sales,
            meta: buildMeta(total),
        };

    }

    /**
     * Create a new customer.
     * Guards against duplicate phone and email.
     */
    async createCustomer(input: CreateCustomerInput) {

        const data = createCustomerSchema.parse(input);

        /** Guard: phone uniqueness */
        if (data.phone) {
            const existing = await prisma.customer.findUnique({ where: { phone: data.phone } });
            if (existing) throwConflict('A customer with this phone number already exists.');
        }

        /** Guard: email uniqueness */
        if (data.email) {
            const existing = await prisma.customer.findUnique({ where: { email: data.email } });
            if (existing) throwConflict('A customer with this email address already exists.');
        }

        const customer = await prisma.customer.create({ data });

        return {
            ...customer,
            totalOrders: 0,
            totalSpent: 0,
            lastPurchase: null,
        };

    }

    /**
     * Search customers for POS addition — cursor-based infinite scroll.
     */
    async searchCustomers(input: SearchCustomersInfiniteInput) {
        const { search, cursor, limit } = searchCustomersInfiniteSchema.parse(input);
        const { params, buildResult } = createInfiniteScroller({ cursor, limit });

        const where: Prisma.CustomerWhereInput = {
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' as const } },
                    { lastName: { contains: search, mode: 'insensitive' as const } },
                    { phone: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } },
                ],
            }),
        };

        const rawCustomers = await prisma.customer.findMany({
            where,
            take: params.take + 1,
            ...(params.cursor && {
                cursor: { id: params.cursor },
                skip: 1,
            }),
            orderBy: { createdAt: 'desc' },
        });

        const { data: customers, meta } = buildResult(rawCustomers);

        if (customers.length === 0) {
            return { data: [], meta };
        }

        const customerIds = customers.map(c => c.id);

        const salesAggregates = await prisma.sale.groupBy({
            by: ['customerId'],
            where: { customerId: { in: customerIds } },
            _sum: { totalAmount: true },
        });

        const salesMap = new Map(
            salesAggregates.map(agg => [agg.customerId, Number(agg._sum.totalAmount ?? 0)])
        );

        return {
            data: customers.map(customer => {
                const totalSpent = salesMap.get(customer.id) ?? 0;
                const customerType = totalSpent > 5000 ? "VIP" : "Regular";
                return {
                    id: customer.id,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phone: customer.phone,
                    email: customer.email,
                    customerType,
                };
            }),
            meta,
        };
    }

}

export const customerService = new CustomerService();