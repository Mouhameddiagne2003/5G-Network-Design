import { create } from "zustand";

interface User {
  email: string;
  username?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

function getInitialAuthState() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  }
  return { user: null, token: null };
}

export const useAuthStore = create<AuthState & { rehydrate: () => void }>((set) => ({
  ...getInitialAuthState(),
  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    }
  },
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  rehydrate: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      set({
        user: user ? JSON.parse(user) : null,
        token: token || null,
      });
    }
  },
}));
