import type { MovementType } from "@/features/stock-movement/types";

/**
 * Properties for the QuantityDisplay component.
 */
export interface QuantityDisplayProps {
    quantity: number;
    type: MovementType;
};