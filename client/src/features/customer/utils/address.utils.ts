import { listProvinces, listMuncities, listBarangays } from '@jobuntux/psgc';

export const NCR_PROVINCE_CODE = '1300000000';
export const NCR_SHORT_CODE = '13';

/**
 * Mapping of geographic provinces to independent HUCs (Highly Urbanized Cities)
 * so users can find Baguio under Benguet, Cebu City under Cebu, etc.
 */
const PROVINCE_TO_HUC_MAP: Record<string, string[]> = {
    '054': ['301'], // Pampanga -> Angeles City
    '045': ['302'], // Negros Occidental -> Bacolod City
    '011': ['303'], // Benguet -> Baguio City
    '002': ['304'], // Agusan del Norte -> Butuan City
    '043': ['305'], // Misamis Oriental -> Cagayan de Oro City
    '022': ['306', '311', '313'], // Cebu -> Cebu City, Lapu-Lapu City, Mandaue City
    '024': ['307'], // Davao del Sur -> Davao City
    '063': ['308'], // South Cotabato -> General Santos City
    '035': ['309'], // Lanao del Norte -> Iligan City
    '030': ['310'], // Iloilo -> Iloilo City
    '056': ['312'], // Quezon -> Lucena City
    '071': ['314'], // Zambales -> Olongapo City
    '053': ['315'], // Palawan -> Puerto Princesa City
    '037': ['316'], // Leyte -> Tacloban City
    '073': ['317'], // Zamboanga del Sur -> Zamboanga City
};

/**
 * All 17 NCR Cities & Municipalities with proper PSGC muncity codes.
 */
const NCR_CITIES: AddressOption[] = [
    { value: '80100', label: 'Caloocan City' },
    { value: '80200', label: 'Las Piñas City' },
    { value: '80300', label: 'Makati City' },
    { value: '80400', label: 'Malabon City' },
    { value: '80500', label: 'Mandaluyong City' },
    { value: '80600', label: 'Manila' },
    { value: '80700', label: 'Marikina City' },
    { value: '80800', label: 'Muntinlupa City' },
    { value: '80900', label: 'Navotas City' },
    { value: '81000', label: 'Parañaque City' },
    { value: '81100', label: 'Pasay City' },
    { value: '81200', label: 'Pasig City' },
    { value: '81701', label: 'Pateros' },
    { value: '81300', label: 'Quezon City' },
    { value: '81400', label: 'San Juan City' },
    { value: '81500', label: 'Taguig City' },
    { value: '81600', label: 'Valenzuela City' },
].sort((a, b) => a.label.localeCompare(b.label));

/**
 * Manila sub-district muncity codes in PSGC.
 */
const MANILA_SUB_DISTRICT_CODES = [
    '80601', '80602', '80603', '80604', '80605', '80606', '80607',
    '80608', '80609', '80610', '80611', '80612', '80613', '80614'
];

/**
 * Strips prefixes like "City of " or trims names for clean display.
 */
export function cleanLocationName(name: string): string {
    const trimmed = name.trim();
    if (trimmed.startsWith('City of ')) {
        return trimmed.replace('City of ', '').trim() + ' City';
    }
    return trimmed;
}

export interface AddressOption {
    value: string;
    label: string;
}

/**
 * Precomputed static list of provinces with "Metro Manila (NCR)" at the top,
 * followed by all 81 real provinces.
 */
