import { useState, useEffect, useCallback, useMemo } from "react";

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  quantityOnHand: number;
}

export interface SelectedCustomer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  customerType: string;
}

const STORAGE_KEY = "stockpilot_pos_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomerState] = useState<SelectedCustomer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [customPaymentMethod, setCustomPaymentMethod] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [items]);

  const addItem = useCallback((product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    quantityOnHand: number;
  }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const nextQty = existing.quantity + 1;
        if (nextQty > existing.quantityOnHand) {
          return prev;
        }
        const newItems = [...prev];
        newItems[existingIndex] = { ...existing, quantity: nextQty };
        return newItems;
      } else {
        if (product.quantityOnHand < 1) {
          return prev;
        }
        return [
          ...prev,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            unitPrice: product.unitPrice,
            quantity: 1,
            quantityOnHand: product.quantityOnHand,
          },
        ];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((item) => {
        if (item.productId === productId) {
          const clamped = Math.min(quantity, item.quantityOnHand);
          return { ...item, quantity: clamped };
        }
        return item;
      });
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerState(null);
    setPaymentMethod("Cash");
    setCustomPaymentMethod("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const totalDue = subtotal;

  const effectivePaymentMethod = useMemo(() => {
    if (paymentMethod === "Other") {
      return customPaymentMethod.trim() || "Other";
    }
    return paymentMethod;
  }, [paymentMethod, customPaymentMethod]);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    customer,
    setCustomer: setCustomerState,
    paymentMethod,
    setPaymentMethod,
    customPaymentMethod,
    setCustomPaymentMethod,
    effectivePaymentMethod,
    totalItemsCount,
    subtotal,
    totalDue,
  };
}
