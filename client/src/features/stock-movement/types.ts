import type { IUser } from "../user";
import { MovementReasonConst, MovementTypeConst } from "./sm.constants";

/**
 * Type for movement reasons, based on MovementReasonConst.
 */
export type MovementReasonType = (
    typeof MovementReasonConst
)[keyof typeof MovementReasonConst];

/**
 * Type for movement types, based on MovementTypeConst.
 */
export type MovementType = (
    typeof MovementTypeConst
)[keyof typeof MovementTypeConst];

/**
 * Type for movement reasons, based on MovementReasonConst.
 */
export interface IStockMovement {
    id: string;
    productId: string;
    userId: string;
    type: MovementType;
    quantity: number;
    reference?: string;
    notes?: string;
    createdAt: string;
    reason: MovementReasonType;
}

/**
 * Type for stock movement with relations, based on IStockMovement.
 */
export interface IStockMovementWithRelations extends IStockMovement {
    author: IUser;
    product: any;
    inventory: any;
}

/**
 * Filter options for the stock movement page.
 */
export interface SMFilters {
    movementTypeFilter: string;
    orderByFilter: string;
    orderDirectionFilter: string;
    dateFrom: string;
    dateTo: string;
    minQty: string;
    maxQty: string;
}