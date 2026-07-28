import type { Row } from "@tanstack/react-table";

export interface ICustomer {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
    city: string | null;
    province: string | null;
    totalOrders: number;
    totalSpent: number;
    lastPurchase: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ICustomerSale {
    id: string;
    totalAmount: number;
    status: string;
    saleDate: string;
    paymentMethod?: string | null;
}

export interface ICustomerDetails {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    country: string | null;
    totalOrders?: number;
    totalSpent?: number;
    averageOrderValue?: number;
    firstPurchase?: string | null;
    lastPurchase?: string | null;
    purchaseSummary: {
        totalOrders: number;
        totalSpent: number;
        averageOrderValue: number;
        firstPurchase: string | null;
        lastPurchase: string | null;
    };
    recentSales: ICustomerSale[];
    sales?: ICustomerSale[];
    createdAt: string;
    updatedAt: string;
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
