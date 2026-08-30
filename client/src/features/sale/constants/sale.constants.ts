/**
 * Represents the status of a sale transaction.
 * 
 * @constant
 * @type {Object}
 * @property {string} PENDING - The sale is pending payment or processing.
 * @property {string} COMPLETED - The sale has been completed successfully.
 * @property {string} REFUNDED - The sale total or items have been refunded.
 * @property {string} VOIDED - The sale has been voided/cancelled.
 */
export const SaleStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    REFUNDED: 'REFUNDED',
    VOIDED: 'VOIDED'
} as const;

/**
 * Represents the payment methods available for a sale transaction.
 * 
 * @constant
 * @type {Object}
 * @property {string} CASH - Payment made using physical currency.
 * @property {string} GCASH - Payment made via the GCash mobile wallet.
 * @property {string} BANK_TRANSFER - Payment made via direct bank transfer.
 * @property {string} CREDIT_CARD - Payment made via credit card.
 * @property {string} DEBIT_CARD - Payment made via debit card.
 */
export const SalePaymentMethod = {
    CASH: 'CASH',
    GCASH: 'GCASH',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD'
} as const;

/**
 * Display labels for updating Sale Statuses in popovers.
 */
export const SALE_STATUS_LABELS = {
    COMPLETED: 'MARK AS COMPLETED',
    PENDING: 'MARK AS PENDING',
    REFUNDED: 'REFUND SALE',
    VOIDED: 'VOID SALE',
} as const;

/**
 * Fields available for sorting the sales list.
 */
export const SaleOrderBy = {
    SALE_DATE: 'saleDate',
    TOTAL_AMOUNT: 'totalAmount',
} as const;
