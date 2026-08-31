import * as z from 'zod';

export const productSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(100, 'Product name is too long'),
    sku: z.string().max(50, 'SKU is too long').optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE'], {
        message: 'Please select a status',
    }),
    description: z.string().max(500, 'Description is too long').optional(),
    unitPrice: z.coerce
        .number({ message: 'Selling price is required' })
        .min(0, 'Price cannot be negative'),
    costPrice: z.coerce
        .number({ message: 'Must be a valid number' })
        .min(0, 'Cost cannot be negative')
        .optional(),
    quantityOnHand: z.coerce
        .number({ message: 'Starting quantity is required' })
        .min(0, 'Quantity cannot be negative')
        .int('Quantity must be a whole number'),
    reorderLevel: z.coerce
        .number({ message: 'Reorder level is required' })
        .min(0, 'Reorder level cannot be negative')
        .int('Reorder level must be a whole number'),
    maxStock: z.coerce
        .number({ message: 'Max stock is required' })
        .min(0, 'Max stock cannot be negative')
        .int('Max stock must be a whole number'),
});

export type ProductFormValues = z.input<typeof productSchema>;
