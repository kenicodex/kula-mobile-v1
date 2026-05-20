import api from './api';
import type { Booking, BookingStatus } from '@/types';

export interface CreateBookingPayload {
  chefId: string;
  serviceType: string;
  hireType: 'instant' | 'scheduled';
  date: string;
  timeSlot?: { start: string; end: string };
  numberOfGuests: number;
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  occasion?: string;
  specialInstructions?: string;
}

export const bookingsService = {
  create(payload: CreateBookingPayload) {
    return api.post<Booking>('/bookings', payload).then((r) => r.data);
  },

  myBookings(status?: BookingStatus) {
    return api
      .get<Booking[]>('/bookings/my', { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  chefBookings(status?: BookingStatus) {
    return api
      .get<Booking[]>('/bookings/chef', { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  chefStats() {
    return api
      .get<{
        total: number;
        confirmed: number;
        completed: number;
        revenue: number;
      }>('/bookings/chef/stats')
      .then((r) => r.data);
  },

  get(id: string) {
    return api.get<Booking>(`/bookings/${id}`).then((r) => r.data);
  },

  confirm(id: string) {
    return api.patch<Booking>(`/bookings/${id}/confirm`).then((r) => r.data);
  },

  decline(id: string) {
    return api.patch<Booking>(`/bookings/${id}/decline`).then((r) => r.data);
  },

  cancel(id: string) {
    return api.patch<Booking>(`/bookings/${id}/cancel`).then((r) => r.data);
  },

  setStatus(id: string, status: 'in_progress' | 'completed') {
    return api
      .patch<Booking>(`/bookings/${id}/status`, { status })
      .then((r) => r.data);
  },
};
