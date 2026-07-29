import type { Row } from "@tanstack/react-table";

// ─── Sale list row (index table) ──────────────────────────────────────────────

export interface ISaleCustomerName {
    firstName: string | null;
    lastName: string | null;
}

export interface ISaleCashierName {
    firstName: string;
    lastName: string;
}

/**
 * Shape of a single row returned by GET_SALES.
 * Only contains what the index table needs — full details live on a detail page.
 */
export interface ISale {
    id: string;
    saleDate: string;
    totalAmount: number;
    paymentMethod: string | null;
    status: string;
    customer: ISaleCustomerName | null;
    user: ISaleCashierName;
    itemCount: number;
}

// ─── KPI metrics ──────────────────────────────────────────────────────────────

export interface ISaleMetrics {
    totalRevenue: number;
    totalTransactions: number;
    averageOrderValue: number;
    refundedOrVoidedCount: number;
}

// ─── Row helper ───────────────────────────────────────────────────────────────

export interface SaleRowProps {
    row: Row<ISale>;
}
