import type { IUserWithInfo } from "@/features/user";
import type { SalePaymentMethod, SaleStatus } from "./union.types";

export interface ISaleProduct {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    status: string;
}

export interface ISaleCustomer {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    cityCode?: string;
    provinceCode?: string;
    postalCode?: string;
    country?: string;
}

/**
 * Represents the base structure of a sale record.
 */
export interface ISale {
    id: string;
    customerId: string;
    userId: string;
    status: SaleStatus;
    totalAmount: number;
    paymentMethod: SalePaymentMethod;
    saleDate: string;
    createdAt: string;
    updatedAt: string;
};

/**
 * Represents an individual line item within a sale transaction.
 */
export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: ISaleProduct;
};

/**
 * Detailed representation of a sale, including populated relation data and item counts.
 */
export interface ISaleDetails extends ISale {
    itemsCount: number;
    saleItems: SaleItem[];
    customer: ISaleCustomer | null;
    author: IUserWithInfo;
};