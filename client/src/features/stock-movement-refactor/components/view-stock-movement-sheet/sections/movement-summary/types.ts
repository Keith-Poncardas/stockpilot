import type { IStockMovement } from "@/features/stock-movement-refactor/types";
import type { ReactNode } from "react";

export interface MovementSummaryLayoutProps {
    children: ReactNode;
}

export interface MovementSummaryProps {
    movement: IStockMovement;
}
