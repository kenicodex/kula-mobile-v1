import api from './api';
import type { Conversation, Message } from '@/types';

export const messagingService = {
  conversations() {
    return api.get<Conversation[]>('/messaging/conversations').then((r) => r.data);
  },

  startConversation(recipientId: string, bookingId?: string) {
    return api
      .post<Conversation>('/messaging/conversations', { recipientId, bookingId })
      .then((r) => r.data);
  },

  messages(conversationId: string, params: { page?: number; limit?: number } = {}) {
    return api
      .get<Message[]>(`/messaging/conversations/${conversationId}/messages`, { params })
      .then((r) => r.data);
  },

  send(conversationId: string, payload: { text: string; mediaUrl?: string }) {
    return api
      .post<Message>(`/messaging/conversations/${conversationId}/messages`, payload)
      .then((r) => r.data);
  },

  markRead(conversationId: string) {
    return api
      .post(`/messaging/conversations/${conversationId}/read`)
      .then((r) => r.data);
  },

  accept(conversationId: string) {
    return api
      .post(`/messaging/conversations/${conversationId}/accept`)
      .then((r) => r.data);
  },

  decline(conversationId: string) {
    return api
      .post(`/messaging/conversations/${conversationId}/decline`)
      .then((r) => r.data);
  },
};
