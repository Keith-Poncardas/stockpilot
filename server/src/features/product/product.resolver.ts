import { GraphQLContext } from "@/types";
import { throwUnauthorized } from "@/utils";
import { productService } from "./product.service";
import { CreateProductInput, EditProductInput, PaginatedProductsInput } from "./product.validation";
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

    }),

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

    }

};