import type { UserRole } from "@/features/user/user.constants";

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' | 'DRAFT' | 'ARCHIVED';

export interface IStockMovementProductInventoryStatus {
    id: string;
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    lastRestockDate: string | null;
    estimatedDaysOfStock: number;
}

export interface IStockMovementProduct {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    /** Nullable — products may not have a cost price configured */
    costPrice: number | null;
    status: ProductStatus;
    inventoryStatus: IStockMovementProductInventoryStatus | null;
}

export interface IStockMovementUser {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
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
    user: IStockMovementUser;
}
