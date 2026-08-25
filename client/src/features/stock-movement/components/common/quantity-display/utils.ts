import { MovementTypeConst } from "@/features/stock-movement/sm.constants";
import { MOVEMENT_PREFIXES } from "../../../sm.config";
import type { MovementType } from "@/features/stock-movement/types";

/**
 * Gets the sign prefix for a stock movement quantity, omitting ADJUSTMENT.
 * 
 * @param type - The movement type (e.g. IN, OUT, ADJUSTMENT).
 * @returns The sign prefix (+ or -), or empty string if ADJUSTMENT or unknown.
 */
export function getQuantityPrefix(type: MovementType): string {
    if (type === MovementTypeConst.ADJUSTMENT) {
        return "";
    }
    return MOVEMENT_PREFIXES[type] || "";
};
