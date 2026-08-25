import type { InventoryStatus } from "./types";

/**
 * Extracts and formats inventory health data from an inventory status object.
 * Provides fallback values for missing or null data.
 *
 * @param {InventoryStatus | null} [inventoryStatus] - The inventory status data containing metrics like quantity on hand, reorder level, etc.
 * @returns {Object} An object containing the extracted inventory health metrics with default values applied.
 */
export function extractInventoryHealthData(inventoryStatus?: InventoryStatus | null) {
    return {
        onHand: inventoryStatus?.quantityOnHand ?? 0,
        reorderLevel: inventoryStatus?.reorderLevel ?? 0,
        maxStock: inventoryStatus?.maxStock ?? 0,
        lastRestockDate: inventoryStatus?.lastRestockDate || undefined,
        estimatedDaysOfStock: inventoryStatus?.estimatedDaysOfStock ?? 0,
    };
}