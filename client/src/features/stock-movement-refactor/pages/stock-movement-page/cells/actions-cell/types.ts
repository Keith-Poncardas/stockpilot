import type { Row } from "@tanstack/react-table";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

export interface ActionsCellProps {
    row: Row<IStockMovementWithRelations>;
}
