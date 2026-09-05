import { useMemo } from 'react';

/**
 * Validates a min/max quantity range and returns an error string or null.
 */
export function useQtyRangeValidation(minQty?: string, maxQty?: string) {
    const qtyError = useMemo(() => {
        if (minQty && maxQty && Number(minQty) > Number(maxQty)) {
            return 'Min quantity must be less than or equal to max quantity';
        }
        return null;
    }, [minQty, maxQty]);

    return { qtyError };
}
