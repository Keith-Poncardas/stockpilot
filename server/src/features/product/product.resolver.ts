import { GraphQLContext } from "@/types";
import { throwUnauthorized } from "@/utils";
import { productService } from "./product.service";
import { ChangeProductStatusInput, CreateProductInput, EditProductInput, PaginatedProductsInput } from "./product.validation";
import { protectResolvers } from "@/graphql/helpers";
import { UUIDInput } from "@/schemas";

export const productResolver = {

    Query: protectResolvers({

        /**
         * Get product by id
         */
        getProduct: async (
            _: unknown,
            { productId }: { productId: UUIDInput }
        ) => {
            return productService.getProduct(productId);
        },

        /**
         * Get all products (pagination, filter)
         */
        getProducts: async (
            _: unknown,
            { args }: { args: PaginatedProductsInput }
        ) => {
            return productService.getProducts(args);
        },

        /**
         * Get total products count
         */
        getTotalProductsCount: async () => {
            return productService.getTotalProductsCount();
        },

        /**
         * Get product metrics (Total, Active, Draft)
         */
        getProductMetrics: async () => {
            return productService.getProductMetrics();
        },

    }),

    Mutation: protectResolvers({

        /**
         * Create a new product
         */
        createProduct: async (
            _: unknown,
            { input }: { input: CreateProductInput },
        ) => {
            return productService.createProduct(input);
        },

        /**
         * Edit a product
         */
        editProduct: async (
            _: unknown,
            { input }: { input: EditProductInput }
        ) => {
            return productService.editProduct(input);
        },

        /**
         * Change a product's status
         */
        changeProductStatus: async (
            _: unknown,
            { input }: { input: ChangeProductStatusInput },
        ) => {
            return productService.changeStatus(input);
        },

    })

};