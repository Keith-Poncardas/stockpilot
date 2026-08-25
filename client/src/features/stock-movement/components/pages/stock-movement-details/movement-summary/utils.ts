import type { MovementType } from "@/features/inventory/inventory.types";
import {
    MOVEMENT_DESCRIPTIONS,
    MOVEMENT_ICON_COLORS,
    MOVEMENT_REASON_LABELS,
    MOVEMENT_TYPE_LABELS
} from "@/features/stock-movement/sm.config";

/**
 * Gets the Tailwind CSS background/text color class for the icon wrapper based on movement type.
 * 
 * @param type - The type of the stock movement.
 * @returns The color class string, defaulting to the 'ADJUSTMENT' color if not found.
 */
export function getIconWrapperColor(type: MovementType): string {
    return MOVEMENT_ICON_COLORS[type] || MOVEMENT_ICON_COLORS['ADJUSTMENT'];
}

/**
 * Gets a human-readable description for a given stock movement type.
 * 
 * @param type - The type of the stock movement.
 * @returns The description string, defaulting to the 'ADJUSTMENT' description if not found.
 */
export function getMovementDescription(type: MovementType): string {
    return MOVEMENT_DESCRIPTIONS[type] || MOVEMENT_DESCRIPTIONS['ADJUSTMENT'];
}

/**
 * Gets a human-readable label for a given stock movement type.
 * 
 * @param type - The type of the stock movement.
 * @returns The label string, defaulting to 'Unknown' if not found.
 */
export function getTypeLabel(type: MovementType): string {
    return MOVEMENT_TYPE_LABELS[type] || 'Unknown';
}

/**
 * Gets a human-readable label for a given stock movement reason.
 * 
 * @param reason - The stock movement reason code.
 * @returns The label string, defaulting to the reason code itself if not found.
 */
export function getReasonLabel(reason: string): string {
    return MOVEMENT_REASON_LABELS[reason] || reason;
}