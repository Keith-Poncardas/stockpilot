import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { dashboardService } from "./dashboard.service";
import {
    PaginatedSalesInput,
    paginatedSalesSchema,
    saleService,
    salesOverviewPeriodSchema
} from "../sale";
import { SalesOverviewPeriod } from "../sale/constants";
import {
    getSalesByLocationInput,
    getSalesByLocationSchema,
    getTopSellingProductsInput,
    getTopSellingProductsSchema,
    productService
} from "../product";

export const dashboardResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves high-level metrics for the dashboard, including total sales,
         * total active/draft products, total customers, and total inventory count.
         */
        dashboardMetrics: async () => {
            return await dashboardService.getDashboardMetrics();
        },

        /**
         * Retrieves a sales overview chart grouped by the specified period.
         * Validates the `period` argument (daily, weekly, monthly).
         */
        getSalesOverview: composeResolvers(
            validate(salesOverviewPeriodSchema)
        )(async (_: unknown, { period }: { period: SalesOverviewPeriod }) => {
            return saleService.getSalesOverview(period);
        }),

        /**
         * Retrieves a list of sales grouped by location, ranked by total revenue.
         * Validates the `sort` order and `limit` arguments.
         */
        getSalesByLocation: composeResolvers(
            validate(getSalesByLocationSchema)
        )(async (_: unknown, { input }: { input: getSalesByLocationInput }) => {
            return saleService.getSalesLocation(input);
        }),

        /**
         * Retrieves a list of the top-selling products ranked by quantity sold.
         * Validates the `sort` order and `limit` arguments.
         */
        getTopSellingProducts: composeResolvers(
            validate(getTopSellingProductsSchema)
        )(async (_: unknown, { input }: { input: getTopSellingProductsInput }) => {
            return productService.getTopSellingProducts(input);
        }),

        /**
         * Retrieves a paginated list of the most recent sales.
         * The response is limited to 5 records by default.
         */
        recentSales: composeResolvers(
            validate(paginatedSalesSchema)
        )(async (_: unknown, args: PaginatedSalesInput) => {
            const limit = args.limit === 25 ? 5 : args.limit;
            return saleService.getSales({ ...args, limit });
        }),

    })

};
