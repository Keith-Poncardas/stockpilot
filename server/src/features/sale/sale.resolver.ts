import { protectResolvers } from "@/graphql/helpers";
import { saleService } from "./sale.service";
import { GetSalesMetricsFilter, PaginatedSalesInput } from "./sale.validation";

export const saleResolver = {

    Query: protectResolvers({

        /**
         * Get a paginated list of sales with filters.
         */
        getSales: async (
            _: unknown,
            { args }: { args: PaginatedSalesInput }
        ) => {
            return saleService.getSales(args);
        },

        /**
         * Get KPI metrics for the Sales index page.
         * Accepts an optional date range so KPIs respect the active filter.
         */
        getSalesMetrics: async (
            _: unknown,
            { filter }: { filter?: GetSalesMetricsFilter }
        ) => {
            return saleService.getSalesMetrics(filter);
        },

        /**
         * Get full details of a sale by ID.
         */
        getSale: async (
            _: unknown,
            { saleId }: { saleId: string }
        ) => {
            return saleService.getSale(saleId);
        },

    }),


    Mutation: protectResolvers({

        /**
         * Create a new sale from POS.
         */
        createSale: async (
            _: unknown,
            { input }: { input: any },
            context: any
        ) => {
            return saleService.createSale(input, context.user!.id);
        },

        /**
         * Change the status of a sale.
         */
        changeSaleStatus: async (
            _: unknown,
            { input }: { input: any },
            context: any
        ) => {
            return saleService.changeStatus(input, context.user!.id);
        },

    }),

};

