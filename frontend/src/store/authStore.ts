import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
  oauth_provider: string;
  avatar_url?: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('authToken'),
  user: null,
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
    set({ token });
  },
  setUser: (user: User) => set({ user }),
  logout: () => {
    localStorage.removeItem('authToken');
    set({ token: null, user: null });
  },
}));
