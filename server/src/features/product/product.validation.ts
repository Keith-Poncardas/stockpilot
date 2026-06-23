import { OrderDirectionLower, ProductOrderBy, ProductStatus } from "@/enums";
import { dateRangeSchema, orderDirectionLowerSchema, paginationSchema, productIdSchema, searchSchema } from "@/schemas";
import { createMinMaxRefine, minMaxRefineMessage } from "@/utils";
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
    isAdded: z.coerce.boolean().default(false),
    quantity: z.coerce.number().int().nonnegative(),
    reorderLevel: z.coerce.number().int().nonnegative(),
}).optional();

/**
 * BASE PRODUCT SCHEMA FOR REUSABLE PURPOSES
 */
const baseProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty")
        .max(255, "Product name must not exceed 255 characters"),

    description: z
        .string()
        .trim()
        .optional(),

    sku: z
        .string()
        .trim()
        .max(50, "SKU must not exceed 50 characters"),

    unitPrice: z.coerce
        .number()
        .nonnegative({ message: "Unit price must be a non-negative number" }),

    costPrice: z.coerce
        .number()
        .nonnegative({ message: "Cost price must be a non-negative number" })
        .optional(),
})
    .refine(
        createMinMaxRefine("costPrice", "unitPrice"),
        minMaxRefineMessage("costPrice", "unitPrice")
    );

/**
 *  GET ALL PRODUCTS FILTERED SCHEMA VALIDATION
 */
export const filterProductsSchema = dateRangeSchema.extend({
    search: searchSchema,
    status: productStatusSchema.default(ProductStatus.ALL),
    minPrice: minMaxSchema.optional(),
    maxPrice: minMaxSchema.optional(),
    withDeleted: z.coerce.boolean().default(false),
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
 * CREATE PRODUCT SCHEMA VALIDATION
 */
export const createProductSchema = baseProductSchema.extend({
    addToInventory: addToInventorySchema,
});

/**
 *  EDIT PRODUCT SCHEMA VALIDATION
 */
export const editProductSchema = baseProductSchema.extend({
    productId: productIdSchema,
});

/**
 * PRODUCT TYPE DEFINITIONS
 */
export type PaginatedProductsInput = z.infer<typeof paginatedProductsSchema>;
export type FilterProductsInput = z.infer<typeof filterProductsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type EditProductInput = z.infer<typeof editProductSchema>;
