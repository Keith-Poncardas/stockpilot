import z from "zod";
import { uuidSchema } from "./schema.uuid";
import { paginationSchema } from "./schema.pagination";

/**
 * Type alias for UUID input values.
 *
 * This type is used to represent valid UUID strings or
 * UUID-formatted values that can be processed by the
 * application's validation schemas.
 */
export type UUIDInput = z.infer<
    typeof uuidSchema
>;

/**
 * Type alias for pagination input values.
 *
 * This type is used to represent valid pagination values that can be processed by the
 * application's validation schemas.
 */
export type PaginationInput = z.infer<
    typeof paginationSchema
>;
