import { useMemo } from 'react';

/**
 * Custom hook to validate a minimum and maximum quantity range.
 * 
 * @param minQty The minimum quantity string value
 * @param maxQty The maximum quantity string value
 * @returns An object containing the qtyError if validation fails, otherwise null
 */
export function useQtyRangeValidation(minQty?: string, maxQty?: string) {
    const qtyError = useMemo(() => {
        if (minQty && maxQty && Number(minQty) > Number(maxQty)) {
            return "Min quantity must be less than or equal to max quantity";
        }
        return null;
    }, [minQty, maxQty]);

    return { qtyError };
}
