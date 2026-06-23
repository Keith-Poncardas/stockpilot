import z from "zod";

/**
 * Reusable pagination schema.
 * Used by any feature that needs page + limit query params.
 *
 * Defaults: page = 1, limit = 25
 */
export const paginationSchema = z.object({
    limit: z
        .coerce
        .number()
        .int()
        .positive()
        .max(100, "Limit must not exceed 100")
        .default(25),
    page: z
        .coerce
        .number()
        .int()
        .positive()
        .default(1),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
