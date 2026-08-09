import z from "zod";
import {
    listProvinces,
    listMuncities,
} from "@jobuntux/psgc";

/**
 * Validates that a province code exists within the PSGC dataset.
 * Region is not exposed — Philippines is always the country context.
 *
 * @param provinceCode - The 4-digit PSGC province code (e.g. "0421" for Cavite)
 */
export function isValidProvince(provinceCode: string): boolean {
    // listProvinces() with no args returns ALL provinces across all regions
    return listProvinces().some(
        (province) => province.provCode === provinceCode
    );
}

/**
 * Validates that a city/municipality code exists under the given province.
 *
 * @param provinceCode - The 4-digit PSGC province code (e.g. "0421")
 * @param cityCode     - The 6-digit PSGC city/municipality code (e.g. "042108")
 */
export function isValidCityOrMunicipality(
    provinceCode: string,
    cityCode: string
): boolean {
    return listMuncities(provinceCode).some(
        (city) => city.munCityCode === cityCode
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
