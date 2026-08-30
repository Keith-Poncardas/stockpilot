import { SaleStatus, SalePaymentMethod, SaleOrderBy } from "../constants";

/**
 * Union type representing the lifecycle status of a sale transaction.
 */
export type SaleStatus = typeof SaleStatus[keyof typeof SaleStatus];

/**
 * Union type representing the payment method used for a sale transaction.
 */
export type SalePaymentMethod = typeof SalePaymentMethod[keyof typeof SalePaymentMethod];

/**
 * Union type representing the fields by which sales can be ordered.
 */
export type SaleOrderBy = typeof SaleOrderBy[keyof typeof SaleOrderBy];
