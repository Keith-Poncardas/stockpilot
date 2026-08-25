import type { MovementType } from "@/features/stock-movement/types";

/**
 * (TEMPORARY) Interface for product data used in the MovementProductCell.
 * Includes product name and SKU. (will change when we refactor the Product type
 * to include other fields like id, code, etc.)
 */
export type IProductForMovementCell = {
    name: string;
    sku: string;
}

/**
 * Interface for the MovementProductCell component properties.
 * Includes the type of stock movement and the product details.
 */
export interface MovementProductCellProps {
    type: MovementType;
    product: IProductForMovementCell;
};