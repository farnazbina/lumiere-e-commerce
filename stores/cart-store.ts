"use client";

import { create } from "zustand";
import { getProduct, type Product } from "@/lib/data/catalog";

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => void;
  updateQuantity: (productId: number, change: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (productId, quantity = 1) => {
    const product = getProduct(productId);
    if (!product || !Number.isSafeInteger(quantity) || quantity <= 0) return;
    set((state) => {
      const existing = state.items.find((item) => item.id === productId);
      if (existing && !Number.isSafeInteger(existing.quantity + quantity)) return state;
      return {
        items: existing
          ? state.items.map((item) => item.id === productId ? { ...item, quantity: item.quantity + quantity } : item)
          : [...state.items, { ...product, quantity }],
      };
    });
  },
  updateQuantity: (productId, change) => {
    if (!Number.isSafeInteger(change)) return;
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== productId || !Number.isSafeInteger(item.quantity + change)) return item;
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }),
    }));
  },
  removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),
  clearCart: () => set({ items: [] }),
}));

export const selectCartQuantity = (state: CartState) => state.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: CartState) => state.items.reduce((total, item) => total + item.price * item.quantity, 0);
