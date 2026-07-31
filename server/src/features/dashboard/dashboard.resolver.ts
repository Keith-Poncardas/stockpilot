import { protectResolvers } from "@/graphql/helpers";
import { dashboardService } from "./dashboard.service";

export const dashboardResolver = {

    Query: protectResolvers({

        /**
         * Returns all dashboard data in a single request.
         * Accepts an optional `timeRange` (daily | weekly | monthly)
         * to control the Sales Overview chart grouping.
         */
        getDashboardData: async (
            _: unknown,
            { timeRange }: { timeRange?: "daily" | "weekly" | "monthly" }
        ) => {
            return dashboardService.getDashboardData(timeRange ?? "daily");
        },

    }),

};
