import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  addItem: (item: any) =>
    set((state: any) => ({
      cart: [...state.cart, item],
    })),
  removeItem: (id: any) =>
    set((state: any) => {
      const updatedCart = state.cart.filter((item: any) => item.id !== id);
      console.log('Updated Cart:', updatedCart); // 상태가 올바르게 필터링되었는지 확인
      return { cart: updatedCart };
    }),
  clearCart: () => set({ cart: [] }),
  setCart: (newCart: any[]) => set({ cart: newCart }),
}));

export default useCartStore;
