import api from './api';
import type { Creator, Post } from '@/types';

type SavedCreator = Creator & { savedAt: string };
type SavedPost = Post & { savedAt: string };

export const savedService = {
  listCreators() {
    return api.get<SavedCreator[]>('/users/me/saved/creators').then((r) => r.data);
  },
  saveCreator(creatorId: string) {
    return api.post(`/users/me/saved/creators/${creatorId}`).then((r) => r.data);
  },
  unsaveCreator(creatorId: string) {
    return api.delete(`/users/me/saved/creators/${creatorId}`).then((r) => r.data);
  },

  listPosts() {
    return api.get<SavedPost[]>('/users/me/saved/posts').then((r) => r.data);
  },
  savePost(postId: string) {
    return api.post(`/users/me/saved/posts/${postId}`).then((r) => r.data);
  },
  unsavePost(postId: string) {
    return api.delete(`/users/me/saved/posts/${postId}`).then((r) => r.data);
  },
};
