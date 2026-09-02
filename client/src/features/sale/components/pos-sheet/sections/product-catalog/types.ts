import type { ISaleBundleItem, ISalePricingTier } from '@/features/sale/types';

export interface PosProductItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  regularPrice?: number | null;
  productType?: string;
  quantityOnHand?: number;
  reorderLevel?: number;
  status?: string;
  bundleItems?: ISaleBundleItem[] | null;
  pricingTiers?: ISalePricingTier[] | null;
}

export interface ProductCardProps {
  product: PosProductItem;
  onAddToCart: (product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    regularPrice?: number | null;
    productType?: string;
    quantityOnHand: number;
    bundleItems?: ISaleBundleItem[] | null;
    pricingTiers?: ISalePricingTier[] | null;
  }) => void;
}
