import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { inventoryService } from "./inv.service";
import { UUIDInput, uuidSchema } from "@/schemas";
import {
    adjustStockSchema,
    createInventorySchema,
    paginatedInventoriesSchema
} from "./inv.validation";
import {
    AdjustStockInput,
    CreateInventoryInput,
    PaginatedInventoriesInput
} from "./types";
import { Inventory } from "@prisma/client";
import { productService } from "../product";
import { userService } from "../user";
import { GraphQLContext } from "@/types";

export const inventoryResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves summary metrics for inventory stock statuses.
         *
         * Returns the total counts for each stock status category,
         * including well-stocked, low-stock, critical-out, and
         * below-reorder-level inventory.
         */
        getInventoryStatuses: async () => {
            return inventoryService.getStatuses();
        },

        /**
         * Retrieves an inventory record by its unique identifier.
         *
         * Validates the provided inventory ID before delegating the
         * request to the inventory service. Throws an error if the
         * inventory record cannot be found.
         */
        getInventory: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { inventoryId }: { inventoryId: UUIDInput }) => {
            return inventoryService.getInventory({ id: inventoryId });
        }),

        /**
         * Retrieves a paginated list of inventory records.
         *
         * Supports pagination, filtering, searching, and sorting
         * based on the validated query arguments.
         */
        getInventories: composeResolvers(
            validate(paginatedInventoriesSchema)
        )(async (_: unknown, { args }: { args: PaginatedInventoriesInput }) => {
            return inventoryService.getInventories(args);
        }),

    }),

    Inventory: protectResolvers({

        /**
         * Resolves the product associated with an inventory record.
         *
         * Retrieves the product referenced by the inventory's `productId`.
         */
        product: async (parent: Inventory) => {
            return productService.getProduct({ id: parent.productId });
        },

        /**
         * Resolves the user who created or last managed the inventory record.
         *
         * Retrieves the user referenced by the inventory's `userId`.
         */
        author: async (parent: Inventory) => {
            return userService.getUser({ id: parent.userId });
        },

    }),

    Mutation: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Adjusts the stock level of an inventory item.
         *
         * Validates the adjustment request before delegating the operation
         * to the inventory service. Records the stock movement and returns
         * the updated inventory with its computed stock status.
         */
        adjustStock: composeResolvers(
            validate(adjustStockSchema)
        )(async (
            _: unknown,
            { input }: { input: AdjustStockInput },
            ctx: GraphQLContext
        ) => {
            return inventoryService.adjustStock(ctx.user?.id!, input);
        }),

        /**
         * Creates an inventory record for a product.
         *
         * Validates the inventory data before delegating the operation
         * to the inventory service. Returns the newly created inventory
         * with its computed stock status.
         */
        createInventory: composeResolvers(
            validate(createInventorySchema)
        )(async (
            _: unknown,
            { input }: { input: CreateInventoryInput },
            ctx: GraphQLContext
        ) => {
            return inventoryService.createInventory(ctx.user?.id!, input);
        }),

    }),

};
