// stores/authStore.ts
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

// Create a zustand store with persist middleware
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
    },
  ),
);

export default useAuthStore;
