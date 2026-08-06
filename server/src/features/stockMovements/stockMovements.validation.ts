import { MovementReason, MovementType } from "@prisma/client";
import z from "zod";
import { dateRangeRefine, dateRangeRefineMessage, dateRangeSchema, searchSchema, uuidSchema } from "@/schemas";
import { OrderDirectionLower, StockMovementOrderBy } from "@/enums";
import { createMinMaxRefine, minMaxRefineMessage } from "@/utils";
import { paginationSchema } from "@/schemas";

/**
 * Validates the stock movement type.
 *
 * Accepts only the predefined stock movement types.
 */
export const movementTypeSchema = z.enum(MovementType);

/**
 * Validates the stock movement reason.
 *
 * Accepts only the predefined stock movement reasons.
 */
export const movementReasonSchema = z.enum(MovementReason);

/**
 * Validates the field used to sort stock movements.
 *
 * Accepts only the supported stock movement sort fields.
 */
export const orderBySchema = z.enum(StockMovementOrderBy);

/**
 * Validates the sort direction for stock movement queries.
 *
 * Accepts only lowercase sort direction values.
 */
export const orderDirectionLowerSchema = z.enum(OrderDirectionLower);

/**
 * Validates filters for retrieving stock movements.
 *
 * Supports searching, filtering by movement type, product,
 * user, quantity range, date range, and sorting options.
 */
export const filterStockMovementsSchema = dateRangeSchema.extend({
    search: searchSchema,
    movementType: movementTypeSchema.optional(),
    productId: uuidSchema,
    userId: uuidSchema,
    minQty: z.coerce.number().int().nonnegative().optional(),
    maxQty: z.coerce.number().int().nonnegative().optional(),
    orderBy: orderBySchema.default(StockMovementOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),

}).refine(
    createMinMaxRefine("minQty", "maxQty"),
    minMaxRefineMessage("minQty", "maxQty")
).refine(dateRangeRefine, dateRangeRefineMessage);

/**
 * Validates input for paginated retrieval of stock movements.
 *
 * Combines pagination parameters with stock movement filters.
 */
export const paginatedStockMovementsSchema = paginationSchema.extend({
    filter: filterStockMovementsSchema,
});

/**
 * Validates input for creating a new stock movement.
 *
 * Fields mirror the StockMovement model plus an optional
 * reorderLevel that is applied to the linked Inventory record.
 */
export const baseMovementSchema = z.object({
    type: movementTypeSchema,
    quantity: z.coerce
        .number()
        .int("Quantity must be a whole number")
        .nonnegative("Quantity must be 0 or greater"),
    notes: z
        .string()
        .trim()
        .max(500, "Notes must not exceed 500 characters")
        .optional(),
    reorderLevel: z
        .number()
        .int("Reorder level must be a whole number")
        .nonnegative("Reorder level must be 0 or greater")
        .optional(),
});