import z from "zod";
import { uuidSchema } from "./schema.uuid";

const limitSchema = z
    .coerce
    .number()
    .int()
    .positive()
    .max(100, "Limit must not exceed 100")
    .default(25);

const pageSchema = z
    .coerce
    .number()
    .int()
    .positive()
    .default(1);

/**
 * Reusable pagination schema.
 * Used by any feature that needs page + limit query params.
 *
 * Defaults: page = 1, limit = 25
 */
export const paginationSchema = z.object({
    limit: limitSchema,
    page: pageSchema,
});

/**
 * Reusable infinite scroll pagination schema.
 * Used by any feature that needs cursor + limit params.
 *
 * Defaults: limit = 20
 */
export const infiniteSchema = z.object({
    cursor: uuidSchema.optional().nullable(),
    limit: limitSchema,
});
