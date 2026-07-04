// src/store/useAuthStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('accessToken') ?? null,

  login: (User, Token) => {
    localStorage.setItem('accessToken', Token);
    set({ user: User, token: Token });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;