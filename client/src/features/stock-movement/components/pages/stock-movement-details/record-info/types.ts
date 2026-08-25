import type { IStockMovement } from "@/features/stock-movement/types";
import type { ReactNode } from "react";

/**
 * Props for the RecordInfo component.
 * @param {IStockMovement} movement - The stock movement to display.
 */
export interface RecordInfoProps {
    movement: IStockMovement;
};

export interface RecordInfoLayoutProps {
    children: ReactNode;
}