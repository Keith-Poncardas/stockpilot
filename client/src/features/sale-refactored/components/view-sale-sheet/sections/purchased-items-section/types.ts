import type { SaleItem } from "@/features/sale-refactored/types";

export interface PurchasedItemsSectionProps {
    items: SaleItem[];
    totalAmount: number;
}
