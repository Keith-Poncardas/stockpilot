/**
 * Tailwind CSS class mapping for Movement IN/OUT Quantity Display.
 * Used to apply text colors to IN, OUT, and ADJUSTMENT quantity displays.
 */
export const IN_OUT_QUANTITY_COLORS: Record<string, string> = {
    IN: 'text-emerald-600',
    OUT: 'text-rose-600',
    ADJUSTMENT: 'text-amber-600'
};

/**
 * Sign prefix for a quantity/value based on movement type.
 */
export const MOVEMENT_PREFIXES: Record<string, string> = {
    IN: '+',
    OUT: '-',
    ADJUSTMENT: '±'
};

/**
 * Tailwind CSS class mapping for User Roles.
 * Used to apply background and text colors to role badges.
 */
export const MOVEMENT_TYPE_COLORS: Record<string, string> = {
    IN: `bg-emerald-100 text-emerald-700 ${IN_OUT_QUANTITY_COLORS['IN']}`,
    OUT: `bg-rose-100 text-rose-700 ${IN_OUT_QUANTITY_COLORS['OUT']}`,
    ADJUSTMENT: `bg-amber-100 text-amber-700 ${IN_OUT_QUANTITY_COLORS['ADJUSTMENT']}`
};

/**
 * Tailwind CSS class mapping for Movement Reason.
 * Used to apply background and text colors to movement reason badges.
 */
export const MOVEMENT_REASON_COLORS: Record<string, string> = {
    SALE: 'bg-blue-50 text-blue-700',
    PURCHASE: 'bg-emerald-50 text-emerald-700',
    ADJUSTMENT: 'bg-amber-50 text-amber-700',
    RETURN: 'bg-purple-50 text-purple-700',
    DAMAGE: 'bg-red-50 text-red-700',
    EXPIRED: 'bg-rose-50 text-rose-700',
    TRANSFER: 'bg-indigo-50 text-indigo-700',
    INITIAL_STOCK: 'bg-teal-50 text-teal-700'
};

/**
 * Labels for movement types.
 */
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
    IN: 'Stock In',
    OUT: 'Stock Out',
    ADJUSTMENT: 'Adjustment',
};

/**
 * Labels for movement reasons.
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
 * Tailwind CSS class mapping for icon wrappers based on movement type.
 * Reuses text colors from IN_OUT_QUANTITY_COLORS.
 */
export const MOVEMENT_ICON_COLORS: Record<string, string> = {
    IN: `bg-emerald-50 ${IN_OUT_QUANTITY_COLORS['IN']}`,
    OUT: `bg-rose-50 ${IN_OUT_QUANTITY_COLORS['OUT']}`,
    ADJUSTMENT: `bg-amber-50 ${IN_OUT_QUANTITY_COLORS['ADJUSTMENT']}`,
};

/**
 * Descriptions for movement types.
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