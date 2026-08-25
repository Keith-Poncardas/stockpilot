import type { MovementType } from "./types";

/**
 * Defines the possible reasons for a stock movement.
 * Used to categorize and track why inventory levels changed.
 */
export const MovementReasonConst = {
    SALE: 'SALE',
    PURCHASE: 'PURCHASE',
    ADJUSTMENT: 'ADJUSTMENT',
    RETURN: 'RETURN',
    DAMAGE: 'DAMAGE',
    EXPIRED: 'EXPIRED',
    TRANSFER: 'TRANSFER',
    INITIAL_STOCK: 'INITIAL_STOCK',
} as const;

/**
 * Defines the basic types of stock movements.
 * Indicates whether stock is entering (IN), leaving (OUT), or being adjusted (ADJUSTMENT).
 */
export const MovementTypeConst = {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT',
} as const;

/**
 * Mapping of movement types to their corresponding action labels.
 * Used for displaying the type in a user-friendly format.
 */
export const StockMovementTypeActionLabels:
    Record<MovementType, string> = {
    [MovementTypeConst.IN]: "STOCK IN",
    [MovementTypeConst.OUT]: "STOCK OUT",
    [MovementTypeConst.ADJUSTMENT]: "ADJUSTMENT",
};