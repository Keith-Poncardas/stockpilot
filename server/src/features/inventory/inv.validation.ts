import { MovementType } from "@prisma/client";
import z from "zod";
import { inventoryIdSchema, orderDirectionLowerSchema, paginationSchema, searchSchema } from "@/schemas";
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
    reference: z
        .string()
        .trim()
        .max(50, "Reference must not exceed 50 characters")
        .optional(),
    notes: z
        .string()
        .trim()
        .max(100, "Notes must not exceed 100 characters")
        .optional(),
});

/** TYPE ALIASES */
export type InventoryIdInput = z.infer<typeof inventoryIdSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type PaginatedInventoriesInput = z.infer<typeof paginatedInventoriesSchema>;
