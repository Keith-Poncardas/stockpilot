import {
    SalePaymentMethod,
    SaleStatus
}
    from "@/features/sale-refactored/constants";

/**
 * Filter options for the sale transaction lifecycle status.
 * Provides values to filter by all statuses, or specific statuses (COMPLETED, PENDING, REFUNDED, VOIDED).
 */
export const saleStatusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: SaleStatus.COMPLETED, label: 'Completed' },
    { value: SaleStatus.PENDING, label: 'Pending' },
    { value: SaleStatus.REFUNDED, label: 'Refunded' },
    { value: SaleStatus.VOIDED, label: 'Voided' },
];

/**
 * Sort options determining which attribute to order the sales list by.
 * Allows ordering by transaction date or total sales amount.
 */
export const saleOrderByOptions = [
    { value: 'saleDate', label: 'Date' },
    { value: 'totalAmount', label: 'Total Amount' },
];

/**
 * Sort direction options for ordering the sales list.
 * Supports descending order (Newest First) and ascending order (Oldest First).
 */
export const saleOrderDirectionOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' },
];

/**
 * Filter options for the payment method used in sale transactions.
 * Includes options for all payments, or specific methods (CASH, GCASH, BANK_TRANSFER, CREDIT_CARD, DEBIT_CARD).
 */
export const paymentMethodOptions = [
    { value: 'ALL', label: 'All Payments' },
    { value: SalePaymentMethod.CASH, label: 'Cash' },
    { value: SalePaymentMethod.GCASH, label: 'GCash' },
    { value: SalePaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
    { value: SalePaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: SalePaymentMethod.DEBIT_CARD, label: 'Debit Card' }
];