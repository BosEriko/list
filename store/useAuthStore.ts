'use client';
import { create } from 'zustand';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@lib/Firebase';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initAuth: () => () => void;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
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
