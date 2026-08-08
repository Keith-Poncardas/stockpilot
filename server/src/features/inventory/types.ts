import z from "zod";
import {
    adjustStockSchema,
    createInventorySchema,
    paginatedInventoriesSchema
} from "./inv.validation";

/**
 * Validates the stock movement reason.
 *
 * Accepts only the predefined stock movement reasons.
 */
export type CreateInventoryInput = z.infer<
    typeof createInventorySchema
>;

/**
 * Validates the adjustment stock input.
 *
 * @see adjustStockSchema
 */
export type AdjustStockInput = z.infer<
    typeof adjustStockSchema
>;

/**
 * Validates the paginated inventories input.
 *
 * @see paginatedInventoriesSchema
 */
export type PaginatedInventoriesInput = z.infer<
    typeof paginatedInventoriesSchema
>;