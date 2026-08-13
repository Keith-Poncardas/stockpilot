import type { UserRoleType } from "@/features/user/user.constants";

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' | 'DRAFT' | 'ARCHIVED';

/**
 * The inventory record linked to a stock movement.
 * Accessible via `StockMovement.inventory` resolver.
 * NOTE: `lastRestockDate` and `estimatedDaysOfStock` do NOT exist on the
 * Inventory type — they have been removed.
 */
export interface IStockMovementInventory {
    id: string;
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    updatedAt: string;
}

export interface IStockMovementProduct {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    /** Nullable — products may not have a cost price configured */
    costPrice: number | null;
    status: ProductStatus;
}

/**
 * The user who performed the stock movement.
 * Backend field name is `author` (not `user`) on StockMovement.
 */
export interface IStockMovementUser {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRoleType;
}

export type MovementReason =
    | "SALE"
    | "PURCHASE"
    | "ADJUSTMENT"
    | "RETURN"
    | "DAMAGE"
    | "EXPIRED"
    | "TRANSFER"
    | "INITIAL_STOCK";

export type MovementType =
    | "IN"
    | "OUT"
    | "ADJUSTMENT";

export interface IStockMovement {
    id: string;
    productId: string;
    userId: string;
    type: MovementType;
    quantity: number;
    reference: string | null;
    notes: string | null;
    reason: MovementReason;
    createdAt: string;
    product: IStockMovementProduct;
    /** The inventory record linked to this movement (via StockMovement.inventory resolver). */
    inventory?: IStockMovementInventory | null;
    /** The user who performed this movement (via StockMovement.author resolver). */
    author: IStockMovementUser;
}
