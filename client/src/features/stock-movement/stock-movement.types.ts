export interface IStockMovementProduct {
    id: string;
    sku: string;
    name: string;
}

export interface IStockMovementUser {
    id: string;
    firstName: string;
    lastName: string;
}

export interface IStockMovement {
    id: string;
    productId: string;
    userId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reference: string | null;
    notes: string | null;
    createdAt: string;
    deletedAt: string | null;
    product: IStockMovementProduct;
    user: IStockMovementUser;
}
