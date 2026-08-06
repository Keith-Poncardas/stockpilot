import z from "zod";
import {
    addProductSchema,
    changeProductStatusSchema,
    editProductSchema,
    filterProductsSchema,
    paginatedProductsSchema,
    searchProductsInfiniteSchema
} from "./product.validation";

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