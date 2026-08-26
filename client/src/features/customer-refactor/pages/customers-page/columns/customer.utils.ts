import { listProvinces, listMuncities } from '@jobuntux/psgc';
import { psgc } from 'ph-locations';

const { provinces: phProvinces, citiesMunicipalities: phCities } = psgc;

/**
 * Returns a readable location string: "City, Province"
 * Resolves PSGC codes using @jobuntux/psgc dataset, with fallbacks to ph-locations and raw values.
 */
export function formatLocation(
    city?: string | null,
    province?: string | null
): string {
    if (!city && !province) return '—';

    let resolvedProvince = province || '';
    if (province) {
        const cleanProv = province.trim();
        const pObj = listProvinces().find(
            p => p.provCode === cleanProv || p.psgcCode === cleanProv || p.provName.toLowerCase() === cleanProv.toLowerCase()
        );
        if (pObj) {
            resolvedProvince = pObj.provName;
        } else {
            const phP = phProvinces.find(p => p.code === cleanProv || p.name.toLowerCase() === cleanProv.toLowerCase());
            if (phP) resolvedProvince = phP.name;
        }
    }

    let resolvedCity = city || '';
    if (city) {
        const cleanCity = city.trim();
        const cObj = listMuncities().find(
            c => c.munCityCode === cleanCity || c.psgcCode === cleanCity || c.munCityName.trim().toLowerCase() === cleanCity.toLowerCase()
        );
        if (cObj) {
            resolvedCity = cObj.munCityName.trim();
        } else {
            const phC = phCities.find(c => c.code === cleanCity || c.name.toLowerCase() === cleanCity.toLowerCase());
            if (phC) resolvedCity = phC.name;
        }
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
