import z from "zod";

/**
 * Reusable UUID schema.
 * Use this as a base for all entity ID fields.
 *
 * @example
 *   export const userIdSchema = uuidSchema("Invalid user ID");
 *   export const productIdSchema = uuidSchema("Invalid product ID");
 */
export const uuidSchema = z.uuid("Invalid UUID");
export type UUIDInput = z.infer<typeof uuidSchema>;