import type { ISaleBundleItem, ISalePricingTier } from '../../../../types';


export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  customPrice?: number | null; // Suki / Special Custom Price override
  stockQuantity: number;
  productType?: string;
  regularPrice?: number | null;
  bundleItems?: ISaleBundleItem[] | null;
  pricingTiers?: ISalePricingTier[] | null;
}

export interface CartSectionProps {
  items: CartItem[];
  totalItemsCount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateCustomPrice?: (productId: string, price: number | null) => void;
  onRemoveItem: (productId: string) => void;
}
