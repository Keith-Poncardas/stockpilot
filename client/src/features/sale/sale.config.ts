/**
 * Tailwind CSS class mapping for Sale Statuses.
 * Used to apply background and text colors to status badges.
 */
export const SALE_STATUS_COLORS: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700',
    PENDING: 'bg-amber-50 text-amber-600',
    REFUNDED: 'bg-purple-50 text-purple-700',
    VOIDED: 'bg-rose-50 text-rose-600'
};

/**
 * Display labels for updating Sale Statuses in popovers.
 */
export const SALE_STATUS_LABELS: Record<string, string> = {
    COMPLETED: 'MARK AS COMPLETED',
    PENDING: 'MARK AS PENDING',
    REFUNDED: 'REFUND SALE',
    VOIDED: 'VOID SALE',
};