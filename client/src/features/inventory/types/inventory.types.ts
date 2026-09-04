import type { Row } from '@tanstack/react-table';
import type { ProductStatus, ProductType } from '@/features/product/types';
import type {
    InventoryStockStatus,
    MovementType as MovementTypeConst,
    InventoryOrderBy as InventoryOrderByConst,
} from '../constants';

export type StockStatus = (typeof InventoryStockStatus)[keyof typeof InventoryStockStatus] | 'ALL';
export type StockStatusCustom = (typeof InventoryStockStatus)[keyof typeof InventoryStockStatus];
export type MovementType = (typeof MovementTypeConst)[keyof typeof MovementTypeConst];
export type InventoryOrderBy = (typeof InventoryOrderByConst)[keyof typeof InventoryOrderByConst];

export type AdjustmentType = 'increase' | 'decrease' | 'set';
export type StockImpactStatus = 'ok' | 'warning' | 'error';

export interface IInventoryProduct {
    id: string;
    sku: string;
    name: string;
    description?: string | null;
    unitPrice: number;
    costPrice?: number | null;
    status: ProductStatus;
    imageUrl?: string | null;
    productType?: ProductType | null;
}

export interface IInventoryAuthor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface IInventory {
    id: string;
    productId: string;
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    updatedAt: string;
    createdAt?: string;
    stockStatus: StockStatusCustom;
    estimatedDaysOfStock?: number | null;
    lastRestockDate?: string | null;
    product: IInventoryProduct;
    author?: IInventoryAuthor | null;
}

export interface IInventoryStatuses {
    wellStocked: number;
    lowStock: number;
    criticalOut: number;
    belowReorderLevel: number;
}

export interface InventoryRowProps {
    row: Row<IInventory>;
}

export interface StockImpactData {
    currentStock: number;
    newStock: number;
    delta: number;
    deltaLabel: string;
    status: StockImpactStatus;
    adjustmentType: AdjustmentType;
    isBelowReorder: boolean;
    isNegative: boolean;
    isAboveMax: boolean;
}

export interface ProductSearchItem {
    id: string;
    sku: string;
    name: string;
    description?: string | null;
    unitPrice: number;
    costPrice?: number | null;
    status: string;
    imageUrl?: string | null;
    productType?: ProductType | null;
}

export type {
    AdjustStockFormValues,
    InventoryRecordFormValues,
    UpdateReorderLevelFormValues,
} from '../validation';

export interface IAiStockRecommendationFinancialImpact {
    estimatedRestockCost?: number | null;
    potentialRevenue?: number | null;
    projectedProfit?: number | null;
}

export interface IAiStockRecommendation {
    recommendedQuantity: number;
    urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
    headline: string;
    reasoning: string[];
    targetDaysOfCoverage: number;
    stockoutRiskAssessment: string;
    salesVelocityDaily: number;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
    financialImpact?: IAiStockRecommendationFinancialImpact | null;
    calculatedAt: string;
}

