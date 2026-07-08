import { useMemo } from 'react';

export function useEstimatedMargin(unitPrice?: number | string, costPrice?: number | string) {
    return useMemo(() => {
        const price = Number(unitPrice);
        const cost = Number(costPrice);

        if (!price || isNaN(price) || price <= 0) {
            return { margin: null, profit: null };
        }

        const actualCost = (!cost || isNaN(cost)) ? 0 : cost;
        const profit = price - actualCost;
        const margin = (profit / price) * 100;

        return { margin, profit };
    }, [unitPrice, costPrice]);
}
