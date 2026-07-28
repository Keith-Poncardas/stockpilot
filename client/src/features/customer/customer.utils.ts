/**
 * Returns a readable location string: "City, Province"
 * Falls back to whichever part is available, or '—' if neither.
 */
export function formatLocation(
    city?: string | null,
    province?: string | null
): string {
    return [city, province].filter(Boolean).join(', ') || '—';
}

/**
 * Returns the customer's full display name.
 * Falls back to phone/email if name fields are empty.
 */
export function formatCustomerName(
    firstName?: string | null,
    lastName?: string | null,
    fallback?: string | null
): string {
    const name = [firstName, lastName].filter(Boolean).join(' ');
    return name || fallback || 'Unknown Customer';
}

/**
 * Returns 2-letter uppercase initials for a customer.
 */
export function getCustomerInitials(
    firstName?: string | null,
    lastName?: string | null,
    fallback?: string | null
): string {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
        return firstName.slice(0, 2).toUpperCase();
    }
    if (lastName) {
        return lastName.slice(0, 2).toUpperCase();
    }
    if (fallback) {
        return fallback.slice(0, 2).toUpperCase();
    }
    return 'C';
}
