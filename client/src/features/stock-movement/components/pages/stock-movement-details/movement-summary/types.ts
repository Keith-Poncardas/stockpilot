import type { IStockMovement } from "@/features/stock-movement/types";
import type { ReactNode } from "react";

/**
 * Props for the MovementSummaryLayout component.
 */
export interface MovementSummaryLayoutProps {
    children: ReactNode;
};

/**
 * Props for the MovementSummary component.
 */
export interface MovementSummaryProps {
    movement: IStockMovement;
}