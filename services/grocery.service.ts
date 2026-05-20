import api from './api';

export interface GroceryItem {
  name: string;
  quantity: number;
  estimatedPrice: number;
  notes?: string;
}

export interface GroceryList {
  _id: string;
  bookingId: string;
  chefId: string;
  clientId: string;
  items: GroceryItem[];
  estimatedTotal: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  actualTotal?: number;
  createdAt: string;
}

export const groceryService = {
  create(payload: { bookingId: string; items: GroceryItem[]; estimatedTotal: number }) {
    return api.post<GroceryList>('/grocery', payload).then((r) => r.data);
  },

  forBooking(bookingId: string) {
    return api.get<GroceryList>(`/grocery/booking/${bookingId}`).then((r) => r.data);
  },

  approve(id: string) {
    return api.patch<GroceryList>(`/grocery/${id}/approve`).then((r) => r.data);
  },

  uploadReceipt(id: string, receiptUrl: string, actualTotal: number) {
    return api
      .patch<GroceryList>(`/grocery/${id}/receipt`, { receiptUrl, actualTotal })
      .then((r) => r.data);
  },
};
