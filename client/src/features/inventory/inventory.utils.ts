export type { StockStatus, MovementType, InventoryOrderBy } from './inventory.types'

export const InventoryStockStatus = {
    WELL_STOCKED: 'WELL_STOCKED',
    LOW_STOCK: 'LOW_STOCK',
    CRITICAL_OUT: 'CRITICAL_OUT',
} as const

/**
 * Returns the stock status string label based on quantityOnHand vs reorderLevel.
 */
export function deriveStockStatus(qty: number, reorderLevel: number): 'WELL_STOCKED' | 'LOW_STOCK' | 'CRITICAL_OUT' {
    if (qty === 0) return 'CRITICAL_OUT'
    if (qty <= reorderLevel) return 'LOW_STOCK'
    return 'WELL_STOCKED'
}

export function getStockStatusColor(status: string): string {
    switch (status) {
        case 'WELL_STOCKED': return 'bg-emerald-50 text-emerald-700'
        case 'LOW_STOCK': return 'bg-amber-50 text-amber-600'
        case 'CRITICAL_OUT': return 'bg-red-50 text-red-600'
        default: return 'bg-gray-100 text-gray-500'
    }
}

export function getStockStatusLabel(status: string): string {
    switch (status) {
        case 'WELL_STOCKED': return 'IN_STOCK'
        case 'LOW_STOCK': return 'LOW'
        case 'CRITICAL_OUT': return 'CRITICAL'
        default: return status
    }
}

export function getQtyClass(qty: number, reorderLevel: number): string {
    if (qty === 0) return 'text-red-600 font-bold'
    if (qty <= reorderLevel) return 'text-amber-600 font-bold'
    return 'text-emerald-700 font-bold'
}
