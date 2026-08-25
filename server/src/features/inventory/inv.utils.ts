import { StockStatus } from "@/enums";
import { MovementType } from '@/generated/client.js';

/**
 * Resolves stock status based on quantity on hand and reorder level.
 *
 * @param quantityOnHand The current quantity of the product in stock.
 * @param reorderLevel The reorder level threshold for the product.
 * @returns The resolved stock status (WELL_STOCKED, LOW_STOCK, or CRITICAL_OUT).
 */
export function resolveStockStatus(
    quantityOnHand: number,
    reorderLevel: number
): StockStatus {
    if (quantityOnHand <= 0) return StockStatus.CRITICAL_OUT;
    if (quantityOnHand <= reorderLevel) return StockStatus.LOW_STOCK;
    return StockStatus.WELL_STOCKED;
}

/**
 * Maps an array of inventory objects by appending their resolved stock status.
 *
 * @param inventories The array of inventory objects to map.
 * @returns The array of mapped inventory objects with stock status.
 */
export function mapInventoriesWithStatus<T extends { quantityOnHand: number; reorderLevel: number }>(inventories: T[]) {
    return inventories.map((inv) => ({
        ...inv,
        stockStatus: resolveStockStatus(inv.quantityOnHand, inv.reorderLevel),
    }));
}

/**
 * Calculates the Prisma update object for quantity based on movement type.
 *
 * @param movementType The type of stock movement (IN, OUT, ADJUSTMENT).
 * @param quantity The quantity involved in the movement.
 * @returns Prisma update operation object.
 */
export function calculateQuantityUpdate(movementType: MovementType, quantity: number) {
    return {
        ...(movementType === MovementType.IN && { increment: quantity }),
        ...(movementType === MovementType.OUT && { decrement: quantity }),
        ...(movementType === MovementType.ADJUSTMENT && { set: quantity }),
    };
}