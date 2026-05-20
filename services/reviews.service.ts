import api from './api';
import type { Review } from '@/types';

export interface CreateReviewPayload {
  chefId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  categories?: {
    foodQuality?: number;
    punctuality?: number;
    cleanliness?: number;
    communication?: number;
  };
}

export const reviewsService = {
  forChef(chefId: string, params: { page?: number; limit?: number } = {}) {
    return api
      .get<Review[]>(`/reviews/chef/${chefId}`, { params })
      .then((r) => r.data);
  },

  chefRating(chefId: string) {
    return api
      .get<{ average: number; count: number }>(`/reviews/chef/${chefId}/rating`)
      .then((r) => r.data);
  },

  create(payload: CreateReviewPayload) {
    return api.post<Review>('/reviews', payload).then((r) => r.data);
  },

  respond(id: string, response: string) {
    return api.post<Review>(`/reviews/${id}/respond`, { response }).then((r) => r.data);
  },

  flag(id: string, reason: string) {
    return api.post(`/reviews/${id}/flag`, { reason }).then((r) => r.data);
  },
};
