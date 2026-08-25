import type { MovementType } from "@/features/stock-movement/types";
import { MOVEMENT_CONFIG } from "./constants";

/**
 * Retrieves the configuration (icon and styling) for a given stock movement type.
 * Falls back to the ADJUSTMENT configuration if the type is unknown.
 * 
 * @param {MovementType} type - The type of the stock movement.
 * @returns The configuration object containing the icon component and className.
 */
export function getMovementConfig(type: MovementType) {
    return MOVEMENT_CONFIG[type] || MOVEMENT_CONFIG.ADJUSTMENT;
}