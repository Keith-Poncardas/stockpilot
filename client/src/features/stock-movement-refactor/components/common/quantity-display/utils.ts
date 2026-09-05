import { MovementType, MOVEMENT_PREFIXES } from "@/features/stock-movement-refactor/constants";
import type { MovementType as MovementTypeUnion } from "@/features/stock-movement-refactor/types";

/**
 * Gets the sign prefix for a stock movement quantity, omitting ADJUSTMENT.
 * 
 * @param type - The movement type (e.g. IN, OUT, ADJUSTMENT).
 * @returns The sign prefix (+ or -), or empty string if ADJUSTMENT or unknown.
 */
export function getQuantityPrefix(type: MovementTypeUnion): string {
    if (type === MovementType.ADJUSTMENT) {
        return "";
    }
    return MOVEMENT_PREFIXES[type] || "";
}
