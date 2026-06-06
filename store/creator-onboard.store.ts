import { create } from 'zustand';

export interface UploadedCert {
  /** Stable id used by the step4 UI ('culinary', 'food_handler', 'health'). */
  id: string;
  name: string;
  url: string;
  /** Object key inside DigitalOcean Spaces. */
  key?: string;
}

export interface ServicePricing {
  /** Service id, e.g. 'in_home_cooking'. */
  id: string;
  /** Numeric rate. */
  rate: number;
}

interface CreatorOnboardState {
  // Step 1
  avatarUrl: string | null;
  bio: string;
  city: string;

  // Step 2
  cuisineTypes: string[];
  mealCategories: string[];

  // Step 3
  services: ServicePricing[];

  // Step 4
  certifications: UploadedCert[];

  setAvatar: (url: string | null) => void;
  setStep1: (data: { bio: string; city: string }) => void;
  setStep2: (data: { cuisineTypes: string[]; mealCategories: string[] }) => void;
  setStep3: (services: ServicePricing[]) => void;

  upsertCert: (cert: UploadedCert) => void;
  removeCert: (id: string) => void;

  reset: () => void;
}

const initialState = {
  avatarUrl: null,
  bio: '',
  city: '',
  cuisineTypes: [],
  mealCategories: [],
  services: [],
  certifications: [],
};

export const useCreatorOnboardStore = create<CreatorOnboardState>((set) => ({
  ...initialState,

  setAvatar: (url) => set({ avatarUrl: url }),
  setStep1: ({ bio, city }) => set({ bio, city }),
  setStep2: ({ cuisineTypes, mealCategories }) =>
    set({ cuisineTypes, mealCategories }),
  setStep3: (services) => set({ services }),

  upsertCert: (cert) =>
    set((state) => ({
      certifications: [
        ...state.certifications.filter((c) => c.id !== cert.id),
        cert,
      ],
    })),
  removeCert: (id) =>
    set((state) => ({
      certifications: state.certifications.filter((c) => c.id !== id),
    })),

  reset: () => set(initialState),
}));
