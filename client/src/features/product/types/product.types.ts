import type { Row } from '@tanstack/react-table';
import type {
    ProductStatus as ProductStatusConstant,
    ProductOrderBy as ProductOrderByConstant,
    ProductType as ProductTypeConstant,
} from '../constants/product.constants';

/**
 * Union types representing Product Status, Product OrderBy, and Product Type
 */
export type ProductStatus = typeof ProductStatusConstant[keyof typeof ProductStatusConstant];
export type ProductOrderBy = typeof ProductOrderByConstant[keyof typeof ProductOrderByConstant];
export type ProductType = typeof ProductTypeConstant[keyof typeof ProductTypeConstant];

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

export interface IProductBundleItem {
    id: string;
    parentProductId: string;
    bundledProductId: string;
    quantity: number;
    product: IProduct;
}

export interface IProductPricingTier {
    id?: string;
    productId?: string;
    minQuantity: number;
    maxQuantity?: number | null;
    tierPrice: number;
    freeProductId?: string | null;
    freeQuantity?: number;
    freeProduct?: {
        id: string;
        name: string;
        sku: string;
        imageUrl?: string | null;
        unitPrice?: number;
    } | null;
}

export interface ImageUploadResult {
    url: string;
    secureUrl: string;
    publicId: string;
    format?: string | null;
    width?: number | null;
    height?: number | null;
    bytes?: number | null;
}

export interface IProduct {
    id: string;
    sku: string;
    name: string;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    description?: string | null;
    unitPrice: number;
    costPrice?: number | null;
    regularPrice?: number | null;
    productType: ProductType;
    margin?: number | null;
    grossMargin?: number | null;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
    inventory?: IProductInventory | null;
    bundleItems?: IProductBundleItem[] | null;
    pricingTiers?: IProductPricingTier[] | null;
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
    productType?: ProductType;
    stockStatus?: string;
    minPrice?: number;
    maxPrice?: number;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: ProductOrderBy;
    orderDirection?: 'asc' | 'desc';
}

export interface SearchProductsInfiniteInput {
    search: string;
    cursor?: string | null;
    limit?: number;
    hasInventory?: boolean;
}

export interface UseInfiniteProductSearchOptions {
    hasInventory?: boolean;
}
