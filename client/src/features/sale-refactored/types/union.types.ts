import { SaleStatus, SalePaymentMethod } from "../constants";

/**
 * Union type representing the lifecycle status of a sale transaction.
 */
export type SaleStatus = typeof SaleStatus[keyof typeof SaleStatus];

/**
 * Union type representing the payment method used for a sale transaction.
 */
export type SalePaymentMethod = typeof SalePaymentMethod[keyof typeof SalePaymentMethod];
