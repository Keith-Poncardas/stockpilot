import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { dashboardService } from "./dashboard.service";
import { StockStatus } from "@/enums";
import {
    saleService,
    salesOverviewQuerySchema
} from "../sale";
import { SalesOverviewPeriod } from "../sale/constants";
import {
    getSalesByLocationInput,
    getSalesByLocationSchema,
    getTopSellingProductsInput,
    getTopSellingProductsSchema,
    productService
} from "../product";
import { inventoryService } from "../inventory";

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
         * Retrieves a sales overview chart grouped by the specified period and optional productId.
         * Validates the `period` and optional `productId` arguments.
         */
        getSalesOverview: composeResolvers(
            validate(salesOverviewQuerySchema, (args) => args)
        )(async (_: unknown, { period, productId }: { period: SalesOverviewPeriod; productId?: string }) => {
            return saleService.getSalesOverview(period, productId);
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
            validate(getTopSellingProductsSchema, (args) => args)
        )(async (_: unknown, args: getTopSellingProductsInput) => {
            return productService.getTopSellingProducts(args);
        }),

        /**
         * Retrieves a paginated list of the most recent sales.
         *
         * @returns An object containing the list of recent sales.
         */
        recentSales: async () => {
            return saleService.getSales({
                limit: 5,
                page: 1,
                filter: {}
            } as any);
        },

        /**
         * Retrieves a paginated list of inventory records.
         *
         * Supports pagination, filtering, searching, and sorting
         * based on the validated query arguments.
         */
        lowStockAlerts: async () => {
            return inventoryService.getInventories({
                limit: 5,
                page: 1,
                filter: {
                    stockStatus: StockStatus.LOW_STOCK
                }
            } as any);
        },

    })

};
