import api from './api';
import type { Order } from '@/types';

export interface CreateOrderPayload {
  chefId: string;
  items: { menuItemId?: string; name: string; quantity: number; unitPrice: number }[];
  fulfillmentType: 'delivery' | 'pickup' | 'dine_in';
  deliveryAddress?: {
    street: string;
    city: string;
    state?: string;
    country?: string;
  };
  pickupTime?: string;
}

export const ordersService = {
  create(payload: CreateOrderPayload) {
    return api.post<Order>('/orders', payload).then((r) => r.data);
  },

  myOrders(status?: string) {
    return api
      .get<Order[]>('/orders/my', { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  chefOrders(status?: string) {
    return api
      .get<Order[]>('/orders/chef', { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  get(id: string) {
    return api.get<Order>(`/orders/${id}`).then((r) => r.data);
  },

  setStatus(id: string, status: 'confirmed' | 'preparing' | 'ready' | 'delivered') {
    return api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);
  },

  cancel(id: string) {
    return api.patch<Order>(`/orders/${id}/cancel`).then((r) => r.data);
  },
};
