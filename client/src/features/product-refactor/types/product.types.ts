import type { Row } from '@tanstack/react-table';
import type {
    ProductStatus as ProductStatusConstant,
    ProductOrderBy as ProductOrderByConstant,
} from '../constants/product.constants';

/**
 * Union types representing Product Status and Product OrderBy
 */
export type ProductStatus = typeof ProductStatusConstant[keyof typeof ProductStatusConstant];
export type ProductOrderBy = typeof ProductOrderByConstant[keyof typeof ProductOrderByConstant];

export interface IProductInventory {
    id: string;
    quantityOnHand: number;
    reorderLevel: number;
    maxStock: number;
    updatedAt: string;
    lastRestockDate?: string | null;
    estimatedDaysOfStock?: number | null;
}

export interface IProductPerformanceMetrics {
    unitsSold: number;
    unitsSoldTrend: number;
    revenue: number;
    revenueTrend: number;
    transactions: number;
    avgPerSale: number;
    sellThroughRate: number;
}

export interface IProductSalesTrendPoint {
    label: string;
    date: string;
    sales: number;
    isActive: boolean;
}

export interface IProduct {
    id: string;
    sku: string;
    name: string;
    imageUrl?: string | null;
    description?: string | null;
    unitPrice: number;
    costPrice?: number | null;
    margin?: number | null;
    grossMargin?: number | null;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
    inventory?: IProductInventory | null;
    performanceMetrics?: IProductPerformanceMetrics | null;
    salesTrend?: IProductSalesTrendPoint[] | null;
}

export interface IProductMetrics {
    total: number;
    active: number;
    draft: number;
}

export interface ProductRowInfoCellProps {
    row: Row<IProduct>;
}

export interface ProductFilterInput {
    search?: string;
    status?: ProductStatus;
    stockStatus?: string;
    minPrice?: number;
    maxPrice?: number;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: ProductOrderBy;
    orderDirection?: 'asc' | 'desc';
}
