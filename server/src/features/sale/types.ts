import { ProductStatus, SaleItem, Prisma } from '@/generated/client.js';
import z from "zod";
import {
    paginatedSalesSchema,
    createSaleItemSchema,
    createSaleSchema,
    changeSaleStatusSchema,
    salesOverviewPeriodSchema,
} from "./sale.validation";

/**
 * Represents a product along with its associated inventory details.
 */
export type ProductWithInventory = {
    id: string;
    name: string;
    status: ProductStatus;
    inventory?: {
        quantityOnHand: number;
        quantityReserved: number;
    } | null;
};

/**
 * Represents a single item in the sales overview, including its label,
 * date, sales count, and active status.
 */
export interface SalesOverviewItem {
    label: string;
    date: string;
    sales: number;
    isActive: boolean;
}

/**
 * Represents a row returned by the sales location query.
 */
export type SalesLocationRow = {
    city: string | null;
    revenue: Prisma.Decimal;
};

/**
 * Core data required for an individual item within a sale.
 */
export type SaleItemData = Pick<
    SaleItem,
    "productId" | "quantity"
>;

/**
 * Input structure for fetching paginated sales records.
 */
export type PaginatedSalesInput = z.infer<
    typeof paginatedSalesSchema
>;

/**
 * Input structure for creating a single sale item.
 */
export type CreateSaleItemInput = z.infer<
    typeof createSaleItemSchema
>;

/**
 * Input structure for creating a new sale.
 */
export type CreateSaleInput = z.infer<
    typeof createSaleSchema
>;

/**
 * Input structure for updating the status of an existing sale.
 */
export type ChangeSaleStatusInput = z.infer<
    typeof changeSaleStatusSchema
>;

/**
 * Input structure for fetching sales overview data.
 */
export type SalesOverviewInput = z.infer<
    typeof salesOverviewPeriodSchema
>;

/**
 * Represents a single row returned by the sales aggregation query.
 */
export type SalesAggregationRow = {
    bucket: Date;
    sales: Prisma.Decimal;
};