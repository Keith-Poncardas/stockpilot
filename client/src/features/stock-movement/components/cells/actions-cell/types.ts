import type { IStockMovementWithRelations } from "@/features/stock-movement/types";
import type { Row } from "@tanstack/react-table";

export interface ActionsCellProps {
    row: Row<IStockMovementWithRelations>;
}