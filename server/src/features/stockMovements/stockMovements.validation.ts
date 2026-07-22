import { MovementType } from "@prisma/client";
import z from "zod";
import { dateRangeRefine, dateRangeRefineMessage, dateRangeSchema, searchSchema, uuidSchema } from "@/schemas";
import { OrderDirectionLower, StockMovementOrderBy } from "@/enums";
import { createMinMaxRefine, minMaxRefineMessage } from "@/utils";
import { paginationSchema } from "@/schemas";

/**
 * ENUMS
 */
const movementTypeSchema = z.enum(MovementType);

/** Sortable columns exposed for stock-movement list queries */
const orderBySchema = z.enum(StockMovementOrderBy);

/** Sort direction — lowercase to match Prisma's expected values */
const orderDirectionLowerSchema = z.enum(OrderDirectionLower);

export const stockMoveId = uuidSchema();
export const stockMovementIdSchema = z.object({
    id: stockMoveId,
});

export const getMovementDetailsSchema = stockMovementIdSchema;

/**
 * FILTER STOCK MOVEMENTS SCHEMA
 *
 * Supported filters:
 *  - search          → product name or SKU (case-insensitive contains)
 *  - movementType    → IN | OUT | ADJUSTMENT
 *  - productId       → exact product UUID
 *  - userId          → exact user UUID (who performed the movement)
 *  - minQty / maxQty → quantity range (inclusive)
 *  - dateFrom / dateTo → createdAt date range (inclusive)
 *  - orderBy         → createdAt | quantity
 *  - orderDirection  → asc | desc
 */
export const filterStockMovementsSchema = dateRangeSchema.extend({

    /** Full-text search against the linked product name or SKU */
    search: searchSchema,

    /** Filter by movement type */
    movementType: movementTypeSchema.optional(),

    /** Filter by a specific product */
    productId: uuidSchema("Invalid product ID").optional(),

    /** Filter by the user who performed the movement */
    userId: uuidSchema("Invalid user ID").optional(),

    /** Quantity range filters */
    minQty: z.coerce.number().int().nonnegative().optional(),
    maxQty: z.coerce.number().int().nonnegative().optional(),

    /** Sorting */
    orderBy: orderBySchema.default(StockMovementOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),

}).refine(
    createMinMaxRefine("minQty", "maxQty"),
    minMaxRefineMessage("minQty", "maxQty")
).refine(dateRangeRefine, dateRangeRefineMessage);

/**
 * PAGINATED STOCK MOVEMENTS SCHEMA
 *
 * Wraps pagination + filter into a single validated input object,
 * mirroring the paginatedProductsSchema pattern.
 */
export const paginatedStockMovementsSchema = paginationSchema.extend({
    filter: filterStockMovementsSchema,
});

/**
 * RECORD MOVEMENT SCHEMA
 *
 * Validates the input for creating a new stock movement.
 * Fields mirror the StockMovement model plus an optional
 * reorderLevel that is applied to the linked Inventory record.
 */
export const recordMovementSchema = z.object({

    /** UUID of the product whose stock is being adjusted */
    productId: uuidSchema("Invalid product ID"),

    /** UUID of the user who is recording this movement */
    userId: uuidSchema("Invalid user ID"),

    /** Movement direction / kind */
    type: movementTypeSchema,

    /**
     * Quantity involved in the movement.
     * - IN / OUT → positive integer representing units moved
     * - ADJUSTMENT → non-negative integer representing the new absolute quantity
     */
    quantity: z.coerce
        .number()
        .int("Quantity must be a whole number")
        .nonnegative("Quantity must be 0 or greater"),

    /**
     * Optional external reference (e.g. purchase-order number, invoice ID).
     * Max length matches the VarChar column (255).
     */
    reference: z
        .string()
        .trim()
        .max(255, "Reference must not exceed 255 characters")
        .optional(),

    /** Optional free-text note about the movement */
    notes: z
        .string()
        .trim()
        .max(1000, "Notes must not exceed 1 000 characters")
        .optional(),

    /**
     * Optional new reorder threshold to persist on the linked Inventory record.
     * When omitted the existing reorderLevel is left unchanged.
     */
    reorderLevel: z
        .number()
        .int("Reorder level must be a whole number")
        .nonnegative("Reorder level must be 0 or greater")
        .optional(),

});

/**
 * INFERENCE
 */
export type StockMovementIdInput = z.infer<typeof stockMovementIdSchema>;
export type GetMovementDetailsInput = StockMovementIdInput;
export type FilterStockMovementsInput = z.infer<typeof filterStockMovementsSchema>;
export type PaginatedStockMovementsInput = z.infer<typeof paginatedStockMovementsSchema>;
export type RecordMovementInput = z.infer<typeof recordMovementSchema>;
export type MovementTypeFilter = z.infer<typeof movementTypeSchema>;