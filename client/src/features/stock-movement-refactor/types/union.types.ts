import { MovementType, MovementReason } from "../constants";

/**
 * Union type representing the direction of a stock movement.
 */
export type MovementType = typeof MovementType[keyof typeof MovementType];

/**
 * Union type representing the reason behind a stock movement.
 */
export type MovementReason = typeof MovementReason[keyof typeof MovementReason];
