import { useMemo } from 'react';
import type { IStockMovement } from '@/features/stock-movement/types';
import { getMovementColor, getMovementPrefix } from '../utils';
import {
    getMovementDescription,
    getIconWrapperColor,
    getReasonLabel,
    getTypeLabel
} from './utils';

/**
 * Custom hook to extract display properties for a stock movement summary.
 *
 * @param {import("@/features/stock-movement/types").IStockMovement} movement - The stock movement object.
 * @returns An object containing the calculated display properties:
 * - `quantityColor`: The Tailwind CSS text color class for the quantity based on movement type.
 * - `iconWrapperColor`: The Tailwind CSS background/text color class for the icon wrapper.
 * - `description`: The description of the movement type.
 * - `prefix`: The sign prefix (e.g., '+', '-') for the quantity.
 * - `typeLabel`: The human-readable label for the movement type.
 * - `reasonLabel`: The human-readable label for the movement reason.
 */
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
            reasonLabel
        };
    }, [movement.type, movement.reason]);
}
