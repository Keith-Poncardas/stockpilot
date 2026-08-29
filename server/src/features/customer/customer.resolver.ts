import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { customerService } from "./customer.service";
import {
    CreateCustomerInput,
    PaginatedCustomersInput,
    SearchCustomersInfiniteInput
} from "./types";
import { UUIDInput, uuidSchema } from "@/schemas";
import {
    createCustomerSchema,
    paginatedCustomersSchema,
    searchCustomersInfiniteSchema
} from "./customer.validation";
import { PaginatedSalesInput, saleService } from "../sale";
import { Customer } from '@/generated/client.js';

export const customerResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves full customer details by ID.
         *
         * @param _ - The parent resolver object (unused).
         * @param args - The arguments containing the customerId.
         * @returns The customer record.
         */
        getCustomer: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { id }: { id: UUIDInput }) => {
            return customerService.getCustomer({ id });
        }),

        /**
         * Retrieves a paginated list of customers with computed aggregates.
         *
         * @param _ - The parent resolver object (unused).
         * @param args - The pagination and filtering arguments.
         * @returns A paginated list of customers.
         */
        getCustomers: composeResolvers(
            validate(paginatedCustomersSchema)
        )(async (_: unknown, { args }: { args: PaginatedCustomersInput }) => {
            return customerService.getCustomers(args);
        }),

        /**
         * Retrieves dashboard metric cards for customers (e.g. total, active).
         *
         * @returns The aggregated customer metrics.
         */
        getCustomerMetrics: async () => {
            return customerService.getCustomerMetrics();
        },

        /**
         * Searches customers using cursor-based infinite scroll (e.g. for POS addition).
         *
         * @param _ - The parent resolver object (unused).
         * @param args - The search and cursor arguments.
         * @returns An infinite scroll result containing customers and the next cursor.
         */
        searchCustomers: composeResolvers(
            validate(searchCustomersInfiniteSchema)
        )(async (_: unknown, { args }: { args: SearchCustomersInfiniteInput }) => {
            return customerService.searchCustomers(args);
        }),

    }),

    Customer: applyErrorHandling({

        /**
         * Maps the database 'province' field to GraphQL 'provinceCode'.
         */
        provinceCode: (customer: Customer) => customer.province,

        /**
         * Maps the database 'city' field to GraphQL 'cityCode'.
         */
        cityCode: (customer: Customer) => customer.city,

        /**
         * Maps the database 'barangay' field to GraphQL 'barangayCode'.
         */
        barangayCode: (customer: Customer) => customer.barangay,

        /**
         * Resolves the purchase summary (total orders, total spent, etc.) for a specific customer.
         */
        purchaseSummary: async (customer: Customer) => {
            return saleService.getCustomerPurchaseSummary(customer.id);
        },

        /**
         * Resolves the paginated purchase history (sales) for a specific customer.
         *
         * @param customer - The parent customer record.
         * @param args - The pagination and filtering arguments for sales.
         * @returns A paginated list of sales for the customer.
         */
        purchaseHistory: async (
            customer: Customer,
            { args }: { args: PaginatedSalesInput }
        ) => {
            return saleService.getSales({
                ...args,
                filter: { ...args.filter, customerId: customer.id }
            });
        },

    }),

    Mutation: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Creates a new customer record.
         *
         * @param _ - The parent resolver object (unused).
         * @param args - The input data for the new customer.
         * @returns The newly created customer record.
         */
        createCustomer: composeResolvers(
            validate(createCustomerSchema)
        )(async (_: unknown, { input }: { input: CreateCustomerInput }) => {
            return customerService.createCustomer(input);
        }),

    })

};
