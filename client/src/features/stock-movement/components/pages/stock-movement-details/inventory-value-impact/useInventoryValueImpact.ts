import { useMemo } from 'react';
import { getMovementColor, getMovementPrefix, getTotalLabel, getTotalValue } from '../utils';
import type { IStockMovementWithRelations } from '@/features/stock-movement/types';

/**
 * Custom hook to calculate the inventory value impact of a stock movement.
 * It computes the total value impact based on the product's cost price and the movement quantity,
 * and determines the appropriate label, color, and prefix based on the movement type.
 *
 * @param {import("@/features/stock-movement/types").IStockMovementWithRelations} movement - The stock movement object containing type, quantity, and product details.
 * @returns An object containing the calculated properties:
 * - `costPrice`: The cost price of the product.
 * - `quantity`: The quantity of the stock movement.
 * - `totalValue`: The total value impact (`costPrice * quantity`), or null if `costPrice` is not set.
 * - `totalLabel`: The label describing the value impact (e.g., 'Total Value Added').
 * - `totalColor`: The Tailwind CSS text color class for the total value.
 * - `prefix`: The sign prefix (e.g., '+', '-') for the total value.
 */
export function useInventoryValueImpact(movement: IStockMovementWithRelations) {
    return useMemo(() => {
        const { type, quantity, product } = movement;
        const costPrice = product.costPrice;

        /**
         * totalValue = costPrice × quantity
         * null when costPrice hasn't been set on the product.
         */
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
            prefix
        };
    }, [movement.type, movement.quantity, movement.product.costPrice]);
}
