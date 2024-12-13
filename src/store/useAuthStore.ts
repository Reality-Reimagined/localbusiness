import { create } from 'zustand';

interface AuthState {
  user: null | {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'business';
  };
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));