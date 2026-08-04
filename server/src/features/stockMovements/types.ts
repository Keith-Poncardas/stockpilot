import { paginatedStockMovementsSchema } from "./stockMovements.validation";
import z from "zod";

/**
 * Represents the validated input for requesting a paginated list
 * of stock movements.
 *
 * This type is inferred from the `paginatedStockMovementsSchema`
 * to keep the TypeScript type consistent with the Zod validation schema.
 */
export type PaginatedStockMovementsInput = z.infer<
    typeof paginatedStockMovementsSchema
>;
