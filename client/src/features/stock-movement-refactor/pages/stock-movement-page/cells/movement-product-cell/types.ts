import type { MovementType } from "@/features/stock-movement-refactor/types";

export interface IProductForMovementCell {
    id?: string;
    name: string;
    sku?: string | null;
    imageUrl?: string | null;
}

export interface MovementProductCellProps {
    type: MovementType;
    product: IProductForMovementCell;
    onClick?: () => void;
    enableViewSheet?: boolean;
}
