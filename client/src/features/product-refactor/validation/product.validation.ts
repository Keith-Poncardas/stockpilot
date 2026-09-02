import * as z from 'zod';

export const productSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(100, 'Product name is too long'),
    sku: z.string().max(50, 'SKU is too long').optional(),
    productType: z.enum(['SIMPLE', 'BUNDLE']).default('SIMPLE'),
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
    regularPrice: z.coerce
        .number({ message: 'Must be a valid number' })
        .min(0, 'Regular price cannot be negative')
        .optional(),
    quantityOnHand: z.coerce
        .number({ message: 'Starting quantity is required' })
        .min(0, 'Quantity cannot be negative')
        .int('Quantity must be a whole number')
        .optional(),
    reorderLevel: z.coerce
        .number({ message: 'Reorder level is required' })
        .min(0, 'Reorder level cannot be negative')
        .int('Reorder level must be a whole number')
        .optional(),
    maxStock: z.coerce
        .number({ message: 'Max stock is required' })
        .min(0, 'Max stock cannot be negative')
        .int('Max stock must be a whole number')
        .optional(),
    bundleItems: z
        .array(
            z.object({
                productId: z.string().min(1, 'Product is required'),
                quantity: z.coerce
                    .number({ message: 'Quantity is required' })
                    .int('Quantity must be a whole number')
                    .positive('Quantity must be at least 1'),
            })
        )
        .optional(),
    pricingTiers: z
        .array(
            z.object({
                minQuantity: z.coerce
                    .number({ message: 'Min quantity is required' })
                    .int('Must be whole number')
                    .positive('Must be at least 1'),
                maxQuantity: z.coerce
                    .number()
                    .int('Must be whole number')
                    .positive()
                    .optional()
                    .nullable(),
                tierPrice: z.coerce
                    .number({ message: 'Tier price is required' })
                    .min(0, 'Price cannot be negative'),
                freeProductId: z.string().optional().nullable(),
                freeQuantity: z.coerce.number().int().min(0).default(0),
            })
        )
        .optional(),
});

export type ProductFormValues = z.input<typeof productSchema>;
