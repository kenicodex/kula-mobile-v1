import { create } from 'zustand';

export type Service =
  | 'private_dining'
  | 'catering'
  | 'meal_prep'
  | 'cooking_class';

interface BookingDraft {
  chefId?: string;
  chefName?: string;
  service?: Service;
  serviceLabel?: string;
  date?: string; // ISO yyyy-mm-dd
  time?: string;
  guests: number;
  dietary?: string;
  notes?: string;
  address?: string;
  city?: string;
  payment: 'card' | 'transfer' | 'wallet';
  // Set after a successful booking create; used by the confirmation screen.
  createdBookingId?: string;
  estimatedTotal?: number;
}

interface BookingState extends BookingDraft {
  set: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
}

const initial: BookingDraft = {
  chefId: undefined,
  service: undefined,
  serviceLabel: undefined,
  date: undefined,
  time: undefined,
  guests: 2,
  dietary: undefined,
  notes: undefined,
  payment: 'card',
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initial,
  set: (patch) => set((s) => ({ ...s, ...patch })),
  reset: () => set(initial),
}));

export default useBookingStore;
