import { ProductStatus, SaleItem } from "@prisma/client";
import z from "zod";
import {
    paginatedSalesSchema,
    createSaleItemSchema,
    createSaleSchema,
    changeSaleStatusSchema,
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
    } | null;
};

/**
 * Core data required for an individual item within a sale.
 */
export type SaleItemData = Pick<SaleItem, "productId" | "quantity">;

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