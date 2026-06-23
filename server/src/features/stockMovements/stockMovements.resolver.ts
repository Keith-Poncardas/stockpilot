import { GraphQLContext } from "@/types";
import { PaginationInput, throwUnauthorized } from "@/utils";
import { stockMovementsService } from "./stockMovements.service";
import {
    GetAllStockMovementsInput,
    RecordMovementInput,
    StockMovementIdInput,
} from "./stockMovements.validation";

export const stockMovementsResolver = {

    Query: {

        /**
         * Get a single stock movement by ID (includes product & user)
         */
        getMovementDetails: async (
            _: unknown,
            { input }: { input: { id: string } },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return stockMovementsService.getMovementDetails({ id: input.id });
        },

        /**
         * Get a paginated + filtered list of stock movements
         */
        getAllStockMovements: async (
            _: unknown,
            {
                pagination,
                filter,
            }: {
                pagination?: PaginationInput;
                filter?: GetAllStockMovementsInput;
            },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return stockMovementsService.getAllStockMovements(pagination, filter);
        },

    },

    Mutation: {

        /**
         * Record a new stock movement and update the linked inventory
         */
        recordMovement: async (
            _: unknown,
            { input }: { input: RecordMovementInput },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return stockMovementsService.recordMovement(input);
        },

        /**
         * Soft-delete a stock movement
         */
        softDeleteStockMovement: async (
            _: unknown,
            { input }: { input: StockMovementIdInput },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return stockMovementsService.softDeleteStockMovement(input);
        },

        /**
         * Restore a soft-deleted stock movement
         */
        restoreStockMovement: async (
            _: unknown,
            { input }: { input: StockMovementIdInput },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return stockMovementsService.restoreStockMovement(input);
        },

    },

};
