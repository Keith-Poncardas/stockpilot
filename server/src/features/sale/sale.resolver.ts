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

    }),

};
