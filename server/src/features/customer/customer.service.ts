import { prisma } from "@/lib";
import {
    buildSearchQuery,
    createInfiniteScroller,
    createPaginator,
    getCurrentMonthMetrics,
    throwConflict
} from "@/utils";
import { Prisma } from '@/generated/client.js';
import {
    PaginatedCustomersInput,
    CreateCustomerInput,
    SearchCustomersInfiniteInput,
} from "./types";

export class CustomerService {

    /**
     * Retrieves a list of customers based on the given arguments.
     * 
     * @param args - Prisma query arguments to find the customers, including select/include options.
     * @returns The list of customer records.
     */
    private async findManyCustomers<T extends Prisma.CustomerFindManyArgs>(
        args: Prisma.SelectSubset<T, Prisma.CustomerFindManyArgs>
    ) {
        return await prisma.customer.findMany(args);
    }

    /**
     * Ensures that the provided phone number is unique across all customers.
     * 
     * @param phone - The phone number to check.
     * @throws {ConflictError} If a customer with the phone number already exists.
     */
    private async ensurePhoneNumberUnique(phone?: string) {
        if (!phone) return;
        const customer = await prisma.customer.findUnique({ where: { phone } });
        if (customer) throwConflict(
            'A customer with this phone number already exists.'
        );
    }

    /**
     * Ensures that the provided email address is unique across all customers.
     * 
     * @param email - The email address to check.
     * @throws {ConflictError} If a customer with the email address already exists.
     */
    private async ensureEmailUnique(email?: string) {
        if (!email) return;
        const customer = await prisma.customer.findUnique({ where: { email } });
        if (customer) throwConflict(
            'A customer with this email address already exists.'
        );
    }

    /**
     * Counts the total number of customers matching the given filter.
     * 
     * @param where - Optional Prisma filter conditions.
     * @returns The total count of matching customers.
     */
    async customerCount(where?: Prisma.CustomerWhereInput) {
        return await prisma.customer.count({ where });
    }

    /**
     * Retrieves a single customer by a unique identifier.
     * 
     * @param where - Prisma query arguments to find the customer.
     * @returns The customer record if found.
     * @throws {Prisma.NotFoundError} If the customer does not exist.
     */
    async getCustomer(where: Prisma.CustomerWhereUniqueInput) {
        return await prisma.customer.findUniqueOrThrow({ where });
    }

    /**
     * Retrieves a paginated list of customers based on filter and sorting criteria.
     * 
     * @param args - Input containing pagination settings (page, limit) and filters (search, date range, etc.).
     * @returns An object containing the paginated customer data and metadata (total count, pages, etc.).
     */
    async getCustomers(args: PaginatedCustomersInput) {

        const { limit, page, filter } = args;
        const { params, buildMeta } = createPaginator({ limit, page });

        const { search, dateFrom, dateTo, orderBy, orderDirection } = filter;

        const where: Prisma.CustomerWhereInput = {

            /** Filtering by search (name, phone, email) */
            ...(search && buildSearchQuery(search, [
                'firstName',
                'lastName',
                'phone',
                'email'
            ])),

            /** Filtering by createdAt date range */
            ...((dateFrom || dateTo) && {
                createdAt: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }),

        };

        const [customers, total] = await Promise.all([

            this.findManyCustomers({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: { [orderBy]: orderDirection },
            }),

            this.customerCount(where),

        ]);

        return {
            data: customers,
            meta: buildMeta(total),
        };

    }

    /**
     * Retrieves key dashboard metrics related to customers.
     * Includes total customers, new customers this month, total revenue, and returning customers.
     * 
     * @returns An object containing aggregated customer metrics.
     */
    async getCustomerMetrics() {

        const { startOfMonth } = getCurrentMonthMetrics();

        const [
            totalCustomers,
            newCustomers,
            revenueAgg,
            returningCustomers,
        ] = await Promise.all([

            this.customerCount(),
            this.customerCount({ createdAt: { gte: startOfMonth } }),

            prisma.sale.aggregate({
                _sum: { totalAmount: true },
            }),

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

    /**
     * Creates a new customer record after validating uniqueness of phone and email.
     * 
     * @param input - The data required to create a new customer.
     * @returns The newly created customer record.
     */
    async createCustomer(input: CreateCustomerInput) {
        const { provinceCode, cityCode, country, ...rest } = input;

        const phone = rest.phone?.trim() || undefined;
        const email = rest.email?.trim() || undefined;
        const addressLine1 = rest.addressLine1?.trim() || undefined;
        const addressLine2 = rest.addressLine2?.trim() || undefined;
        const postalCode = rest.postalCode?.trim() || undefined;

        await this.ensurePhoneNumberUnique(phone);
        await this.ensureEmailUnique(email);

        const data = {
            firstName: rest.firstName,
            lastName: rest.lastName,
            phone,
            email,
            addressLine1,
            addressLine2,
            province: provinceCode,
            city: cityCode,
            postalCode,
            country: country || "Philippines",
        };

        return await prisma.customer.create({ data });
    }

    /**
     * Searches for customers using a cursor-based infinite scroll approach.
     * Useful for POS systems or dropdowns requiring continuous loading.
     * 
     * @param input - Input containing search query, cursor, and limit.
     * @returns An object containing the requested customers and pagination metadata.
     */
    async searchCustomers(input: SearchCustomersInfiniteInput) {

        const { search, cursor, limit } = input;
        const { params, buildResult } = createInfiniteScroller({
            cursor,
            limit
        });

        const where: Prisma.CustomerWhereInput = {
            ...(search && buildSearchQuery(search, [
                'firstName',
                'lastName',
                'phone',
                'email'
            ])),
        };

        const rawCustomers = await this.findManyCustomers({
            where,
            take: params.take + 1,
            ...(params.cursor && {
                cursor: { id: params.cursor },
                skip: 1,
            }),
            orderBy: { createdAt: 'desc' },
        });

        const { data: customers, meta } = buildResult(rawCustomers);
        return { data: customers, meta };
    }

}

export const customerService = new CustomerService();