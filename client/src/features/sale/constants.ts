/**
 * Represents the current lifecycle status of a sale transaction.
 */
export const SaleStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    REFUNDED: "REFUNDED",
    VOIDED: "VOIDED",
} as const;

/**
 * Available payment methods that can be used for a transaction.
 */
export const PaymentMethod = {
    CASH: "CASH",
    GCASH: "GCASH",
    BANK_TRANSFER: "BANK_TRANSFER",
    CREDIT_CARD: "CREDIT_CARD",
    DEBIT_CARD: "DEBIT_CARD",
} as const;