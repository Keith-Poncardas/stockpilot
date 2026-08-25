import type { IUserWithInfo } from "@/features/user";
import type { SalePaymentMethod, SaleStatus } from "./union.types";

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
    product: any;
};

/**
 * Detailed representation of a sale, including populated relation data and item counts.
 */
export interface ISaleDetails extends ISale {
    itemsCount: number;
    saleItems: SaleItem[];
    customer: any;
    author: IUserWithInfo;
};