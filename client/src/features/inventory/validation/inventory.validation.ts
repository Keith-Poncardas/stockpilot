import * as z from "zod";

export const inventoryRecordSchema = z.object({
    productId: z.string().min(1, "Please select a product"),
    searchQuery: z.string().optional(),
    quantityOnHand: z.coerce
        .number({ message: "Starting quantity is required" })
        .int("Quantity must be a whole number")
        .min(1, "Starting quantity must be at least 1"),
    reorderLevel: z.coerce
        .number({ message: "Reorder level is required" })
        .int("Reorder level must be a whole number")
        .min(0, "Reorder level cannot be negative"),
    maxStock: z.coerce
        .number({ message: "Max stock is required" })
        .int("Max stock must be a whole number")
        .min(0, "Max stock cannot be negative"),
});

export type InventoryRecordFormValues = z.infer<typeof inventoryRecordSchema>;
export type InventoryRecordFormInput = z.input<typeof inventoryRecordSchema>;
