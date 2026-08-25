
import z from "zod";
import {
    baseFilterSchema,
    orderDirectionLowerSchema,
    paginationSchema,
    uuidSchema
} from "@/schemas";
import { InventoryOrderBy, OrderDirectionLower, StockStatus } from "@/enums";
import { createMinMaxRefine, minMaxRefineMessage } from "@/utils";
import { baseMovementSchema } from "../stockMovements/stockMovements.validation";

/**
 * Validates the stock status filter for inventory queries.
 *
 * Accepts only values defined in the `StockStatus` enum.
 */
const stockStatusSchema = z.enum(StockStatus);

/**
 * Validates the field used to sort inventory query results.
 *
 * Accepts only values defined in the `InventoryOrderBy` enum.
 */
const orderBySchema = z.enum(InventoryOrderBy);

/**
 * Validation schema for filtering, sorting, and paginating inventory records.
 *
 * Supports keyword search, stock status filtering, quantity-on-hand
 * range, reorder-level range, and customizable sorting. Also validates
 * that the minimum values do not exceed their corresponding maximum values.
 */
export const filterInventorySchema = baseFilterSchema.extend({
    stockStatus: stockStatusSchema.default(StockStatus.ALL),
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

/**
 * Validation schema for retrieving a paginated list of inventory records.
 *
 * Combines pagination options with inventory-specific filtering
 * and sorting criteria.
 */
export const paginatedInventoriesSchema = paginationSchema.extend({
    filter: filterInventorySchema
});

/**
 * Validation schema for adjusting an inventory item's stock.
 *
 * Requires the inventory ID along with the validated
 * stock movement details.
 */
export const adjustStockSchema = z.object({
    inventoryId: uuidSchema,
    movement: baseMovementSchema
});

/**
 * Base validation schema for inventory data.
 *
 * Defines the common inventory fields shared by inventory-related
 * operations, including quantity on hand, reorder level,
 * and maximum stock level.
 */
export const inventorySchemaObject = z.object({
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

/**
 * Validation schema for creating an inventory record.
 *
 * Requires the associated product ID and the
 * initial inventory details.
 */
export const createInventorySchema = z.object({
    productId: uuidSchema,
    inventory: inventorySchemaObject
});
