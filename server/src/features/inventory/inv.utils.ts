import { StockStatus } from "@/enums";

export function resolveStockStatus(quantityOnHand: number, reorderLevel: number): StockStatus {
    if (quantityOnHand <= 0) return StockStatus.CRITICAL_OUT;
    if (quantityOnHand <= reorderLevel) return StockStatus.LOW_STOCK;
    return StockStatus.WELL_STOCKED;
}