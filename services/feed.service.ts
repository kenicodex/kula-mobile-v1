import api from './api';
import type { Comment, Post } from '@/types';

export interface CreatePostPayload {
  type: 'photo' | 'video' | 'recipe' | 'daily_special';
  mediaUrls: string[];
  caption?: string;
  hashtags?: string[];
  linkedMenuItem?: string;
  dailySpecialPrice?: number;
  dailySpecialExpiresAt?: string;
}

export const feedService = {
  list(params: { page?: number; limit?: number } = {}) {
    // Backend returns a paginated envelope { data, total, page, limit, pages };
    // unwrap to the array so callers can map() directly.
    return api
      .get<{ data: Post[]; total: number; page: number; limit: number; pages: number }>(
        '/feed',
        { params },
      )
      .then((r) => r.data.data);
  },

  trending(limit = 20) {
    return api.get<Post[]>('/feed/trending', { params: { limit } }).then((r) => r.data);
  },

  byHashtag(tag: string, params: { page?: number; limit?: number } = {}) {
    return api
      .get<Post[]>(`/feed/hashtag/${encodeURIComponent(tag)}`, { params })
      .then((r) => r.data);
  },

  byUser(userId: string, params: { page?: number; limit?: number } = {}) {
    return api.get<Post[]>(`/feed/user/${userId}`, { params }).then((r) => r.data);
  },

  get(id: string) {
    return api.get<Post>(`/feed/${id}`).then((r) => r.data);
  },

  comments(postId: string, params: { page?: number; limit?: number } = {}) {
    return api
      .get<Comment[]>(`/feed/${postId}/comments`, { params })
      .then((r) => r.data);
  },

  create(payload: CreatePostPayload) {
    return api.post<Post>('/feed', payload).then((r) => r.data);
  },

  delete(id: string) {
    return api.delete(`/feed/${id}`).then((r) => r.data);
  },

  like(id: string) {
    return api.post(`/feed/${id}/like`).then((r) => r.data);
  },

  unlike(id: string) {
    return api.post(`/feed/${id}/unlike`).then((r) => r.data);
  },

  comment(postId: string, text: string) {
    return api
      .post<Comment>(`/feed/${postId}/comments`, { text })
      .then((r) => r.data);
  },

  deleteComment(postId: string, commentId: string) {
    return api.delete(`/feed/${postId}/comments/${commentId}`).then((r) => r.data);
  },
};
