import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) => set((state) => ({ 
        cart: [...state.cart, product] 
      })),
    }),
    { name: 'lotus-mart-cart' } // Saves the cart locally
  )
);