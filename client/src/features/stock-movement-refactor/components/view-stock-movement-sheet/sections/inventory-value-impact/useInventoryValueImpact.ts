import { useMemo } from 'react';
import type { IStockMovementWithRelations } from '@/features/stock-movement-refactor/types';
import {
    getMovementColor,
    getMovementPrefix,
    getTotalLabel,
    getTotalValue,
} from '@/features/stock-movement-refactor/utils';

export function useInventoryValueImpact(movement: IStockMovementWithRelations) {
    return useMemo(() => {
        const { type, quantity, product } = movement;
        const costPrice = product.costPrice;

        const totalValue = getTotalValue(costPrice, quantity);
        const totalLabel = getTotalLabel(type);
        const totalColor = getMovementColor(type);
        const prefix = getMovementPrefix(type);

        return {
            costPrice,
            quantity,
            totalValue,
            totalLabel,
            totalColor,
            prefix,
        };
    }, [movement]);
}
