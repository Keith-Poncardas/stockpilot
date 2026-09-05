import { MovementType, MovementReason } from "./stock-movement.constants";
import type { MovementType as MovementTypeUnion, MovementReason as MovementReasonUnion } from "../types";

/**
 * Tailwind CSS text-color classes for IN/OUT/ADJUSTMENT quantity display.
 */
export const IN_OUT_QUANTITY_COLORS: Record<string, string> = {
    IN: 'text-emerald-600',
    OUT: 'text-rose-600',
    ADJUSTMENT: 'text-amber-600',
};

/**
 * Tailwind CSS background + text color classes for movement type badge cells.
 */
export const MOVEMENT_TYPE_COLORS: Record<MovementTypeUnion, string> = {
    [MovementType.IN]: `bg-emerald-100 text-emerald-700 ${IN_OUT_QUANTITY_COLORS['IN']}`,
    [MovementType.OUT]: `bg-rose-100 text-rose-700 ${IN_OUT_QUANTITY_COLORS['OUT']}`,
    [MovementType.ADJUSTMENT]: `bg-amber-100 text-amber-700 ${IN_OUT_QUANTITY_COLORS['ADJUSTMENT']}`,
};

/**
 * Tailwind CSS background + text color classes for movement reason badge cells.
 */
export const MOVEMENT_REASON_COLORS: Record<MovementReasonUnion, string> = {
    [MovementReason.SALE]: 'bg-blue-50 text-blue-700',
    [MovementReason.PURCHASE]: 'bg-emerald-50 text-emerald-700',
    [MovementReason.ADJUSTMENT]: 'bg-amber-50 text-amber-700',
    [MovementReason.RETURN]: 'bg-purple-50 text-purple-700',
    [MovementReason.DAMAGE]: 'bg-red-50 text-red-700',
    [MovementReason.EXPIRED]: 'bg-rose-50 text-rose-700',
    [MovementReason.TRANSFER]: 'bg-indigo-50 text-indigo-700',
    [MovementReason.INITIAL_STOCK]: 'bg-teal-50 text-teal-700',
};

/**
 * Tailwind CSS background + text color classes for the movement icon wrapper.
 */
export const MOVEMENT_ICON_COLORS: Record<MovementTypeUnion, string> = {
    [MovementType.IN]: `bg-emerald-50 ${IN_OUT_QUANTITY_COLORS['IN']}`,
    [MovementType.OUT]: `bg-rose-50 ${IN_OUT_QUANTITY_COLORS['OUT']}`,
    [MovementType.ADJUSTMENT]: `bg-amber-50 ${IN_OUT_QUANTITY_COLORS['ADJUSTMENT']}`,
};
