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
    paginatedProductsSchema,
    searchProductsInfiniteSchema
} from "./product.validation";
import {
    AddProductInput,
    ChangeProductStatusInput,
    EditProductInput,
    PaginatedProductsInput,
    SearchProductsInfiniteInput
} from "./types";
import { GraphQLContext } from "@/types";
import { Product } from '@/generated/client.js';
import { prisma } from "@/lib";
import { stockMovementsService } from "../stockMovements";
import { inventoryService } from "../inventory";
import { resolveStockStatus } from "../inventory/inv.utils";
import { saleService } from "../sale";
import { SalesOverviewPeriod } from "../sale/constants";

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
         * Retrieves an infinite-scroll list of products for search dropdowns.
         */
        searchProductsInfinite: composeResolvers(
            validate(searchProductsInfiniteSchema)
        )(async (_: unknown, { input }: { input: SearchProductsInfiniteInput }) => {
            return productService.searchProductsInfinite(input);
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
        async inventory(parent: any) {
            if (parent.inventory !== undefined) {
                if (!parent.inventory) return null;
                return {
                    ...parent.inventory,
                    stockStatus: resolveStockStatus(parent.inventory.quantityOnHand, parent.inventory.reorderLevel),
                };
            }
            return inventoryService.findInventory({ productId: parent.id });
        },

        /**
         * Retrieves the bundled items attached to the product.
         */
        async bundleItems(parent: any) {
            if (parent.bundleItems) return parent.bundleItems;
            return prisma.productBundleItem.findMany({
                where: { parentProductId: parent.id },
                include: {
                    bundledProduct: {
                        include: { inventory: true },
                    },
                },
            });
        },

        /**
         * Retrieves the volume pricing and gift tiers attached to the product.
         */
        async pricingTiers(parent: any) {
            if (parent.pricingTiers) return parent.pricingTiers;
            return prisma.productPricingTier.findMany({
                where: { productId: parent.id },
                orderBy: { minQuantity: 'asc' },
                include: {
                    freeProduct: {
                        include: { inventory: true },
                    },
                },
            });
        },

        /**
         * Retrieves aggregated sales performance metrics for the product.
         */
        async performanceMetrics(parent: Product) {
            return productService.getProductPerformanceMetrics(parent.id);
        },

        /**
         * Retrieves the 7-day daily sales trend for the product directly via saleService.
         */
        async salesTrend(parent: Product) {
            return saleService.getSalesOverview(SalesOverviewPeriod.DAILY, parent.id);
        },

    }),

    ProductBundleItem: applyErrorHandling({
        async product(parent: any) {
            if (parent.bundledProduct) return parent.bundledProduct;
            return prisma.product.findUniqueOrThrow({
                where: { id: parent.bundledProductId },
                include: { inventory: true },
            });
        },
    }),

    ProductPricingTier: applyErrorHandling({
        async freeProduct(parent: any) {
            if (parent.freeProduct) return parent.freeProduct;
            if (!parent.freeProductId) return null;
            return prisma.product.findUnique({
                where: { id: parent.freeProductId },
                include: { inventory: true },
            });
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
        )(async (
            _: unknown,
            { input }: { input: EditProductInput },
            ctx: GraphQLContext
        ) => {
            return productService.editProduct(ctx.user?.id!, input);
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