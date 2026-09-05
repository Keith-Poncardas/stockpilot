/**
 * Represents the direction of a stock movement.
 */
export const MovementType = {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT',
} as const;

/**
 * Represents the reason behind a stock movement.
 */
export const MovementReason = {
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
 * Human-readable labels for movement types.
 */
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
    IN: 'Stock In',
    OUT: 'Stock Out',
    ADJUSTMENT: 'Adjustment',
};

/**
 * Human-readable labels for movement reasons.
 */
export const MOVEMENT_REASON_LABELS: Record<string, string> = {
    SALE: 'Sale',
    PURCHASE: 'Purchase',
    ADJUSTMENT: 'Adjustment',
    RETURN: 'Return',
    DAMAGE: 'Damage',
    EXPIRED: 'Expired',
    TRANSFER: 'Transfer',
    INITIAL_STOCK: 'Initial Stock',
};

/**
 * Sign prefix for a quantity based on movement type.
 */
export const MOVEMENT_PREFIXES: Record<string, string> = {
    IN: '+',
    OUT: '-',
    ADJUSTMENT: '±',
};

/**
 * Descriptions for each movement type.
 */
export const MOVEMENT_DESCRIPTIONS: Record<string, string> = {
    IN: 'Stock received into inventory',
    OUT: 'Stock removed from inventory',
    ADJUSTMENT: 'Stock level manually adjusted',
};

/**
 * Labels for inventory value impact based on movement type.
 */
export const INVENTORY_VALUE_LABELS: Record<string, string> = {
    IN: 'Total Value Added',
    OUT: 'Total Value Removed',
    ADJUSTMENT: 'Total Value Adjusted',
};

/**
 * Action button labels for movement types.
 */
export const StockMovementTypeActionLabels: Record<string, string> = {
    [MovementType.IN]: 'STOCK IN',
    [MovementType.OUT]: 'STOCK OUT',
    [MovementType.ADJUSTMENT]: 'ADJUSTMENT',
};
