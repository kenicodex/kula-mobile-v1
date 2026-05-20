import api from './api';

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export const paymentsService = {
  createIntent(payload: {
    amount: number;
    currency?: string;
    referenceId: string;
    referenceType: 'booking' | 'order';
  }) {
    return api
      .post<PaymentIntentResponse>('/payments/intent', { currency: 'ngn', ...payload })
      .then((r) => r.data);
  },
};
