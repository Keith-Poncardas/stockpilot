import { OrderDirectionLower, ProductOrderBy, SortOrder } from "@/enums";
import {
    dateRangeSchema,
    infiniteSchema,
    orderDirectionLowerSchema,
    paginationSchema,
    searchSchema,
    uuidSchema
} from "@/schemas";
import {
    createMinMaxRefine,
    excludeEnumValue,
    minMaxRefineMessage
} from "@/utils";
import { ProductStatus } from '@/generated/client.js';
import z from "zod";
import { refineProductSchema } from "./product.util";
import { inventorySchemaObject } from "../inventory/inv.validation";

/**
 * Validates the status filter for product-related operations.
 *
 * Accepts only values defined in the `ProductStatus` enum.
 */
const productStatusSchema = z.enum(ProductStatus);

/**
 * Validates the field used to sort product query results.
 *
 * Accepts only values defined in the `ProductOrderBy` enum.
 */
const productOrderBySchema = z.enum(ProductOrderBy);

/**
 * Validates a non-negative numeric value.
 *
 * Used for numeric range filters such as minimum and maximum prices.
 * String inputs are automatically coerced to numbers.
 */
const minMaxSchema = z.coerce.number().nonnegative();

/**
 * Validates the status of a product that can be assigned.
 *
 * Excludes discontinued and archived statuses, allowing only active
 * and draft statuses to be assigned.
 */
const assignableProductStatusSchema = z.enum(
    excludeEnumValue(ProductStatus, [
        ProductStatus.DISCONTINUED,
        ProductStatus.ARCHIVED
    ])
);

/**
 * Validation schema for filtering, sorting, and paginating products.
 *
 * Supports:
 * - Keyword search
 * - Product status filtering
 * - Minimum and maximum price range
 * - Creation date range
 * - Custom sorting and sort direction
 *
 * Also validates that `minPrice` is not greater than `maxPrice`.
 */
export const filterProductsSchema = dateRangeSchema.extend({
    search: searchSchema,
    status: productStatusSchema.optional(),
    minPrice: minMaxSchema.optional(),
    maxPrice: minMaxSchema.optional(),
    orderBy: productOrderBySchema.default(ProductOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
}).refine(
    createMinMaxRefine("minPrice", "maxPrice"),
    minMaxRefineMessage("minPrice", "maxPrice")
);

/**
 * Validation schema for retrieving a paginated list of products.
 *
 * Combines pagination options with product-specific filtering
 * and sorting criteria.
 */
export const paginatedProductsSchema = paginationSchema.extend({
    filter: filterProductsSchema,
});

/**
 * Validation schema for filtering, sorting, and paginating products.
 *
 * Supports:
 * - Keyword search
 * - Product status filtering
 * - Minimum and maximum price range
 * - Creation date range
 * - Custom sorting and sort direction
 *
 * Also validates that `minPrice` is not greater than `maxPrice`.
 */
export const searchProductsInfiniteSchema = infiniteSchema.extend({
    search: searchSchema,
});

/**
 * Base validation schema for product data.
 *
 * Defines the common fields shared by product-related operations,
 * including the product name, description, pricing, SKU, and status.
 * This schema is intended to be extended or reused by create and
 * update product validation schemas.
 */
const baseProductSchemaObject = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty")
        .max(255, "Product name must not exceed 255 characters"),
    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    unitPrice: z.coerce
        .number()
        .nonnegative({ message: "Unit price must be a non-negative number" }),

    costPrice: z.coerce
        .number()
        .nonnegative({ message: "Cost price must be a non-negative number" })
        .optional(),
    sku: z
        .string()
        .trim()
        .max(50, "SKU must not exceed 50 characters"),
    status: assignableProductStatusSchema,
});

/**
 * Validation schema for creating a new product.
 *
 * Validates the product details and its initial inventory, ensuring
 * that the cost price does not exceed the unit price.
 */
export const addProductSchema = z.object({
    product: baseProductSchemaObject,
    inventory: inventorySchemaObject
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
);

/**
 * Validation schema for updating an existing product.
 *
 * Requires the product ID along with the updated product and inventory
 * details. Also ensures that the cost price does not exceed the unit price.
 */
export const editProductSchema = z.object({
    productId: uuidSchema,
    product: baseProductSchemaObject
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
);

/**
 * Validation schema for changing a product's status.
 *
 * Requires the product ID and the new status, ensuring that the
 * status value is valid and assignable.
 */
export const changeProductStatusSchema = z.object({
    productId: uuidSchema,
    status: productStatusSchema,
});

/**
 * Validation schema for getting sales by location.
 *
 * Requires the sort order and limit, ensuring that the limit is
 * a positive integer not exceeding 100.
 */
export const getSalesByLocationSchema = z.object({
    sort: z.enum(SortOrder).default(SortOrder.HIGH),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

/**
 * Validation schema for changing a product's status.
 *
 * Requires the product ID and the new status, ensuring that the
 * status value is valid and assignable.
 */
export const getTopSellingProductsSchema = z.object({
    sort: z.enum(SortOrder).default(SortOrder.HIGH),
});
