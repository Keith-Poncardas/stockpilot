import * as z from 'zod';

export const inventoryRecordSchema = z.object({
    productId: z.string().min(1, 'Please select a product'),
    searchQuery: z.string().optional(),
    quantityOnHand: z
        .number({ message: 'Starting quantity is required' })
        .int('Quantity must be a whole number')
        .min(0, 'Starting quantity cannot be negative'),
    reorderLevel: z
        .number({ message: 'Reorder level is required' })
        .int('Reorder level must be a whole number')
        .min(0, 'Reorder level cannot be negative'),
    maxStock: z
        .number({ message: 'Max stock is required' })
        .int('Max stock must be a whole number')
        .min(0, 'Max stock cannot be negative'),
});

export const adjustStockSchema = z.object({
    adjustmentType: z.enum(['increase', 'decrease', 'set'], {
        message: 'Please select an adjustment type',
    }),
    quantity: z
        .number({ message: 'Quantity is required' })
        .int('Quantity must be a whole number')
        .min(1, 'Quantity must be at least 1'),
    reason: z
        .enum([
            'SALE',
            'PURCHASE',
            'ADJUSTMENT',
            'RETURN',
            'DAMAGE',
            'EXPIRED',
            'TRANSFER',
            'INITIAL_STOCK',
        ])
        .optional(),
    reference: z.string().optional(),
    notes: z.string().max(250, 'Notes cannot exceed 250 characters').optional(),
});

export const updateReorderLevelSchema = z.object({
    reorderLevel: z
        .number({ message: 'Reorder level is required' })
        .int('Reorder level must be a whole number')
        .min(0, 'Reorder level cannot be negative'),
    maxStock: z
        .number({ message: 'Max stock is required' })
        .int('Max stock must be a whole number')
        .min(0, 'Max stock cannot be negative')
        .optional(),
    notes: z.string().max(250, 'Notes cannot exceed 250 characters').optional(),
});

export type InventoryRecordFormValues = z.infer<typeof inventoryRecordSchema>;
export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;
export type UpdateReorderLevelFormValues = z.infer<typeof updateReorderLevelSchema>;
