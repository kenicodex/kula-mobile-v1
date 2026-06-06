import api from './api';
import type { Review } from '@/types';

export interface CreateReviewPayload {
  creatorId: string;
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
  forCreator(creatorId: string, params: { page?: number; limit?: number } = {}) {
    return api
      .get<Review[]>(`/reviews/creator/${creatorId}`, { params })
      .then((r) => r.data);
  },

  creatorRating(creatorId: string) {
    return api
      .get<{ average: number; count: number }>(`/reviews/creator/${creatorId}/rating`)
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
