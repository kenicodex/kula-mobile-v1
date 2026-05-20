import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

const TOKEN_KEY = 'kula_token';

// ─── SecureStore adapter for Zustand persist ─────────────────────────────────

const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // ignore
    }
  },
};

// ─── State interface ──────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: async (user: User, token: string) => {
        // Persist token separately for the axios interceptor
        try {
          await SecureStore.setItemAsync(TOKEN_KEY, token);
        } catch {
          // ignore
        }
        set({ user, token, isLoading: false });
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch {
          // ignore
        }
        set({ user: null, token: null, isLoading: false });
      },

      setLoading: (v: boolean) => set({ isLoading: v }),

      updateUser: (updates: Partial<User>) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },
    }),
    {
      name: 'kula-auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
