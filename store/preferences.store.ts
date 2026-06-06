import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const secureStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (name) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // ignore
    }
  },
};

interface PreferencesState {
  pushNotifications: boolean;
  bookingReminders: boolean;
  marketingEmails: boolean;
  locationServices: boolean;
  set: (patch: Partial<Omit<PreferencesState, 'set'>>) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pushNotifications: true,
      bookingReminders: true,
      marketingEmails: false,
      locationServices: true,
      set: (patch) => set(patch),
    }),
    {
      name: 'kula_preferences',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
