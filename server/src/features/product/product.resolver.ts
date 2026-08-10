import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { UUIDInput, uuidSchema } from "@/schemas";
import { productService } from "./product.service";
import {
    addProductSchema,
    changeProductStatusSchema,
    editProductSchema,
    paginatedProductsSchema
} from "./product.validation";
import {
    AddProductInput,
    ChangeProductStatusInput,
    EditProductInput,
    PaginatedProductsInput
} from "./types";
import { GraphQLContext } from "@/types";
import { Product } from "@prisma/client";
import { stockMovementsService } from "../stockMovements";
import { inventoryService } from "../inventory";

export const productResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves a single product by its unique identifier.
         *
         * Validates the provided product ID before delegating the request
         * to the product service. Throws an error if the product cannot
         * be found.
         */
        getProduct: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { productId }: { productId: UUIDInput }) => {
            return productService.getProduct({ id: productId });
        }),

        /**
         * Retrieves a paginated list of products.
         *
         * Supports pagination, filtering, searching, and sorting based
         * on the validated query arguments.
         */
        getProducts: composeResolvers(
            validate(paginatedProductsSchema)
        )(async (_: unknown, { args }: { args: PaginatedProductsInput }) => {
            return productService.getProducts(args);
        }),

        /**
         * Retrieves the total number of products
         * currently stored in the system.
         */
        getTotalProductsCount: async () => {
            return productService.productCount();
        },

        /**
         * Retrieves aggregated product metrics,
         * including the total, active, and draft product counts.
         */
        getProductMetrics: async () => {
            return productService.getProductMetrics();
        },

    }),

    Product: applyErrorHandling({

        /**
         * Retrieves the stock movement associated with the product.
         */
        async stockMovement(parent: Product) {
            return stockMovementsService.getStockMovement({ id: parent.id });
        },

        /**
         * Retrieves the inventory associated with the product.
         */
        async inventory(parent: Product) {
            return inventoryService.getInventory({ productId: parent.id });
        },

    }),

    Mutation: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Creates a new product.
         *
         * Validates both the product and inventory inputs before
         * creating the product and its initial stock-in record.
         */
        createProduct: composeResolvers(
            validate(addProductSchema)
        )(async (
            _: unknown,
            { input }: { input: AddProductInput },
            ctx: GraphQLContext
        ) => {
            return productService.createProduct(ctx.user?.id!, input);
        }),

        /**
         * Updates an existing product.
         *
         * Validates both the product and inventory inputs before
         * updating the product and its stock-in record.
         */
        editProduct: composeResolvers(
            validate(editProductSchema)
        )(async (_: unknown, { input }: { input: EditProductInput }) => {
            return productService.editProduct(input);
        }),

        /**
         * Changes the status of a product.
         *
         * Validates the status transition before updating the product.
         */
        changeProductStatus: composeResolvers(
            validate(changeProductStatusSchema)
        )(async (_: unknown, { input }: { input: ChangeProductStatusInput }) => {
            return productService.changeStatus(input);
        }),

    }),

};