const PRECOMPUTED_PROVINCE_OPTIONS: AddressOption[] = (() => {
    const rawProvs = listProvinces();
    const realProvinces = rawProvs
        .filter(p => !p.cityClass && p.regCode !== '13')
        .map(p => ({
            value: p.provCode || p.psgcCode,
            label: p.provName.trim(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    return [
        { value: NCR_PROVINCE_CODE, label: 'Metro Manila (NCR)' },
        ...realProvinces,
    ];
})();

/**
 * Returns the list of provinces with "Metro Manila (NCR)" at the top,
 * followed by all 81 real provinces.
 */
export function getProvinceOptions(): AddressOption[] {
    return PRECOMPUTED_PROVINCE_OPTIONS;
}

/**
 * Returns cities / municipalities for a given province code.
 * If NCR is selected, returns all 17 NCR cities.
 * If a province is selected, returns its municipalities/cities + any associated HUCs.
 */
export function getCityOptions(provinceCode?: string | null): AddressOption[] {
    if (!provinceCode) return [];

    const cleanProv = provinceCode.trim();

    if (
        cleanProv === NCR_PROVINCE_CODE ||
        cleanProv === NCR_SHORT_CODE ||
        cleanProv === 'NCR' ||
        cleanProv.toLowerCase() === 'metro manila' ||
        cleanProv.toLowerCase() === 'ncr' ||
        cleanProv.startsWith('138')
    ) {
        return NCR_CITIES;
    }

    let targetProvCode = cleanProv;
    const found = listProvinces().find(
        p => p.provCode === cleanProv || p.psgcCode === cleanProv || p.provName.toLowerCase() === cleanProv.toLowerCase()
    );
    if (found?.provCode) {
        targetProvCode = found.provCode;
    }

    const directMuncities = listMuncities(targetProvCode);
    const hucCodes = PROVINCE_TO_HUC_MAP[targetProvCode] || [];
    const hucMuncities = hucCodes.flatMap(hucCode => listMuncities(hucCode));

    const combined = [...directMuncities, ...hucMuncities];

    const seen = new Set<string>();
    const options: AddressOption[] = [];

    for (const item of combined) {
        if (!seen.has(item.munCityCode)) {
            seen.add(item.munCityCode);
            options.push({
                value: item.munCityCode,
                label: cleanLocationName(item.munCityName),
            });
        }
    }

    return options.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Returns barangays for a given city / municipality code.
 * Special handling for Manila: aggregates barangays across all 14 Manila sub-districts.
 */
export function getBarangayOptions(cityCode?: string | null): AddressOption[] {
    if (!cityCode) return [];

    const cleanCity = cityCode.trim();

    if (
        cleanCity === '80600' ||
        cleanCity === '806' ||
        cleanCity === '1380600000' ||
        cleanCity.toLowerCase() === 'manila' ||
        cleanCity.toLowerCase() === 'city of manila'
    ) {
        const allManilaBarangays = MANILA_SUB_DISTRICT_CODES.flatMap(distCode => listBarangays(distCode));
        return allManilaBarangays
            .map(b => ({ value: b.brgyCode, label: b.brgyName.trim() }))
            .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
    }

    let targetCityCode = cleanCity;
    const ncrMatch = NCR_CITIES.find(
        c => c.value === cleanCity || c.label.toLowerCase() === cleanCity.toLowerCase()
    );
    if (ncrMatch) {
        targetCityCode = ncrMatch.value;
    } else {
        const found = listMuncities().find(
            c => c.munCityCode === cleanCity || c.psgcCode === cleanCity || c.munCityName.toLowerCase() === cleanCity.toLowerCase()
        );
        if (found?.munCityCode) {
            targetCityCode = found.munCityCode;
        }
    }

    const barangays = listBarangays(targetCityCode);
    return barangays
        .map(b => ({ value: b.brgyCode, label: b.brgyName.trim() }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

/**
 * Normalizes province code to the option value used in Select (e.g. '079' or '1300000000').
 */
export function normalizeProvinceCode(provinceCode?: string | null): string {
    if (!provinceCode) return '';
    const clean = provinceCode.trim();
    if (
        clean === NCR_PROVINCE_CODE ||
        clean === NCR_SHORT_CODE ||
        clean === 'NCR' ||
        clean.toLowerCase() === 'metro manila' ||
        clean.toLowerCase() === 'ncr' ||
        clean.startsWith('138')
    ) {
        return NCR_PROVINCE_CODE;
    }
    const found = listProvinces().find(
        p => p.provCode === clean || p.psgcCode === clean || p.provName.toLowerCase() === clean.toLowerCase()
    );
    return found?.provCode || clean;
}

/**
 * Normalizes city code to the option value used in Select (e.g. '80600' or '07904').
 */
export function normalizeCityCode(cityCode?: string | null, provinceCode?: string | null): string {
    if (!cityCode) return '';
    const clean = cityCode.trim();

    // Check NCR cities first
    const ncrMatch = NCR_CITIES.find(
        c => c.value === clean || c.label.toLowerCase() === clean.toLowerCase() || cleanLocationName(c.label).toLowerCase() === cleanLocationName(clean).toLowerCase()
    );
    if (ncrMatch) return ncrMatch.value;

    if (provinceCode) {
        const normProv = normalizeProvinceCode(provinceCode);
        const options = getCityOptions(normProv);
        const match = options.find(
            c => c.value === clean || c.label.toLowerCase() === clean.toLowerCase() || cleanLocationName(c.label).toLowerCase() === cleanLocationName(clean).toLowerCase()
        );
        if (match) return match.value;
    }

    const found = listMuncities().find(
        c => c.munCityCode === clean || c.psgcCode === clean || c.munCityName.toLowerCase() === clean.toLowerCase() || cleanLocationName(c.munCityName).toLowerCase() === cleanLocationName(clean).toLowerCase()
    );
    return found?.munCityCode || clean;
}

/**
 * Normalizes barangay code to the option value used in Select.
 */
export function normalizeBarangayCode(barangayCode?: string | null, cityCode?: string | null): string {
    if (!barangayCode) return '';
    const clean = barangayCode.trim();

    if (cityCode) {
        const normCity = normalizeCityCode(cityCode);
        const options = getBarangayOptions(normCity);
        const match = options.find(
            b => b.value === clean || b.label.toLowerCase() === clean.toLowerCase()
        );
        if (match) return match.value;
    }

    const all = listBarangays();
    const found = all.find(
        b => b.brgyCode === clean || b.psgcCode === clean || b.brgyName.toLowerCase() === clean.toLowerCase()
    );
    return found?.brgyCode || clean;
}

/**
 * Resolves province label from code.
 */
export function resolveProvinceName(provinceCode?: string | null): string {
    if (!provinceCode) return '';
    const clean = provinceCode.trim();
    if (clean === NCR_PROVINCE_CODE || clean === NCR_SHORT_CODE || clean === 'NCR' || clean.toLowerCase() === 'metro manila' || clean.startsWith('138')) {
        return 'Metro Manila';
    }
    const found = listProvinces().find(p => p.provCode === clean || p.psgcCode === clean || p.provName.toLowerCase() === clean.toLowerCase());
    return found ? found.provName.trim() : clean;
}

/**
 * Resolves city label from code.
 */
export function resolveCityName(cityCode?: string | null): string {
    if (!cityCode) return '';
    const clean = cityCode.trim();
    const ncrMatch = NCR_CITIES.find(c => c.value === clean || c.label.toLowerCase() === clean.toLowerCase());
    if (ncrMatch) return ncrMatch.label;

    const found = listMuncities().find(c => c.munCityCode === clean || c.psgcCode === clean || c.munCityName.toLowerCase() === clean.toLowerCase());
    return found ? cleanLocationName(found.munCityName) : clean;
}

/**
 * Resolves barangay label from cityCode & barangayCode.
 */
export function resolveBarangayName(barangayCode?: string | null, cityCode?: string | null): string {
    if (!barangayCode) return '';
    const clean = barangayCode.trim();

    // Look up via getBarangayOptions if cityCode is available
    if (cityCode) {
        const options = getBarangayOptions(cityCode);
        const match = options.find(b => b.value === clean || b.label.toLowerCase() === clean.toLowerCase());
        if (match) return match.label;
    }

    const all = listBarangays();
    const found = all.find(b => b.brgyCode === clean || b.psgcCode === clean || b.brgyName.toLowerCase() === clean.toLowerCase());
    return found ? found.brgyName.trim() : clean;
}
