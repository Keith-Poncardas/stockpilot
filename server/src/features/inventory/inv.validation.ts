import { MovementType } from "@prisma/client";
import z from "zod";
import { inventoryIdSchema, orderDirectionLowerSchema, paginationSchema, searchSchema, uuidSchema } from "@/schemas";
import { InventoryOrderBy, OrderDirectionLower, StockStatus } from "@/enums";
import { createMinMaxRefine, minMaxRefineMessage } from "@/utils";

/** STOCK STATUS SCHEMA */
const stockStatusSchema = z.enum(StockStatus);

/** ORDER BY SCHEMA */
const orderBySchema = z.enum(InventoryOrderBy);

/** MOVEMENT TYPE ENUM */
const movementTypeSchema = z.enum(MovementType);

/** FILTER INVENTORY SCHEMA */
export const filterInventorySchema = z.object({
    search: searchSchema,
    stockStatus: stockStatusSchema.default(StockStatus.ALL),
    minQty: z
        .coerce
        .number()
        .int()
        .nonnegative()
        .optional(),
    maxQty: z
        .coerce
        .number()
        .int()
        .nonnegative()
        .optional(),
    minReorderLevel: z
        .coerce
        .number()
        .int()
        .nonnegative()
        .optional(),
    maxReorderLevel: z
        .coerce
        .number()
        .int()
        .nonnegative()
        .optional(),
    orderBy: orderBySchema.default(InventoryOrderBy.UPDATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
}).refine(
    createMinMaxRefine("minQty", "maxQty"),
    minMaxRefineMessage("minQty", "maxQty")
).refine(
    createMinMaxRefine("minReorderLevel", "maxReorderLevel"),
    minMaxRefineMessage("minReorderLevel", "maxReorderLevel")
);

/** PAGINATED INVENTORIES SCHEMA */
export const paginatedInventoriesSchema = paginationSchema.extend({
    filter: filterInventorySchema
});

/** ADJUST STOCK SCHEMA */
export const adjustStockSchema = z.object({
    inventoryId: inventoryIdSchema,
    movementType: movementTypeSchema.default(MovementType.IN),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative("Quantity must be non-negative"),
    reorderLevel: z.coerce
        .number()
        .int()
        .nonnegative("Reorder level must be non-negative"),
    maxStock: z.coerce
        .number()
        .int()
        .nonnegative("Max stock must be non-negative"),
    reason: z
        .enum([
            "damaged",
            "expired",
            "lost",
            "recount",
            "received",
            "customer_return",
            "supplier_return",
            "other",
        ])
        .optional(),
    notes: z
        .string()
        .trim()
        .max(250, "Notes must not exceed 250 characters")
        .optional(),
});

/** TYPE ALIASES */
export type InventoryIdInput = z.infer<typeof inventoryIdSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type PaginatedInventoriesInput = z.infer<typeof paginatedInventoriesSchema>;

/** SEARCH INVENTORY PRODUCTS SCHEMA */
export const searchInventoryProductsSchema = z.object({
    search: searchSchema,
});
export type SearchInventoryProductsInput = z.infer<typeof searchInventoryProductsSchema>;

/** SEARCH INVENTORY PRODUCTS — INFINITE SCROLL SCHEMA */
export const searchInventoryProductsInfiniteSchema = z.object({
    search: searchSchema,
    cursor: z.string().uuid().optional().nullable(),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
export type SearchInventoryProductsInfiniteInput = z.infer<typeof searchInventoryProductsInfiniteSchema>;

/** CREATE INVENTORY SCHEMA */
export const createInventorySchema = z.object({
    productId: uuidSchema("Invalid product ID"),
    quantityOnHand: z.coerce
        .number({ message: "Starting quantity is required" })
        .int("Quantity must be a whole number")
        .min(1, "Starting quantity must be at least 1"),
    reorderLevel: z.coerce
        .number({ message: "Reorder level is required" })
        .int("Reorder level must be a whole number")
        .nonnegative("Reorder level cannot be negative"),
    maxStock: z.coerce
        .number({ message: "Max stock is required" })
        .int("Max stock must be a whole number")
        .nonnegative("Max stock cannot be negative"),
});
export type CreateInventoryInput = z.infer<typeof createInventorySchema>;

