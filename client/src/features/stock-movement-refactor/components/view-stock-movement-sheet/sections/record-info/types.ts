import type { ReactNode } from "react";
import type { IStockMovement } from "@/features/stock-movement-refactor/types";

export interface RecordInfoProps {
    movement: IStockMovement;
}

export interface RecordInfoLayoutProps {
    children: ReactNode;
}
