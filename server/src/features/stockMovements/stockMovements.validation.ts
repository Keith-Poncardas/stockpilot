import { MovementType } from "@prisma/client";
import z from "zod";
import { dateRangeRefine, dateRangeRefineMessage, searchSchema, uuidSchema } from "@/schemas";
import { OrderDirection, StockMovementOrderBy } from "@/enums";

/**
 * ENUMS
 */
const movementTypeSchema = z.enum(MovementType);
const orderDirectionSchema = z.enum(OrderDirection);

/** Sortable columns exposed for stock-movement list queries */
const orderBySchema = z.enum(StockMovementOrderBy);

export const stockMoveId = uuidSchema();
export const stockMovementIdSchema = z.object({
    id: stockMoveId,
});

export const getMovementDetailsSchema = stockMovementIdSchema;

/**
 * GET ALL STOCK MOVEMENTS — FILTER SCHEMA
 *
 * Supported filters:
 *  - search          → product name or SKU (case-insensitive contains)
 *  - movementType    → IN | OUT | ADJUSTMENT
 *  - productId       → exact product UUID
 *  - userId          → exact user UUID (who performed the movement)
 *  - minQty / maxQty → quantity range (inclusive)
 *  - dateFrom / dateTo → createdAt date range (inclusive)
 *  - orderBy         → createdAt | quantity
 *  - orderDirection  → ASC | DESC
 */
export const getAllStockMovementsSchema = z
    .object({

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

        /** Date range filters (ISO strings are coerced to Date) */
        dateFrom: z.coerce.date().optional(),
        dateTo: z.coerce.date().optional(),

        /** Sorting */
        orderBy: orderBySchema.default(StockMovementOrderBy.CREATED_AT),
        orderDirection: orderDirectionSchema.default(OrderDirection.DESC),

    })
    .refine(
        (data) => {
            if (data.minQty !== undefined && data.maxQty !== undefined) {
                return data.minQty <= data.maxQty;
            }
            return true;
        },
        { message: "minQty must be less than or equal to maxQty", path: ["minQty"] }
    )
    .refine(dateRangeRefine, dateRangeRefineMessage);

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
export type GetAllStockMovementsInput = z.infer<typeof getAllStockMovementsSchema>;
export type RecordMovementInput = z.infer<typeof recordMovementSchema>;
export type MovementTypeFilter = z.infer<typeof movementTypeSchema>;
export type StockMovementOrderBy = z.infer<typeof orderBySchema>;