import { resolveCityName, resolveProvinceName } from './address.utils';

/**
 * Returns a readable location string: "City, Province"
 * Resolves PSGC codes using @jobuntux/psgc dataset, with fallbacks to ph-locations and raw values.
 */
export function formatLocation(
    city?: string | null,
    province?: string | null
): string {
    if (!city && !province) return '—';

    const resolvedProvince = resolveProvinceName(province);
    const resolvedCity = resolveCityName(city);

    // If city and province are identical (e.g. City of Baguio, City of Baguio), just return the city
    if (resolvedCity && resolvedProvince && resolvedCity.toLowerCase() === resolvedProvince.toLowerCase()) {
        return resolvedCity;
    }

    return [resolvedCity, resolvedProvince].filter(Boolean).join(', ') || '—';
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
