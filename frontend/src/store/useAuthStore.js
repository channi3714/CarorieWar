// src/store/useAuthStore.js
import { create } from 'zustand';

const stored = localStorage.getItem('user');

const useAuthStore = create((set) => ({
  user: stored ? JSON.parse(stored) : null,

  login: (User) => {
    localStorage.setItem('user', JSON.stringify(User));
    set({ user: User });
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

export default useAuthStore;