import type { Row } from "@tanstack/react-table"
import type { ProductStatus } from "@/features/product/product.constants"

export type StockStatus = 'WELL_STOCKED' | 'LOW_STOCK' | 'CRITICAL_OUT' | 'ALL'
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT'
export type InventoryOrderBy = 'quantityOnHand' | 'reorderLevel' | 'updatedAt'

export interface IInventoryProduct {
    id: string
    sku: string
    name: string
    description?: string | null
    unitPrice: number
    costPrice?: number | null
    status: ProductStatus
}

export interface IInventory {
    id: string
    productId: string
    quantityOnHand: number
    reorderLevel: number
    maxStock: number
    updatedAt: string
    stockStatus: Exclude<StockStatus, 'ALL'>
    product: IInventoryProduct
}

export interface IInventoryStatuses {
    wellStocked: number
    lowStock: number
    criticalOut: number
    belowReorderLevel: number
}

export interface InventoryRowProps {
    row: Row<IInventory>
}
