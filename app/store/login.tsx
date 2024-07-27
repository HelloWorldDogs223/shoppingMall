// stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { name: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    set({ isLoggedIn: true });
  },
  logout: () => set({ isLoggedIn: false, user: null }),
}));

export default useAuthStore;
