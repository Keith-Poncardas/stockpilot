import z from "zod";
import {
    addProductSchema,
    bundleItemInputSchema,
    pricingTierInputSchema,
    changeProductStatusSchema,
    editProductSchema,
    filterProductsSchema,
    getSalesByLocationSchema,
    getTopSellingProductsSchema,
    paginatedProductsSchema,
    searchProductsInfiniteSchema
} from "./product.validation";

/**
 * Type representing a single bundled product input item.
 */
export type BundleItemInput = z.infer<
    typeof bundleItemInputSchema
>;

/**
 * Type representing a pricing and gift tier input item.
 */
export type PricingTierInput = z.infer<
    typeof pricingTierInputSchema
>;

/**
 * Type representing a product's sales ranking.
 */
export type ProductSalesRanking = {
    id: string;
    name: string;
    quantitySold: number;
    percentage: number;
    rank: number;
};

/**
 * Type representing a product with its sale items.
 */
export type ProductWithSaleItems = {
    id: string;
    name: string;
    saleItems: {
        quantity: number;
        unitPrice: any;
    }[];
};

/**
 * Type representing the validated input for retrieving
 * a paginated list of products.
 */
export type PaginatedProductsInput = z.infer<
    typeof paginatedProductsSchema
>;

/**
 * Type representing the validated product filtering
 * and sorting criteria.
 */
export type FilterProductsInput = z.infer<
    typeof filterProductsSchema
>;

/**
 * Type representing the validated input required
 * to create a new product.
 */
export type AddProductInput = z.infer<
    typeof addProductSchema
>;

/**
 * Type representing the validated input required
 * to update an existing product.
 */
export type EditProductInput = z.infer<
    typeof editProductSchema
>;

/**
 * Type representing the validated input required
 * to change a product's status.
 */
export type ChangeProductStatusInput = z.infer<
    typeof changeProductStatusSchema
>;

/**
 * Type representing the validated input required
 * to search products for inventory.
 */
export type SearchProductsInfiniteInput = z.infer<
    typeof searchProductsInfiniteSchema
>;

/**
 * Type representing the validated input required
 * to get sales by location.
 */
export type getSalesByLocationInput = z.infer<
    typeof getSalesByLocationSchema
>;

/**
 * Type representing the validated input required
 * to get top selling products.
 */
export type getTopSellingProductsInput = z.infer<
    typeof getTopSellingProductsSchema
>;