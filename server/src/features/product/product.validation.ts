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
import { ProductStatus, ProductType } from '@/generated/client.js';
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
 * Validates the product type filter for product-related operations.
 */
const productTypeSchema = z.enum(ProductType);

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
    productType: productTypeSchema.optional(),
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
    hasInventory: z.boolean().optional().nullable(),
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
    regularPrice: z.coerce
        .number()
        .nonnegative({ message: "Regular price must be a non-negative number" })
        .optional()
        .nullable(),
    productType: z.enum(["SIMPLE", "BUNDLE"]).default("SIMPLE"),
    sku: z
        .string()
        .trim()
        .max(50, "SKU must not exceed 50 characters")
        .optional()
        .nullable(),
    imageUrl: z
        .string()
        .trim()
        .url({ message: "Invalid image URL" })
        .optional()
        .nullable(),
    imagePublicId: z
        .string()
        .trim()
        .max(255)
        .optional()
        .nullable(),
    status: assignableProductStatusSchema.default(ProductStatus.DRAFT),
});

/**
 * Validation schema for a single bundled item input.
 */
export const bundleItemInputSchema = z.object({
    productId: uuidSchema,
    quantity: z.coerce.number().int().positive({ message: "Quantity must be at least 1" }),
});

/**
 * Validation schema for a pricing and gift tier.
 */
export const pricingTierInputSchema = z.object({
    minQuantity: z.coerce.number().int().positive({ message: "Min quantity must be at least 1" }),
    maxQuantity: z.coerce.number().int().positive({ message: "Max quantity must be positive" }).optional().nullable(),
    tierPrice: z.coerce.number().nonnegative({ message: "Tier price must be non-negative" }),
    freeProductId: uuidSchema.optional().nullable(),
    freeQuantity: z.coerce.number().int().nonnegative().default(0),
});

/**
 * Validation schema for creating a new product.
 */
export const addProductSchema = z.object({
    product: baseProductSchemaObject,
    inventory: inventorySchemaObject.optional().nullable(),
    bundleItems: z.array(bundleItemInputSchema).optional().nullable(),
    pricingTiers: z.array(pricingTierInputSchema).optional().nullable(),
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
).refine(
    (data) => {
        if (!data.bundleItems || data.bundleItems.length <= 1) return true;
        const ids = data.bundleItems.map((b) => b.productId);
        return new Set(ids).size === ids.length;
    },
    {
        message: "Duplicate bundled products are not allowed",
        path: ["bundleItems"]
    }
);

/**
 * Validation schema for updating an existing product.
 */
export const editProductSchema = z.object({
    productId: uuidSchema,
    product: baseProductSchemaObject,
    inventory: inventorySchemaObject.optional().nullable(),
    bundleItems: z.array(bundleItemInputSchema).optional().nullable(),
    pricingTiers: z.array(pricingTierInputSchema).optional().nullable(),
}).refine(
    refineProductSchema,
    {
        message: "costPrice must be less than or equal to unitPrice",
        path: ["product", "costPrice"]
    }
).refine(
    (data) => {
        if (!data.bundleItems) return true;
        return !data.bundleItems.some((b) => b.productId === data.productId);
    },
    {
        message: "A product cannot be bundled with itself",
        path: ["bundleItems"]
    }
).refine(
    (data) => {
        if (!data.bundleItems || data.bundleItems.length <= 1) return true;
        const ids = data.bundleItems.map((b) => b.productId);
        return new Set(ids).size === ids.length;
    },
    {
        message: "Duplicate bundled products are not allowed",
        path: ["bundleItems"]
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
