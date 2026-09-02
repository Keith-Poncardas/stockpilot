import { useMemo } from 'react';
import { calculateProfitAndMargin } from '../../../utils';

export function useEstimatedMargin(
    unitPrice?: number | string | null,
    costPrice?: number | string | null
) {
    return useMemo(() => {
        return calculateProfitAndMargin(unitPrice, costPrice);
    }, [unitPrice, costPrice]);
}
