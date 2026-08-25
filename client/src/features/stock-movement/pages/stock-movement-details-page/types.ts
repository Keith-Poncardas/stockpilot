import type { ReactNode } from "react";

/**
 * Props for the StockMovementDetailsLayout component.
 *
 * @interface StockMovementDetailsLayoutProps
 * @property {ReactNode} leftContent - The main content to be displayed in the left column (spans 2 columns on large screens).
 * @property {ReactNode} rightContent - The secondary content to be displayed in the right column.
 */
export interface StockMovementDetailsLayoutProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
}

/**
 * Interface representing the inventory status.
 * @interface InventoryStatus
 * @property {number} quantityOnHand - The quantity on hand.
 * @property {number} reorderLevel - The reorder level.
 * @property {number} maxStock - The maximum stock.
 * @property {string} lastRestockDate - The date of the last restock.
 */
export interface InventoryStatus {
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    lastRestockDate: string;
    estimatedDaysOfStock: number;
};