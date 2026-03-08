'use client';
import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@lib/Firebase';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,

  initAuth: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        set({
          user: firebaseUser,
          token,
          loading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          loading: false,
        });
      }
    });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
