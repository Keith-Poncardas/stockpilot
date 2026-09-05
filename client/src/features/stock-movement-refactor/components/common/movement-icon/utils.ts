import type { MovementType } from "@/features/stock-movement-refactor/types";
import { MOVEMENT_CONFIG } from "./constants";

/**
 * Returns the icon + className config for a movement type,
 * falling back to ADJUSTMENT for unknown types.
 */
export function getMovementConfig(type: MovementType) {
    return MOVEMENT_CONFIG[type] || MOVEMENT_CONFIG.ADJUSTMENT;
}
