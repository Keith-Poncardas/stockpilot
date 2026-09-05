import { useMemo } from 'react';
import type { IStockMovement } from '@/features/stock-movement-refactor/types';
import {
    getMovementColor,
    getIconWrapperColor,
    getMovementDescription,
    getMovementPrefix,
    getTypeLabel,
    getReasonLabel,
} from '@/features/stock-movement-refactor/utils';

export function useMovementSummary(movement: IStockMovement) {
    return useMemo(() => {
        const { type, reason } = movement;

        const quantityColor = getMovementColor(type);
        const iconWrapperColor = getIconWrapperColor(type);
        const description = getMovementDescription(type);
        const prefix = getMovementPrefix(type);
        const typeLabel = getTypeLabel(type);
        const reasonLabel = getReasonLabel(reason);

        return {
            quantityColor,
            iconWrapperColor,
            description,
            prefix,
            typeLabel,
            reasonLabel,
        };
    }, [movement]);
}
