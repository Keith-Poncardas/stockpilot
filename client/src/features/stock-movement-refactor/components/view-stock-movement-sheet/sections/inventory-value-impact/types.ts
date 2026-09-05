import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";
import type { ReactNode } from "react";

export interface InventoryValueImpactProps {
    movement: IStockMovementWithRelations;
}

export interface InventoryValueImpactLayoutProps {
    costPerUnitContent: ReactNode;
    quantityContent: ReactNode;
    totalValueContent: ReactNode;
}
