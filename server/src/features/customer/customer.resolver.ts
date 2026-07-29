import { protectResolvers } from "@/graphql/helpers";
import { customerService } from "./customer.service";
import { CreateCustomerInput, GetCustomerInput, PaginatedCustomersInput } from "./customer.validation";

export const customerResolver = {

    Query: protectResolvers({

        /**
         * Get paginated customers with computed aggregates
         */
        getCustomers: async (
            _: unknown,
            { args }: { args: PaginatedCustomersInput }
        ) => {
            return customerService.getCustomers(args);
        },

        /**
         * Get full customer details by ID
         */
        getCustomer: async (
            _: unknown,
            { id }: { id: string }
        ) => {
            return customerService.getCustomer({ id } as GetCustomerInput);
        },

        /**
         * Get dashboard metric cards
         */
        getCustomerMetrics: async () => {
            return customerService.getCustomerMetrics();
        },

        /**
         * Search customers for POS addition — cursor-based infinite scroll
         */
        searchCustomers: async (
            _: unknown,
            input: any
        ) => {
            return customerService.searchCustomers(input);
        },

    }),

    Mutation: protectResolvers({

        /**
         * Create a new customer
         */
        createCustomer: async (
            _: unknown,
            { input }: { input: CreateCustomerInput }
        ) => {
            return customerService.createCustomer(input);
        },

    }),

    Customer: {
        totalOrders: (parent: any) => parent.totalOrders ?? 0,
        totalSpent: (parent: any) => parent.totalSpent ?? 0,
        lastPurchase: (parent: any) => parent.lastPurchase ?? null,
    },

};
