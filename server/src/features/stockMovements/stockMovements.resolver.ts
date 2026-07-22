import { GraphQLContext } from "@/types";
import { stockMovementsService } from "./stockMovements.service";
import {
    PaginatedStockMovementsInput,
    RecordMovementInput,
    StockMovementIdInput,
} from "./stockMovements.validation";
import { protectResolvers } from "@/graphql/helpers";

export const stockMovementsResolver = {

    Query: protectResolvers({

        /**
         * Get a paginated + filtered list of stock movements
         */
        getAllStockMovements: async (
            _: unknown,
            { args }: { args: PaginatedStockMovementsInput },
        ) => {
            return stockMovementsService.getAllStockMovements(args);
        },

        /**
         * Get aggregated dashboard metrics for stock movements
         */
        getStockMovementDashboardMetrics: async () => {
            return stockMovementsService.getStockMovementDashboardMetrics();
        },

    }),

    // Mutation: protectResolvers({


    // }),

};
