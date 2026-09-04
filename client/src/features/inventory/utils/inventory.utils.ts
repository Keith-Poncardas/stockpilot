import {
    INVENTORY_STOCK_STATUS_COLORS,
    INVENTORY_STOCK_STATUS_LABELS,
    InventoryStockStatus,
} from '../constants';
import type {
    AdjustmentType,
    StockImpactData,
    StockImpactStatus,
    StockStatusCustom,
} from '../types';

/**
 * Returns the stock status based on quantity on hand vs reorder level.
 */
export function deriveStockStatus(qty: number, reorderLevel: number): StockStatusCustom {
    if (qty <= 0) return InventoryStockStatus.CRITICAL_OUT;
    if (qty <= reorderLevel) return InventoryStockStatus.LOW_STOCK;
    return InventoryStockStatus.WELL_STOCKED;
}

/**
 * Returns the Tailwind CSS badge class for a given stock status.
 */
export function getStockStatusColor(status: string): string {
    return (
        INVENTORY_STOCK_STATUS_COLORS[status as keyof typeof INVENTORY_STOCK_STATUS_COLORS] ||
        'bg-slate-100 text-slate-600 border-slate-200'
    );
}

/**
 * Returns the human-readable display label for a stock status.
 */
export function getStockStatusLabel(status: string): string {
    return (
        INVENTORY_STOCK_STATUS_LABELS[status as keyof typeof INVENTORY_STOCK_STATUS_LABELS] ||
        status
    );
}

/**
 * Returns appropriate text styling classes for the quantity based on reorder thresholds.
 */
export function getQtyClass(qty: number, reorderLevel: number): string {
    if (qty <= 0) return 'text-rose-600 font-bold';
    if (qty <= reorderLevel) return 'text-amber-600 font-bold';
    return 'text-emerald-700 font-bold';
}

/**
 * Pure calculation to compute projected stock levels and validation impacts.
 */
export function computeStockImpact(
    adjustmentType: AdjustmentType,
    quantity: number,
    currentStock: number,
    reorderLevel: number,
    maxStock: number
): StockImpactData {
    const qty = Math.max(0, quantity ?? 0);

    let newStock: number;
    let delta: number;

    switch (adjustmentType) {
        case 'increase':
            newStock = currentStock + qty;
            delta = qty;
            break;
        case 'decrease':
            newStock = currentStock - qty;
            delta = -qty;
            break;
        case 'set':
            newStock = qty;
            delta = qty - currentStock;
            break;
    }

    const isNegative = newStock < 0;
    const isBelowReorder = !isNegative && newStock <= reorderLevel;
    const isAboveMax = maxStock > 0 && newStock > maxStock;

    let status: StockImpactStatus = 'ok';
    if (isNegative) status = 'error';
    else if (isBelowReorder) status = 'warning';

    const absDelta = Math.abs(delta);
    let deltaLabel: string;
    if (delta === 0) deltaLabel = 'No change';
    else if (delta > 0) deltaLabel = `+${absDelta} unit${absDelta !== 1 ? 's' : ''}`;
    else deltaLabel = `−${absDelta} unit${absDelta !== 1 ? 's' : ''}`;

    return {
        currentStock,
        newStock,
        delta,
        deltaLabel,
        status,
        adjustmentType,
        isBelowReorder,
        isNegative,
        isAboveMax,
    };
}
