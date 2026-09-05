import type { IUser } from "@/features/user";
import type { MovementType, MovementReason } from "./union.types";

/**
 * Base stock movement record.
 */
export interface IStockMovement {
    id: string;
    productId: string;
    userId: string;
    type: MovementType;
    quantity: number;
    reference?: string;
    notes?: string;
    createdAt: string;
    reason: MovementReason;
}

/**
 * Stock movement with populated product, author, and inventory relations.
 */
export interface IStockMovementWithRelations extends IStockMovement {
    author: IUser;
    product: {
        id: string;
        sku: string;
        name: string;
        imageUrl?: string | null;
        costPrice: number | null;
        unitPrice: number;
        status: string;
    };
    inventory: InventoryStatus | null;
}

/**
 * Filter state for the stock movement list page.
 */
export interface SMFilters {
    movementTypeFilter: string;
    orderByFilter: string;
    orderDirectionFilter: string;
    dateFrom: string;
    dateTo: string;
    minQty: string;
    maxQty: string;
}

/**
 * Inventory snapshot attached to a stock movement.
 */
export interface InventoryStatus {
    id: string;
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    updatedAt: string;
}
