import z from "zod";
import { PaymentMethod, SaleStatus } from '@/generated/client.js';
import { OrderDirectionLower, SaleOrderBy } from "@/enums";
import {
    dateRangeSchema,
    orderDirectionLowerSchema,
    paginationSchema,
    searchSchema,
    uuidSchema,
} from "@/schemas";
import { SalesOverviewPeriod } from "./constants";

/**
 * SALE ORDER BY SCHEMA
 * Validates the field to order sales by using the SaleOrderBy enum.
 */
const saleOrderBySchema = z.enum(SaleOrderBy);

/**
 * PAYMENT METHOD SCHEMA
 * Validates the payment method using the PaymentMethod enum.
 */
const paymentMethodSchema = z.enum(PaymentMethod);

/**
 * SALE STATUS SCHEMA
 * Validates the sale status using the SaleStatus enum.
 */
const saleStatusSchema = z.enum(SaleStatus);

export const salesOverviewPeriodSchema = z.enum(SalesOverviewPeriod);

/**
 * SALES OVERVIEW QUERY SCHEMA
 * Validates the sales overview query parameters including period and optional productId.
 */
export const salesOverviewQuerySchema = z.object({
    period: salesOverviewPeriodSchema,
    productId: uuidSchema.optional().nullable(),
});

/**
 * FILTER SALES SCHEMA
 * Extends the shared dateRangeSchema to include search, status, payment method, order by, and order direction fields for filtering sales.
 */
export const filterSalesSchema = dateRangeSchema.extend({
    search: searchSchema,
    customerId: uuidSchema.optional(),
    status: saleStatusSchema.optional(),
    paymentMethod: paymentMethodSchema.optional(),
    orderBy: saleOrderBySchema.default(SaleOrderBy.SALE_DATE),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
});

/**
 * PAGINATED SALES SCHEMA
 * Extends the shared paginationSchema to include the filterSalesSchema for paginated sales requests.
 */
export const paginatedSalesSchema = paginationSchema.extend({
    filter: filterSalesSchema,
});


/**
 * CREATE SALE ITEM SCHEMA
 * Validates the details of a single item within a sale.
 */
export const createSaleItemSchema = z.object({
    productId: uuidSchema,
    quantity: z
        .number()
        .int()
        .positive("Quantity must be greater than zero")
        .max(10000, "Quantity cannot exceed 10,000 per item"),
    unitPrice: z
        .number()
        .nonnegative("Unit price must be non-negative")
        .max(100000000, "Unit price exceeds maximum allowed value"),
});

/**
 * SALE ITEMS ARRAY SCHEMA
 * Validates an array of sale items, ensuring at least one item is provided.
 */
export const saleItemSchema = z.array(createSaleItemSchema)
    .min(1, "At least one item is required in the cart")
    .max(100, "Maximum of 100 different items per sale allowed")
    .refine(
        (items) => {
            const productIds = items.map((i) => i.productId);
            return new Set(productIds).size === productIds.length;
        },
        { message: "Duplicate products are not allowed in the same sale" }
    );

/**
 * CREATE SALE SCHEMA
 * Validates the payload for creating a new sale, including customer, payment, status, and items.
 */
export const createSaleSchema = z.object({
    customerId: uuidSchema.nullish(),
    paymentMethod: paymentMethodSchema,
    status: saleStatusSchema
        .optional()
        .default(SaleStatus.COMPLETED),
    items: saleItemSchema,
});

/**
 * CHANGE SALE STATUS SCHEMA
 * Validates the payload for updating the status of an existing sale.
 */
export const changeSaleStatusSchema = z.object({
    saleId: uuidSchema,
    status: saleStatusSchema,
});
