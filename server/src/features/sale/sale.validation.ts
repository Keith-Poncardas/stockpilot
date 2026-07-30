import z from "zod";
import { SaleStatus } from "@prisma/client";
import { OrderDirectionLower } from "@/enums";
import {
    dateRangeSchema,
    orderDirectionLowerSchema,
    paginationSchema,
    searchSchema,
} from "@/schemas";

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * Sort-by fields available for the sales list.
 */
export enum SaleOrderBy {
    SALE_DATE    = "saleDate",
    TOTAL_AMOUNT = "totalAmount",
}

const saleOrderBySchema = z.nativeEnum(SaleOrderBy);

// ─── Filter Schema ────────────────────────────────────────────────────────────

/**
 * GET SALES FILTER SCHEMA
 * Extends the shared dateRangeSchema so dateFrom / dateTo are pre-coerced to Date.
 */
export const filterSalesSchema = dateRangeSchema.extend({
    /** Full-text search across customer and cashier names */
    search: searchSchema,

    /** Filter by sale status */
    status: z.nativeEnum(SaleStatus).optional(),

    /** Filter by payment method (plain string — no enum to avoid drift) */
    paymentMethod: z
        .string()
        .trim()
        .max(50)
        .optional()
        .transform((val) => (val === "" ? undefined : val)),

    orderBy:        saleOrderBySchema.default(SaleOrderBy.SALE_DATE),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
});

/**
 * PAGINATED SALES SCHEMA
 */
export const paginatedSalesSchema = paginationSchema.extend({
    filter: filterSalesSchema,
});

/**
 * SALES METRICS FILTER SCHEMA
 * A lighter version — only the date range to scope KPI calculations.
 */
export const getSalesMetricsSchema = dateRangeSchema;

/**
 * CREATE SALE SCHEMA
 */
export const createSaleItemSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity:  z.number().int().positive("Quantity must be greater than zero"),
    unitPrice: z.number().nonnegative("Unit price must be non-negative"),
});

export const createSaleSchema = z.object({
    customerId:    z.string().uuid().optional().nullable(),
    paymentMethod: z.string().trim().min(1, "Payment method is required").max(50),
    status:        z.nativeEnum(SaleStatus).optional().default(SaleStatus.COMPLETED),
    items:         z.array(createSaleItemSchema).min(1, "At least one item is required in the cart"),
});

export const changeSaleStatusSchema = z.object({
    saleId: z.string().uuid("Invalid sale ID"),
    status: z.nativeEnum(SaleStatus),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterSalesInput        = z.infer<typeof filterSalesSchema>;
export type PaginatedSalesInput     = z.infer<typeof paginatedSalesSchema>;
export type GetSalesMetricsFilter   = z.infer<typeof getSalesMetricsSchema>;
export type CreateSaleItemInput     = z.infer<typeof createSaleItemSchema>;
export type CreateSaleInput         = z.infer<typeof createSaleSchema>;
export type ChangeSaleStatusInput   = z.infer<typeof changeSaleStatusSchema>;

