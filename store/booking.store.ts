import { create } from 'zustand';

export type Service =
  | 'private_dining'
  | 'catering'
  | 'meal_prep'
  | 'cooking_class';

interface BookingDraft {
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorCuisine?: string;
  service?: Service;
  serviceLabel?: string;
  date?: string; // ISO yyyy-mm-dd
  time?: string;
  guests: number;
  dietary?: string;
  notes?: string;
  address?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  payment: 'card' | 'transfer' | 'wallet';
  // Set after a successful booking create; used by the confirmation screen.
  createdBookingId?: string;
  createdBookingReference?: string;
  estimatedTotal?: number;
  // Payment intent created after booking confirm.
  paymentIntentId?: string;
  paymentClientSecret?: string;
}

interface BookingState extends BookingDraft {
  set: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
}

const initial: BookingDraft = {
  creatorId: undefined,
  service: undefined,
  serviceLabel: undefined,
  date: undefined,
  time: undefined,
  guests: 2,
  dietary: undefined,
  notes: undefined,
  address: undefined,
  city: undefined,
  coordinates: undefined,
  payment: 'card',
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initial,
  set: (patch) => set((s) => ({ ...s, ...patch })),
  reset: () => set(initial),
}));

export default useBookingStore;
