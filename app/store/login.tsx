// stores/authStore.ts
import create from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { name: string } | null;
  login: (user: { name: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));

export default useAuthStore;
