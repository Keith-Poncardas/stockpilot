/**
 * Core inventory stock status keys.
 */
export const InventoryStockStatus = {
    WELL_STOCKED: 'WELL_STOCKED',
    LOW_STOCK: 'LOW_STOCK',
    CRITICAL_OUT: 'CRITICAL_OUT',
} as const;

/**
 * Inventory movement types for adjusting stock.
 */
export const MovementType = {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT',
} as const;

/**
 * Fields available for sorting inventory list queries.
 */
export const InventoryOrderBy = {
    QUANTITY_ON_HAND: 'quantityOnHand',
    REORDER_LEVEL: 'reorderLevel',
    UPDATED_AT: 'updatedAt',
} as const;

/**
 * Human-readable labels for stock statuses.
 */
export const INVENTORY_STOCK_STATUS_LABELS = {
    WELL_STOCKED: 'IN STOCK',
    LOW_STOCK: 'LOW',
    CRITICAL_OUT: 'CRITICAL',
} as const;


/**
 * Stock status filter options for SelectFilter.
 */
export const STOCK_STATUS_FILTER_OPTIONS = [
    { value: 'ALL', label: 'All Statuses' },
    { value: InventoryStockStatus.WELL_STOCKED, label: 'Well Stocked' },
    { value: InventoryStockStatus.LOW_STOCK, label: 'Low Stock' },
    { value: InventoryStockStatus.CRITICAL_OUT, label: 'Critical / Out of Stock' },
] as const;

/**
 * Order by filter options for inventory list.
 */
export const INVENTORY_ORDER_BY_OPTIONS = [
    { value: InventoryOrderBy.UPDATED_AT, label: 'Last Updated' },
    { value: InventoryOrderBy.QUANTITY_ON_HAND, label: 'Quantity on Hand' },
    { value: InventoryOrderBy.REORDER_LEVEL, label: 'Reorder Level' },
] as const;

/**
 * Sort direction filter options.
 */
export const INVENTORY_ORDER_DIRECTION_OPTIONS = [
    { value: 'desc', label: 'Latest / Highest first' },
    { value: 'asc', label: 'Oldest / Lowest first' },
] as const;

/**
 * Default form values for recording a new inventory item.
 */
export const DEFAULT_INVENTORY_RECORD_FORM_VALUES = {
    productId: '',
    searchQuery: '',
    quantityOnHand: 0,
    reorderLevel: 10,
    maxStock: 100,
} as const;

/**
 * Default form values for adjusting stock.
 */
export const DEFAULT_ADJUST_STOCK_FORM_VALUES = {
    adjustmentType: 'increase',
    quantity: 1,
    reason: 'ADJUSTMENT',
    reference: '',
    notes: '',
} as const;

/**
 * Default form values for updating reorder level thresholds.
 */
export const DEFAULT_REORDER_LEVEL_FORM_VALUES = {
    reorderLevel: 10,
    maxStock: 100,
    notes: '',
} as const;

