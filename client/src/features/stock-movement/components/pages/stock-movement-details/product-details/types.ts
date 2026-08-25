import type { ReactNode } from "react";
import type { IStockMovementWithRelations } from "@/features/stock-movement/types";

/**
 * Props for the ProductDetails component.
 */
export interface ProductDetailsProps {
    movement: IStockMovementWithRelations;
};

/**
 * Props for the ProductDetailsLayout component.
 */
export interface ProductDetailsLayoutProps {
    identityRow: ReactNode;
    pricingGrid: ReactNode;
};