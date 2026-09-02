import { InventoryStockStatus } from './inventory.constants';
import type { StockStatusCustom } from '../types';

/**
 * Tailwind CSS class mapping for Inventory Stock Statuses.
 * Uses constant values from InventoryStockStatus as keys to ensure synchronicity.
 */
export const INVENTORY_STOCK_STATUS_COLORS: Record<StockStatusCustom, string> = {
    [InventoryStockStatus.WELL_STOCKED]: 'bg-emerald-50 text-emerald-700 border-emerald-100/80',
    [InventoryStockStatus.LOW_STOCK]: 'bg-amber-50 text-amber-700 border-amber-100/80',
    [InventoryStockStatus.CRITICAL_OUT]: 'bg-rose-50 text-rose-700 border-rose-100/80',
};
