import { GraphQLContext } from "@/types";
import { inventoryService } from "./inv.service";
import { protectResolvers } from "@/graphql/helpers";
import { AdjustStockInput, CreateInventoryInput, PaginatedInventoriesInput } from "./inv.validation";
import { UUIDInput } from "@/schemas";

export const inventoryResolver = {

    Query: protectResolvers({

        /**
         * Count of inventory items grouped by stock status:
         * wellStocked / lowStock / criticalOut / belowReorderLevel
         */
        getInventoryStatuses: async () => {
            return inventoryService.getStatuses();
        },

        /**
         * Get a single inventory record by ID (includes linked product)
         */
        getInventory: async (
            _: unknown,
            { inventoryId }: { inventoryId: UUIDInput }
        ) => {
            return inventoryService.getInventory(inventoryId);
        },

        /**
         * Get a paginated + filtered list of inventory records
         */
        getInventories: async (
            _: unknown,
            { input }: { input: PaginatedInventoriesInput }
        ) => {
            return inventoryService.getInventories(input);
        },

        /**
         * Search products for inventory addition
         */
        searchInventoryProducts: async (
            _: unknown,
            { search }: { search?: string | null }
        ) => {
            return inventoryService.searchInventoryProducts(search);
        },

    }),

    Mutation: protectResolvers({

        /**
         * Adjust stock quantity.
         * Automatically creates a StockMovement record under the hood.
         */
        adjustStock: async (
            _: unknown,
            { input }: { input: AdjustStockInput },
            ctx: GraphQLContext
        ) => {
            return inventoryService.adjustStock(ctx.user!.id, input);
        },

        /**
         * Create an initial inventory record for a product.
         * Guards: product must exist, no duplicate inventory allowed.
         */
        createInventory: async (
            _: unknown,
            { input }: { input: CreateInventoryInput },
            ctx: GraphQLContext
        ) => {
            return inventoryService.createInventory(ctx.user!.id, input);
        },

    }),

};
