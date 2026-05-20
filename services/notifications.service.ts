import api from './api';
import type { Notification } from '@/types';

interface NotificationsResponse {
  data: Notification[];
  unreadCount: number;
  page?: number;
  total?: number;
}

export const notificationsService = {
  list(params: { page?: number; limit?: number } = {}) {
    return api
      .get<NotificationsResponse | Notification[]>('/notifications', { params })
      .then((r) => {
        const d = r.data;
        if (Array.isArray(d)) return { data: d, unreadCount: 0 };
        return d;
      });
  },

  markAllRead() {
    return api.patch('/notifications/read-all').then((r) => r.data);
  },

  markRead(id: string) {
    return api.patch(`/notifications/${id}/read`).then((r) => r.data);
  },
};
