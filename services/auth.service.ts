import api from './api';
import type { AuthResponse, LoginPayload, SignUpPayload, User } from '@/types';

export const authService = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/auth/login', payload).then((r) => r.data);
  },

  register(payload: SignUpPayload) {
    return api.post<AuthResponse>('/auth/register', payload).then((r) => r.data);
  },

  verifyOtp(payload: { email?: string; phone?: string; code: string }) {
    return api.post<{ verified: boolean }>('/auth/verify-otp', payload).then((r) => r.data);
  },

  refresh(refreshToken: string) {
    return api.post<AuthResponse>('/auth/refresh', { refreshToken }).then((r) => r.data);
  },

  /** Hydrate the full user profile after login. */
  me() {
    return api.get<User>('/users/me').then((r) => r.data);
  },

  updateMe(payload: Partial<User>) {
    return api.patch<User>('/users/me', payload).then((r) => r.data);
  },
};
