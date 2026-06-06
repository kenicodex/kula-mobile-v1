import api from './api';
import type { Creator, CreatorAvailability } from '@/types';

export interface CreatorSearchParams {
  q?: string;
  cuisine?: string;
  serviceType?: string;
  city?: string;
  minRating?: number;
  instantBooking?: boolean;
  page?: number;
  limit?: number;
}

export const creatorsService = {
  search(params: CreatorSearchParams = {}) {
    // Backend returns a paginated envelope { data, total, page, limit, pages };
    // unwrap to the array so callers can map() directly.
    return api
      .get<{ data: Creator[]; total: number; page: number; limit: number; pages: number }>(
        '/creators/search',
        { params },
      )
      .then((r) => r.data.data);
  },

  get(id: string) {
    return api.get<Creator>(`/creators/${id}`).then((r) => r.data);
  },

  myProfile() {
    return api.get<Creator>('/creators/me/profile').then((r) => r.data);
  },

  // The backend promotes the user to the `creator` role on success and returns a
  // fresh access token carrying that role — callers must swap it in before
  // hitting any creator-only endpoint (e.g. setAvailability).
  createProfile(payload: Partial<Creator>) {
    return api
      .post<Creator & { accessToken: string }>('/creators/profile', payload)
      .then((r) => r.data);
  },

  updateProfile(payload: Partial<Creator>) {
    return api.patch<Creator>('/creators/profile', payload).then((r) => r.data);
  },

  setAvailability(availability: CreatorAvailability | CreatorAvailability[]) {
    return api
      .patch<Creator>('/creators/availability', { availability })
      .then((r) => r.data);
  },

  addBlockOut(date: string) {
    return api.post('/creators/blockout', { date }).then((r) => r.data);
  },

  removeBlockOut(date: string) {
    return api.delete(`/creators/blockout/${date}`).then((r) => r.data);
  },

  pinPost(postId: string) {
    return api.post(`/creators/pin/${postId}`).then((r) => r.data);
  },

  unpinPost(postId: string) {
    return api.delete(`/creators/pin/${postId}`).then((r) => r.data);
  },
};
