import type { ReactNode } from "react";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

export interface ProductDetailsProps {
    movement: IStockMovementWithRelations;
}

export interface ProductDetailsLayoutProps {
    identityRow: ReactNode;
    pricingGrid: ReactNode;
}
