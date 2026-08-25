import { IN_OUT_QUANTITY_COLORS, INVENTORY_VALUE_LABELS, MOVEMENT_PREFIXES } from "@/features/stock-movement/sm.config";
import type { MovementType } from "@/features/stock-movement/types";

/**
 * Returns the sign prefix for a quantity/value based on movement type.
 *   IN  → '+'
 *   OUT → '-'
 *   ADJUSTMENT → '±'
 */
export function getMovementPrefix(type: MovementType): string {
    return MOVEMENT_PREFIXES[type] || '±';
};

/**
 * Returns the Tailwind text-colour class for a quantity/value based on movement type.
 *   IN  → emerald
 *   OUT → rose
 *   ADJUSTMENT → amber
 */
export function getMovementColor(type: MovementType): string {
    return IN_OUT_QUANTITY_COLORS[type] || 'text-amber-600';
};

/**
 * Returns the label for the total value based on movement type.
 * @param {MovementType} type - The type of movement.
 * @returns {string} The label for the total value.
 */
export function getTotalLabel(type: MovementType): string {
    return INVENTORY_VALUE_LABELS[type] || INVENTORY_VALUE_LABELS['ADJUSTMENT'];
};

/**
 * Returns the total value of the stock movement based on the product's cost price and quantity.
 * @param {number | null} costPrice - The cost price of the product.
 * @param {number | null} quantity - The quantity of the stock movement.
 * @returns {number | null} The total value of the stock movement.
 */
export function getTotalValue(costPrice: number | null, quantity: number) {

    if (costPrice !== null) {
        return costPrice * quantity;
    }

    return null;
};
