import type { Row } from "@tanstack/react-table";
import type { UserRole } from "../user";

// ─── Sale list row (index table) ──────────────────────────────────────────────

export interface ISaleCustomerName {
    firstName: string | null;
    lastName: string | null;
}

export interface ISaleCashier {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

/**
 * Shape of a single row returned by GET_SALES.
 * Only contains what the index table needs — full details live on a detail page.
 *
 * NOTE: The cashier is `author` (not `user`) as per the backend Sale schema.
 */
export interface ISale {
    id: string;
    saleDate: string;
    totalAmount: number;
    paymentMethod: string | null;
    status: string;
    customer: ISaleCustomerName | null;
    /** The user who processed the sale — mapped from the `author` resolver field. */
    author: ISaleCashier;
    /** Basic info for item count in table. */
    saleItems: { id: string }[];
}

// ─── KPI metrics ──────────────────────────────────────────────────────────────

/**
 * Shape returned by getSalesMetrics.
 * NOTE: `averageOrderValue` does NOT exist in the backend schema.
 * Compute it on the frontend as totalRevenue / totalTransactions if needed.
 */
export interface ISaleMetrics {
    totalRevenue: number;
    completedSales: number;
    totalTransactions: number;
    refundedOrVoidedCount: number;
}

// ─── Row helper ───────────────────────────────────────────────────────────────

export interface SaleRowProps {
    row: Row<ISale>;
}

// ─── Sale detail (view page) ────────────────────────────────────────────────

/**
 * A product nested inside a SaleItem.
 * Only the fields actually returned by the backend are included.
 */
export interface ISaleItemProduct {
    id: string;
    sku: string;
    name: string;
}

/**
 * Shape of a SaleItem as returned by the backend `saleItems` resolver.
 * NOTE: `sku`, `name`, and `totalPrice` do NOT exist directly on SaleItem —
 * they come from the nested `product` relation or are computed on the client.
 */
export interface ISaleDetailItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: ISaleItemProduct;
    /** Computed client-side: quantity * unitPrice */
    totalPrice?: number;
}

export interface ISaleDetailAuthor {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
}

export interface ISaleDetail {
    id: string;
    saleDate: string;
    totalAmount: number;
    paymentMethod?: string;
    status: string;
    customer?: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    } | null;
    /** The user who processed the sale — mapped from the `author` resolver field. */
    author: ISaleDetailAuthor;
    saleItems: ISaleDetailItem[];
}
