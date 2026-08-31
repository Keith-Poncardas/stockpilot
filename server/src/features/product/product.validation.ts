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
 * and draft statuses to be assigned on creation.
 */
const assignableProductStatusSchema = z.enum(
    excludeEnumValue(ProductStatus, [
        ProductStatus.DISCONTINUED,
        ProductStatus.ARCHIVED
    ])
);

/**
 * Validation schema for filtering, sorting, and paginating products.
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
 */
export const paginatedProductsSchema = paginationSchema.extend({
    filter: filterProductsSchema,
});

/**
 * Validation schema for cursor-based infinite search on products.
 */
export const searchProductsInfiniteSchema = infiniteSchema.extend({
    search: searchSchema,
});

/**
 * Base validation schema for product data.
 */
export const baseProductSchemaObject = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty")
        .max(255, "Product name must not exceed 255 characters"),
    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional()
        .nullable(),
    unitPrice: z.coerce
        .number()
        .nonnegative({ message: "Unit price must be a non-negative number" }),
    costPrice: z.coerce
        .number()
        .nonnegative({ message: "Cost price must be a non-negative number" })
        .optional()
        .nullable(),
    sku: z
        .string()
        .trim()
        .max(50, "SKU must not exceed 50 characters")
        .optional()
        .nullable(),
    status: assignableProductStatusSchema.default(ProductStatus.DRAFT),
});

/**
 * Validation schema for creating a new product.
 */
export const addProductSchema = z.object({
    product: baseProductSchemaObject,
    inventory: inventorySchemaObject.optional().nullable(),
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
);

/**
 * Validation schema for updating an existing product.
 */
export const editProductSchema = z.object({
    productId: uuidSchema,
    product: baseProductSchemaObject,
    inventory: inventorySchemaObject.optional().nullable(),
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
);

/**
 * Validation schema for changing a product's status.
 */
export const changeProductStatusSchema = z.object({
    productId: uuidSchema,
    status: productStatusSchema,
});

/**
 * Validation schema for top-selling products query.
 */
export const getTopSellingProductsSchema = z.object({
    sort: z.enum(SortOrder).default(SortOrder.HIGH),
});

/**
 * Validation schema for getting sales by location.
 */
export const getSalesByLocationSchema = z.object({
    sort: z.enum(SortOrder).default(SortOrder.HIGH),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});
