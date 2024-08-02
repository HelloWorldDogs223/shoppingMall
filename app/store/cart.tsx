import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  addItem: (item: any) =>
    set((state: any) => ({
      cart: [...state.cart, item],
    })),
  removeItem: (id: any) =>
    set((state: any) => ({
      cart: state.cart.filter((item: any) => item.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
  getCartCount: () => set((state: any) => state.cart.length),
}));

export default useCartStore;
