import type { IUserWithInfo } from "@/features/user";
import type { SalePaymentMethod, SaleStatus } from "./union.types";

export interface ISaleBundleItem {
    id: string;
    parentProductId: string;
    bundledProductId: string;
    quantity: number;
    product?: {
        id: string;
        name: string;
        sku?: string;
        imageUrl?: string | null;
    } | null;
}

export interface ISalePricingTier {
    id: string;
    minQuantity: number;
    maxQuantity?: number | null;
    tierPrice: number;
    freeProductId?: string | null;
    freeQuantity?: number;
    freeProduct?: {
        id: string;
        name: string;
        sku?: string;
        imageUrl?: string | null;
    } | null;
}

export interface ISaleProduct {
    id: string;
    sku: string;
    name: string;
    imageUrl?: string | null;
    unitPrice: number;
    regularPrice?: number | null;
    productType?: string;
    status: string;
    bundleItems?: ISaleBundleItem[] | null;
    pricingTiers?: ISalePricingTier[] | null;
}

export interface ISaleCustomer {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    cityCode?: string;
    provinceCode?: string;
    postalCode?: string;
    country?: string;
}

/**
 * Represents the base structure of a sale record.
 */
export interface ISale {
    id: string;
    customerId: string;
    userId: string;
    status: SaleStatus;
    totalAmount: number;
    vatableSales: number;
    vatAmount: number;
    vatExemptSales: number;
    zeroRatedSales: number;
    taxRate: number;
    paymentMethod: SalePaymentMethod;
    saleDate: string;
    createdAt: string;
    updatedAt: string;
};

/**
 * Represents an individual line item within a sale transaction.
 */
export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: ISaleProduct;
};

/**
 * Detailed representation of a sale, including populated relation data and item counts.
 */
export interface ISaleDetails extends ISale {
    itemsCount: number;
    saleItems: SaleItem[];
    customer: ISaleCustomer | null;
    author: IUserWithInfo;
};