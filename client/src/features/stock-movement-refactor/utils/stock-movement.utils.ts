import {
    IN_OUT_QUANTITY_COLORS,
    MOVEMENT_PREFIXES,
    INVENTORY_VALUE_LABELS,
    MOVEMENT_ICON_COLORS,
    MOVEMENT_TYPE_LABELS,
    MOVEMENT_REASON_LABELS,
    MovementType,
} from "../constants";
import type { MovementType as MovementTypeUnion, InventoryStatus } from "../types";

/**
 * Returns the sign prefix for a movement quantity (+, -, ±).
 */
export function getMovementPrefix(type: MovementTypeUnion): string {
    return MOVEMENT_PREFIXES[type] || '±';
}

/**
 * Returns the Tailwind text-color class for a movement type.
 */
export function getMovementColor(type: MovementTypeUnion): string {
    return IN_OUT_QUANTITY_COLORS[type] || 'text-amber-600';
}

/**
 * Returns the icon wrapper background+text color class for a movement type.
 */
export function getIconWrapperColor(type: MovementTypeUnion): string {
    return MOVEMENT_ICON_COLORS[type] || MOVEMENT_ICON_COLORS[MovementType.ADJUSTMENT];
}

/**
 * Returns the value impact label for a movement type (e.g. "Total Value Added").
 */
export function getTotalLabel(type: MovementTypeUnion): string {
    return INVENTORY_VALUE_LABELS[type] || INVENTORY_VALUE_LABELS['ADJUSTMENT'];
}

/**
 * Returns costPrice × quantity, or null if costPrice is not set.
 */
export function getTotalValue(costPrice: number | null, quantity: number): number | null {
    if (costPrice !== null) {
        return costPrice * quantity;
    }
    return null;
}

/**
 * Returns the human-readable label for a movement type.
 */
export function getTypeLabel(type: MovementTypeUnion): string {
    return MOVEMENT_TYPE_LABELS[type] || type;
}

/**
 * Returns the human-readable label for a movement reason.
 */
export function getReasonLabel(reason: string): string {
    return MOVEMENT_REASON_LABELS[reason] || reason;
}

/**
 * Returns the description for a movement type.
 */
export function getMovementDescription(type: MovementTypeUnion): string {
    const descriptions: Record<string, string> = {
        IN: 'Stock received into inventory',
        OUT: 'Stock removed from inventory',
        ADJUSTMENT: 'Stock level manually adjusted',
    };
    return descriptions[type] || descriptions[MovementType.ADJUSTMENT];
}

/**
 * Extracts and normalises inventory health data from an inventory snapshot.
 */
export function extractInventoryHealthData(inventoryStatus?: InventoryStatus | null) {
    return {
        onHand: inventoryStatus?.quantityOnHand ?? 0,
        reorderLevel: inventoryStatus?.reorderLevel ?? 0,
        maxStock: inventoryStatus?.maxStock ?? 0,
        lastRestockDate: undefined,
        estimatedDaysOfStock: 0,
    };
}

export interface StockMovementQueryParams {
    page: number;
    limit: number;
    orderBy?: string;
    orderDirection?: string;
}

export interface StockMovementFilterParams {
    search?: string;
    movementTypeFilter?: string;
    debouncedMinQty?: string;
    debouncedMaxQty?: string;
    orderByFilter?: string;
    orderDirectionFilter?: string;
    [key: string]: unknown;
}

/**
 * Builds the GraphQL variables object for the stock movement paginated query.
 */
export function buildStockMovementVariables(
    { queryParams, filters }: { queryParams: StockMovementQueryParams; filters: StockMovementFilterParams },
    {
        dateError,
        qtyError,
        dateFrom,
        dateTo,
    }: {
        dateError: string | null;
        qtyError: string | null;
        dateFrom?: string | Date | null;
        dateTo?: string | Date | null;
    }
) {
    return {
        args: {
            page: queryParams.page,
            limit: queryParams.limit,
            filter: {
                search: filters.search || undefined,
                movementType:
                    filters.movementTypeFilter && filters.movementTypeFilter !== 'all'
                        ? filters.movementTypeFilter
                        : undefined,
                dateFrom: dateError ? undefined : dateFrom || undefined,
                dateTo: dateError ? undefined : dateTo || undefined,
                minQty: qtyError
                    ? undefined
                    : filters.debouncedMinQty
                        ? Number(filters.debouncedMinQty)
                        : undefined,
                maxQty: qtyError
                    ? undefined
                    : filters.debouncedMaxQty
                        ? Number(filters.debouncedMaxQty)
                        : undefined,
                orderBy: filters.orderByFilter || queryParams.orderBy || 'createdAt',
                orderDirection: filters.orderDirectionFilter || queryParams.orderDirection || 'desc',
            },
        },
    };
}
