import type { Row } from "@tanstack/react-table";

/**
 * Purchase summary for a customer — resolved server-side via CustomerPurchaseSummary.
 */
export interface ICustomerPurchaseSummary {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    firstPurchase: string | null;
    lastPurchase: string | null;
}

/**
 * Shape of a single row returned by GET_CUSTOMERS.
 * Uses `provinceCode` and `cityCode` (not `city`/`province` — those don't exist on Customer).
 * Purchase stats come from the `purchaseSummary` resolver, not flat Customer fields.
 */
export interface ICustomer {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
    cityCode: string | null;
    provinceCode: string | null;
    createdAt: string;
    updatedAt: string;
    purchaseSummary: ICustomerPurchaseSummary;
}

export interface ICustomerSale {
    id: string;
    totalAmount: number;
    status: string;
    saleDate: string;
    paymentMethod?: string | null;
}

export interface ICustomerPurchaseHistory {
    data: ICustomerSale[];
}

/**
 * Full customer detail returned by GET_CUSTOMER.
 * Address fields use PSGC codes (provinceCode, cityCode).
 * All purchase metrics come from the `purchaseSummary` resolver.
 * Transaction history is accessible via the `purchaseHistory` resolver.
 */
export interface ICustomerDetails {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    cityCode: string | null;
    provinceCode: string | null;
    barangayCode: string | null;
    postalCode: string | null;
    country: string | null;
    createdAt: string;
    updatedAt: string;
    purchaseSummary: ICustomerPurchaseSummary;
    purchaseHistory?: ICustomerPurchaseHistory;

    // Optional fields for backward compatibility across components
    city?: string | null;
    province?: string | null;
    barangay?: string | null;
    sales?: ICustomerSale[];
    recentSales?: ICustomerSale[];
    totalOrders?: number;
    totalSpent?: number;
    averageOrderValue?: number;
    firstPurchase?: string | null;
    lastPurchase?: string | null;
}

export interface ICustomerMetrics {
    totalCustomers: number;
    newCustomers: number;
    totalRevenue: number;
    returningCustomers: number;
}

export interface CustomerRowProps {
    row: Row<ICustomer>;
}
