export interface PosProductItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantityOnHand?: number;
  reorderLevel?: number;
  status?: string;
}

export interface ProductCardProps {
  product: PosProductItem;
  onAddToCart: (product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    quantityOnHand: number;
  }) => void;
}
