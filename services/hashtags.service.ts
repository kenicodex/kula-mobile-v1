import api from './api';

export interface HashtagDto {
  _id: string;
  name: string;
  useCount: number;
  category?: string;
  isActive: boolean;
  isBanned: boolean;
  isFeatured: boolean;
}

export const hashtagsService = {
  trending(limit = 20) {
    return api.get<HashtagDto[]>('/hashtags/trending', { params: { limit } }).then((r) => r.data);
  },

  search(q: string) {
    return api.get<HashtagDto[]>('/hashtags/search', { params: { q } }).then((r) => r.data);
  },
};
