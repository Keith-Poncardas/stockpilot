import type { IStockMovementWithRelations } from "@/features/stock-movement/types";
import type { ReactNode } from "react";

/**
 * Props for the InventoryValueImpact component.
 */
export interface InventoryValueImpactProps {
    movement: IStockMovementWithRelations;
}

/**
 * Props for the InventoryValueImpactLayout component.
 */
export interface InventoryValueImpactLayoutProps {
    costPerUnitContent: ReactNode;
    quantityContent: ReactNode;
    totalValueContent: ReactNode;
}