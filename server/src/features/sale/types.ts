import { ProductStatus } from "@prisma/client";

export type ProductWithInventory = {
    id: string;
    name: string;
    status: ProductStatus;
    inventory?: {
        quantityOnHand: number;
    } | null;
};

export type SaleItemData = {
    productId: string;
    quantity: number;
};