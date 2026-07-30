// ─── Status ───────────────────────────────────────────────────────────────────

export const SaleStatus = {
    PENDING: {
        a: 'PENDING',
        b: 'MARK AS PENDING',
    },
    COMPLETED: {
        a: 'COMPLETED',
        b: 'MARK AS COMPLETED',
    },
    REFUNDED: {
        a: 'REFUNDED',
        b: 'REFUND SALE',
    },
    VOIDED: {
        a: 'VOIDED',
        b: 'VOID SALE',
    },
} as const;

export const AVAILABLE_STATUSES = Object.values(SaleStatus) as Array<
    (typeof SaleStatus)[keyof typeof SaleStatus]
>;

export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus]["a"];


// ─── Order by ─────────────────────────────────────────────────────────────────

export const SaleOrderBy = {
    saleDate:    'saleDate',
    totalAmount: 'totalAmount',
} as const;

export type SaleOrderBy = (typeof SaleOrderBy)[keyof typeof SaleOrderBy];

// ─── Filter options (for SelectFilter components) ─────────────────────────────

export const saleStatusOptions = [
    { value: '',          label: 'All Statuses' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING',   label: 'Pending' },
    { value: 'REFUNDED',  label: 'Refunded' },
    { value: 'VOIDED',    label: 'Voided' },
];

export const saleOrderByOptions = [
    { value: 'saleDate',    label: 'Date' },
    { value: 'totalAmount', label: 'Total Amount' },
];

export const saleOrderDirectionOptions = [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc',  label: 'Oldest First' },
];
