import z from "zod";

/**
 * Reusable UUID schema.
 * Use this as a base for all entity ID fields.
 *
 * @example
 *   export const userIdSchema = uuidSchema("Invalid user ID");
 *   export const productIdSchema = uuidSchema("Invalid product ID");
 */
export const uuidSchema = (message = "Invalid ID") => z.uuid(message);

/** Pre-built aliases for common entity IDs */
export const userIdSchema     = uuidSchema("Invalid user ID");
export const productIdSchema  = uuidSchema("Invalid product ID");
export const inventoryIdSchema = uuidSchema("Invalid inventory ID");
export const customerId       = uuidSchema("Invalid customer ID");

export type UUIDInput = z.infer<ReturnType<typeof uuidSchema>>;
