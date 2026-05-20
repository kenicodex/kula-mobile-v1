import api from './api';
import type { Chef, ChefAvailability } from '@/types';

export interface ChefSearchParams {
  q?: string;
  cuisine?: string;
  serviceType?: string;
  city?: string;
  minRating?: number;
  instantBooking?: boolean;
  page?: number;
  limit?: number;
}

export const chefsService = {
  search(params: ChefSearchParams = {}) {
    // Backend returns a paginated envelope { data, total, page, limit, pages };
    // unwrap to the array so callers can map() directly.
    return api
      .get<{ data: Chef[]; total: number; page: number; limit: number; pages: number }>(
        '/chefs/search',
        { params },
      )
      .then((r) => r.data.data);
  },

  get(id: string) {
    return api.get<Chef>(`/chefs/${id}`).then((r) => r.data);
  },

  myProfile() {
    return api.get<Chef>('/chefs/me/profile').then((r) => r.data);
  },

  createProfile(payload: Partial<Chef>) {
    return api.post<Chef>('/chefs/profile', payload).then((r) => r.data);
  },

  updateProfile(payload: Partial<Chef>) {
    return api.patch<Chef>('/chefs/profile', payload).then((r) => r.data);
  },

  setAvailability(availability: ChefAvailability | ChefAvailability[]) {
    return api
      .patch<Chef>('/chefs/availability', { availability })
      .then((r) => r.data);
  },

  addBlockOut(date: string) {
    return api.post('/chefs/blockout', { date }).then((r) => r.data);
  },

  removeBlockOut(date: string) {
    return api.delete(`/chefs/blockout/${date}`).then((r) => r.data);
  },

  pinPost(postId: string) {
    return api.post(`/chefs/pin/${postId}`).then((r) => r.data);
  },

  unpinPost(postId: string) {
    return api.delete(`/chefs/pin/${postId}`).then((r) => r.data);
  },
};
