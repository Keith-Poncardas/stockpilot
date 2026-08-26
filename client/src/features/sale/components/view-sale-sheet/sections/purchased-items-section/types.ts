import type { SaleItem } from "@/features/sale/types";

export interface PurchasedItemsSectionProps {
    items: SaleItem[];
    totalAmount: number;
}

