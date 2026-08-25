/**
 * Returns the cashier's full display name.
 * Falls back to 'Unknown' if both fields are missing.
 */
export function formatCashierName(
    firstName?: string | null,
    lastName?: string | null
): string {
    const name = [firstName, lastName].filter(Boolean).join(" ");
    return name || "Unknown";
}

/**
 * Generates a human-readable Sale ID from the internal UUID.
 */
export function formatSaleId(id: string): string {
    const suffix = id.replace(/-/g, '').slice(-6).toUpperCase();
    return `SALE-${suffix}`;
}

/**
 * Returns the customer's full display name.

 * Falls back to 'Walk-in' if both name fields are null/empty.
 */
export function formatCustomerDisplayName(
    firstName?: string | null,
    lastName?: string | null
): string {
    const name = [firstName, lastName].filter(Boolean).join(" ");
    return name || "Walk-in";
}
