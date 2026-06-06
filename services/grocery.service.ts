import api from './api';

export type GroceryStatus =
  | 'pending_approval'
  | 'approved'
  | 'purchased'
  | 'reimbursed';

export type GroceryPaymentMethod = 'app_payment' | 'creator_pays' | 'client_handles';

export interface GroceryItem {
  id?: string;
  name: string;
  quantity: string;
  estimatedCost: number;
}

export interface GroceryList {
  id: string;
  bookingId: string;
  creatorId: string;
  clientId: string;
  items: GroceryItem[];
  estimatedTotal: number;
  actualTotal?: number | null;
  status: GroceryStatus;
  receiptUrl?: string | null;
  budgetCap?: number | null;
  paymentMethod: GroceryPaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroceryListPayload {
  bookingId: string;
  items: { name: string; quantity: string; estimatedCost: number }[];
  budgetCap?: number;
  paymentMethod?: GroceryPaymentMethod;
}

export const groceryService = {
  create(payload: CreateGroceryListPayload) {
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
