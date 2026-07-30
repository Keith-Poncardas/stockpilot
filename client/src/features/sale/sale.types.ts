import type { Row } from "@tanstack/react-table";
import type { UserRole } from "../user";

// ─── Sale list row (index table) ──────────────────────────────────────────────

export interface ISaleCustomerName {
    firstName: string | null;
    lastName: string | null;
}

export interface ISaleCashierName {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
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

// ─── Sale detail (view page) ────────────────────────────────────────────────

export interface ISaleDetailItem {
    id: string;
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
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
    user: {
        id: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        email: string;
    };
    items: ISaleDetailItem[];
}

