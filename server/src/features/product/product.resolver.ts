import { GraphQLContext } from "@/types";
import { throwUnauthorized } from "@/utils";
import { productService } from "./product.service";
import { ChangeProductStatusInput, CreateProductInput, EditProductInput, PaginatedProductsInput } from "./product.validation";
import { protectResolvers } from "@/graphql/helpers";
import { UUIDInput } from "@/schemas";
import { prisma } from "@/lib";

export const productResolver = {
    Product: {
        quantityOnHand: async (parent: any) => {
            if (parent.quantityOnHand !== undefined) return parent.quantityOnHand;
            const inv = await prisma.inventory.findFirst({ where: { productId: parent.id } });
            return inv?.quantityOnHand ?? 0;
        },
        reorderLevel: async (parent: any) => {
            if (parent.reorderLevel !== undefined) return parent.reorderLevel;
            const inv = await prisma.inventory.findFirst({ where: { productId: parent.id } });
            return inv?.reorderLevel ?? 0;
        },
        inventory: async (parent: any) => {
            if (parent.inventory !== undefined) return parent.inventory;
            const inv = await prisma.inventory.findFirst({ where: { productId: parent.id } });
            if (!inv) return null;
            return {
                id: inv.id,
                quantityOnHand: inv.quantityOnHand,
                reorderLevel: inv.reorderLevel,
                maxStock: inv.maxStock ?? 0,
                lastRestockDate: inv.updatedAt.toISOString(),
                estimatedDaysOfStock: 30,
            };
        },
    },

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
            context: GraphQLContext
        ) => {
            return productService.createProduct(input, context.user!.id);
        },

        /**
         * Edit a product
         */
        editProduct: async (
            _: unknown,
            { input }: { input: EditProductInput },
            context: GraphQLContext
        ) => {
            return productService.editProduct(input, context.user!.id);
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