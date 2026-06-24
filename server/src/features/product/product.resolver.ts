import { GraphQLContext } from "@/types";
import { PaginationInput, throwUnauthorized } from "@/utils";
import { productService } from "./product.service";
import { CreateProductInput, EditProductInput, FilterProductsInput } from "./product.validation";

export const productResolver = {

    Query: {

        /**
         * Get product by id
         */
        getProduct: async (
            _: unknown,
            { productId }: { productId: string },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.getProduct(productId);
        },

        /**
         * Get all products (pagination, filter)
         */
        getProducts: async (
            _: unknown,
            {
                pagination,
                filter
            }: {
                pagination: PaginationInput,
                filter?: FilterProductsInput
            },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.getProducts(pagination, filter);
        },

        /**
         * Get total count of products
         */
        totalProducts: async (
            _: unknown,
            { filter }: { filter?: { withDeleted?: boolean } },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.totalProducts(filter?.withDeleted ?? false);
        },

    },

    Mutation: {

        /**
         * Create a new product
         */
        createProduct: async (
            _: unknown,
            input: CreateProductInput,
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.createProduct(input);
        },

        /**
         * Edit a product
         */
        editProduct: async (
            _: unknown,
            input: EditProductInput,
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.editProduct(input);
        },

        /**
         * Soft-delete a product
         */
        softDeleteProduct: async (
            _: unknown,
            { input }: { input: { id: string } },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.deleteProduct(input.id);
        },

        /**
         * Restore a soft-deleted product
         */
        restoreProduct: async (
            _: unknown,
            { input }: { input: { id: string } },
            ctx: GraphQLContext
        ) => {
            if (!ctx.user) throwUnauthorized();
            return productService.restoreProduct(input.id);
        },

    }

};