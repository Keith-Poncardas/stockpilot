import { UUIDInput, uuidSchema } from "@/schemas";
import { stockMovementsService } from "./stockMovements.service";
import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { paginatedStockMovementsSchema } from "./stockMovements.validation";
import { PaginatedStockMovementsInput } from "./types";
import { StockMovement } from '@/generated/client.js';
import { userService } from "../user";
import { inventoryService } from "../inventory";
import { productService } from "../product";

export const stockMovementsResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves a single stock movement record by its ID.
         *
         * This resolver validates the stock movement ID before
         * calling the service layer. If the ID is valid, it returns the
         * requested stock movement.
         */
        getStockMovement: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { movementId }: { movementId: UUIDInput }) => {
            return stockMovementsService.getStockMovement({ id: movementId });
        }),

        /**
         * Retrieves a paginated list of stock movements.
         *
         * This resolver validates the request arguments before
         * calling the service layer. It returns a paginated list
         * of stock movements based on the provided filters,
         * sorting, and pagination options.
         */
        getStockMovements: composeResolvers(
            validate(paginatedStockMovementsSchema)
        )(async (_: unknown, { args }: { args: PaginatedStockMovementsInput }) => {
            return stockMovementsService.getAllStockMovements(args);
        }),

        /**
         * Retrieves the dashboard metrics for stock movements.
         */
        getStockMovementDashboardMetrics: async () => {
            return stockMovementsService.getStockMovementsMetrics();
        },

    }),

    StockMovement: applyErrorHandling({

        /**
         * Retrieves the author of the stock movement.
         *
         * This resolver calls the service layer to get the author
         * of the stock movement.
         */
        author: async (stockMovement: StockMovement) => {
            return userService.getUser({ id: stockMovement.userId });
        },

        /**
         * Retrieves the product of the stock movement.
         *
         * This resolver calls the service layer to get the product
         * of the stock movement.
         */
        product: async (stockMovement: StockMovement) => {
            return productService.getProduct({
                id: stockMovement.productId
            });
        },

        /**
         * Retrieves the inventory of the stock movement.
         *
         * This resolver calls the service layer to get the inventory
         * of the stock movement.
         */
        inventory: async (stockMovement: StockMovement) => {
            return inventoryService.getInventory({
                productId: stockMovement.productId
            });
        },
    })

};
