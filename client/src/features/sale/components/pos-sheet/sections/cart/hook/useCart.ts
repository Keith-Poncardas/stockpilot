import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
            // Ensure we don't exceed stock quantity
            quantity: Math.max(1, Math.min(newQuantity, existingItem.stockQuantity))
          };

          return { items: updatedItems };
        }

        return {
          items: [
            ...state.items,
            {
              ...newItem,
              // Ensure we don't exceed stock quantity on initial add
              quantity: Math.max(1, Math.min(quantityToAdd, newItem.stockQuantity))
            } as CartItem
          ]
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) => {
          if (item.productId === productId) {
            // Ensure quantity is at least 1 and does not exceed stock quantity
            const validQuantity = Math.max(1, Math.min(quantity, item.stockQuantity));
            return { ...item, quantity: validQuantity };
          }
          return item;
        })
      })),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId)
      })),

      clearCart: () => set({ items: [] }),

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
      }
    }),
    {
      name: 'pos-cart-storage', // key in local storage
    }
  )
);
