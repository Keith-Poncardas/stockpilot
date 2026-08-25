import type { IStockMovementWithRelations } from "@/features/stock-movement/types";

/**
 * Props for the PerformedBy component.
 */
export interface PerformedByProps {
    movement: IStockMovementWithRelations;
}