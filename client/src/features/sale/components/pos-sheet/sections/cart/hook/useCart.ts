import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';
import type { ISalePricingTier } from '@/features/sale/types';


export function calculateItemLinePrice(item: CartItem): {
  unitPrice: number;
  totalPrice: number;
  matchedTier?: ISalePricingTier | null;
  freeGifts: { name: string; quantity: number }[];
} {
  // 1. Custom price override (Suki pricing)
  if (item.customPrice !== undefined && item.customPrice !== null && !isNaN(item.customPrice) && item.customPrice >= 0) {
    const freeGifts: { name: string; quantity: number }[] = [];
    if (item.bundleItems) {
      item.bundleItems.forEach((b) => {
        freeGifts.push({
          name: b.product?.name || 'Free Item',
          quantity: b.quantity * item.quantity,
        });
      });
    }
    return {
      unitPrice: item.customPrice,
      totalPrice: item.customPrice * item.quantity,
      matchedTier: null,
      freeGifts,
    };
  }

  // 2. Volume Pricing Tier matching
  if (item.pricingTiers && item.pricingTiers.length > 0) {
    const sortedTiers = [...item.pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    const matchedTier = sortedTiers.find((t) => {
      if (item.quantity < t.minQuantity) return false;
      if (t.maxQuantity && item.quantity > t.maxQuantity) return false;
      return true;
    });

    if (matchedTier) {
      const freeGifts: { name: string; quantity: number }[] = [];
      if (matchedTier.freeProduct && matchedTier.freeQuantity && matchedTier.freeQuantity > 0) {
        freeGifts.push({
          name: matchedTier.freeProduct.name,
          quantity: matchedTier.freeQuantity,
        });
      }
      if (item.bundleItems) {
        item.bundleItems.forEach((b) => {
          freeGifts.push({
            name: b.product?.name || 'Free Item',
            quantity: b.quantity * item.quantity,
          });
        });
      }

      return {
        unitPrice: matchedTier.tierPrice / item.quantity,
        totalPrice: matchedTier.tierPrice,
        matchedTier,
        freeGifts,
      };
    }
  }

  // 3. Standard unit price
  const freeGifts: { name: string; quantity: number }[] = [];
  if (item.bundleItems) {
    item.bundleItems.forEach((b) => {
      freeGifts.push({
        name: b.product?.name || 'Free Item',
        quantity: b.quantity * item.quantity,
      });
    });
  }

  return {
    unitPrice: item.unitPrice,
    totalPrice: item.quantity * item.unitPrice,
    matchedTier: null,
    freeGifts,
  };
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomPrice: (productId: string, price: number | null) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItemsCount: () => number;
  getSubtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === newItem.productId
        );

        const quantityToAdd = newItem.quantity || 1;

        if (existingItemIndex >= 0) {
          const updatedItems = [...state.items];
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantityToAdd;

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: Math.max(1, Math.min(newQuantity, existingItem.stockQuantity)),
          };

          return { items: updatedItems };
        }

        return {
          items: [
            ...state.items,
            {
              ...newItem,
              quantity: Math.max(1, Math.min(quantityToAdd, newItem.stockQuantity)),
            } as CartItem,
          ],
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) => {
          if (item.productId === productId) {
            const validQuantity = Math.max(1, Math.min(quantity, item.stockQuantity));
            return { ...item, quantity: validQuantity };
          }
          return item;
        }),
      })),

      setCustomPrice: (productId, price) => set((state) => ({
        items: state.items.map((item) => {
          if (item.productId === productId) {
            return { ...item, customPrice: price };
          }
          return item;
        }),
      })),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),

      clearCart: () => set({ items: [] }),

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const { totalPrice } = calculateItemLinePrice(item);
          return total + totalPrice;
        }, 0);
      },
    }),
    {
      name: 'pos-cart-storage',
    }
  )
);
