/**
 * Generates a human-readable Sale ID from the internal UUID.
 * Uses the last 6 characters of the UUID to keep it short and unique enough
 * for display purposes. The full UUID is always used internally.
 *
 * @example
 *   formatSaleId("a3f1b2c9-dead-beef-1234-56789abc1234") → "SALE-C1234"
 */
export function formatSaleId(id: string): string {
    const suffix = id.replace(/-/g, '').slice(-6).toUpperCase();
    return `SALE-${suffix}`;
}

/**
 * Returns the cashier's full display name.
 * Falls back to 'Unknown' if both fields are missing.
 */
export function formatCashierName(
    firstName?: string | null,
    lastName?: string | null
): string {
    const name = [firstName, lastName].filter(Boolean).join(' ');
    return name || 'Unknown';
}

/**
 * Returns the customer's full display name.
 * Falls back to 'Walk-in' if both name fields are null/empty.
 */
export function formatCustomerDisplayName(
    firstName?: string | null,
    lastName?: string | null
): string {
    const name = [firstName, lastName].filter(Boolean).join(' ');
    return name || 'Walk-in';
}

/**
 * Returns color classes for Sale status badge/cell.
 */
export function getSaleStatusColor(status: string) {
    switch (status) {
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-700';
        case 'PENDING': return 'bg-amber-50 text-amber-600';
        case 'REFUNDED': return 'bg-purple-50 text-purple-700';
        case 'VOIDED': return 'bg-rose-50 text-rose-600';
        default: return 'bg-gray-100 text-gray-500';
    }
}

