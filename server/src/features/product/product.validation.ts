import { OrderDirectionLower, ProductOrderBy } from "@/enums";
import { dateRangeSchema, orderDirectionLowerSchema, paginationSchema, productIdSchema, searchSchema } from "@/schemas";
import { createMinMaxRefine, excludeEnumValue, minMaxRefineMessage } from "@/utils";
import { ProductStatus } from "@prisma/client";
import z from "zod";

/**
 * PRODUCT STATUS SCHEMA
 */
const productStatusSchema = z.enum(ProductStatus);

/** ORDER BY PRODUCT SCHEMA */
const productOrderBySchema = z.enum(ProductOrderBy);

/**
 * MIN AND MAX PRICE SCHEMA
 */
const minMaxSchema = z.coerce.number().nonnegative();

/**
 * ADD TO INVENTORY SCHEMA
 */
const addToInventorySchema = z.object({
    quantity: z.coerce.number().int().nonnegative(),
    reorderLevel: z.coerce.number().int().nonnegative(),
    maxStock: z.coerce.number().int().nonnegative(),
}).optional();

/**
 * BASE PRODUCT SCHEMA FOR REUSABLE PURPOSES
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
        .optional(),

    unitPrice: z.coerce
        .number()
        .nonnegative({ message: "Unit price must be a non-negative number" }),

    costPrice: z.coerce
        .number()
        .nonnegative({ message: "Cost price must be a non-negative number" })
        .optional(),
});

/**
 *  GET ALL PRODUCTS FILTERED SCHEMA VALIDATION
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
 * PAGINATED PRODUCTS SCHEMA VALIDATION
 */
export const paginatedProductsSchema = paginationSchema.extend({
    filter: filterProductsSchema
});

/**
 * ASSIGNABLE PRODUCT STATUS SCHEMA
 */
const assignableProductStatusSchema = z.enum(
    excludeEnumValue(ProductStatus, [
        ProductStatus.DISCONTINUED,
        ProductStatus.ARCHIVED
    ])
);

/**
 * CREATE PRODUCT SCHEMA VALIDATION
 */
export const createProductSchema = baseProductSchemaObject.extend({
    sku: z
        .string()
        .trim()
        .max(50, "SKU must not exceed 50 characters")
        .optional(),
    status: assignableProductStatusSchema,
    addToInventory: addToInventorySchema,
}).refine(
    createMinMaxRefine("costPrice", "unitPrice"),
    minMaxRefineMessage("costPrice", "unitPrice")
);

/**
 *  EDIT PRODUCT SCHEMA VALIDATION
 */
export const editProductSchema = baseProductSchemaObject.extend({
    productId: productIdSchema,
    status: assignableProductStatusSchema,
    addToInventory: addToInventorySchema,
}).refine(
    createMinMaxRefine("costPrice", "unitPrice"),
    minMaxRefineMessage("costPrice", "unitPrice")
);

/**
 * CHANGE PRODUCT STATUS SCHEMA VALIDATION
 */
export const changeProductStatusSchema = z.object({
    productId: productIdSchema,
    status: productStatusSchema,
});

/**
 * PRODUCT TYPE DEFINITIONS
 */
export type PaginatedProductsInput = z.infer<typeof paginatedProductsSchema>;
export type FilterProductsInput = z.infer<typeof filterProductsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type EditProductInput = z.infer<typeof editProductSchema>;
export type ChangeProductStatusInput = z.infer<typeof changeProductStatusSchema>;
