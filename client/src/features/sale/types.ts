import type { IUser } from "../user";
import { SaleStatus, PaymentMethod } from "./constants";

/**
 * Union type representing the lifecycle status of a sale transaction.
 */
export type SaleStatus = typeof SaleStatus[keyof typeof SaleStatus];

/**
 * Union type representing the payment method used for a sale transaction.
 */
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

/**
 * Represents the base structure of a sale record.
 */
export interface ISale {
    id: string;
    customerId?: string | null;
    userId: string;
    status: SaleStatus;
    totalAmount: number;
    paymentMethod?: PaymentMethod | null;
    saleDate: string;
    createdAt: string;
    updatedAt: string;
};

/**
 * Detailed representation of a sale, including populated relation data.
 */
export interface ISaleDetails extends ISale {
    customer?: any | null;
    author: IUser;
    saleItems: ISaleItem[];
};

/**
 * Represents an individual item associated with a sale.
 */
export interface ISaleItem {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: any;
};

/**
 * Local state filters for managing active filters on the sales table.
 */
export interface ISaleFilters {
    status: string;
    paymentMethod: string;
    orderBy: string;
    orderDirection: string;
    dateFrom: string;
    dateTo: string;
}

/**
 * Filter shape constructed for the Apollo GraphQL sales query.
 */
export interface ISaleQueryFilters {
    search?: string;
    status?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: string;
    orderDirection?: string;
}
