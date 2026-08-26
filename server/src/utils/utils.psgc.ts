import z from "zod";
import {
    listProvinces,
    listMuncities,
} from "@jobuntux/psgc";

/**
 * Normalizes PSGC code to 10-digit format if given in 9-digit format (e.g. from ph-locations).
 */
function normalizePsgcCode(code: string): string {
    const clean = code.trim();
    if (clean.length === 9) {
        return clean.slice(0, 2) + clean.slice(2, 4).padStart(3, '0') + clean.slice(4);
    }
    return clean;
}

/**
 * Validates that a province code exists within the PSGC dataset.
 * Accepts standard PSGC codes and 9-digit ph-locations codes.
 *
 * @param provinceCode - PSGC province code
 */
export function isValidProvince(provinceCode: string): boolean {
    if (!provinceCode) return false;
    const norm = normalizePsgcCode(provinceCode);
    const clean = provinceCode.trim();
    return listProvinces().some(
        (province) =>
            province.provCode === clean ||
            province.psgcCode === clean ||
            province.psgcCode === norm
    );
}

/**
 * Validates that a city/municipality code exists under the given province.
 * Accepts standard PSGC codes and 9-digit ph-locations codes.
 *
 * @param provinceCode - PSGC province code
 * @param cityCode     - PSGC city/municipality code
 */
export function isValidCityOrMunicipality(
    provinceCode: string,
    cityCode: string
): boolean {
    if (!cityCode) return false;
    const normCity = normalizePsgcCode(cityCode);
    const cleanCity = cityCode.trim();
    return listMuncities().some(
        (city) =>
            city.munCityCode === cleanCity ||
            city.psgcCode === cleanCity ||
            city.psgcCode === normCity
    );
}

/** Shape expected by the PSGC address refine function. */
type PsgcAddressData = {
    provinceCode: string;
    cityCode: string;
};

/**
 * Zod superRefine callback that validates PSGC province and city codes.
 * Province is validated first; if invalid, city validation is skipped.
 *
 * @example
 * z.object({ provinceCode: z.string(), cityCode: z.string() })
 *   .superRefine(psgcAddressRefine)
 */
export function psgcAddressRefine(
    data: PsgcAddressData,
    ctx: z.RefinementCtx
): void {
    if (!isValidProvince(data.provinceCode)) {
        ctx.addIssue({
            code: "custom",
            path: ["provinceCode"],
            message: `"${data.provinceCode}" is not a valid PSGC province code`,
        });
        // Skip city validation — province is already invalid
        return;
    }

    if (!isValidCityOrMunicipality(data.provinceCode, data.cityCode)) {
        ctx.addIssue({
            code: "custom",
            path: ["cityCode"],
            message: `"${data.cityCode}" is not a valid city/municipality under province "${data.provinceCode}"`,
        });
    }
}
