import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const TOKEN_KEY = 'kula_token';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://kula-backend-v1.onrender.com/v1';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_err) {
      // If SecureStore fails, proceed without token
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

// Endpoints where a 401 means "bad credentials," not "session expired."
// Don't clear the token or redirect for these — let the caller surface the error.
const AUTH_ENTRY_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const url = error.config?.url ?? '';
    const isAuthEntry = AUTH_ENTRY_PATHS.some((p) => url.includes(p));

    if (error.response?.status === 401 && !isAuthEntry) {
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } catch (_err) {
        // ignore
      }
      // Redirect to auth. Use setTimeout to avoid calling during render cycle.
      setTimeout(() => {
        router.replace('/(auth)/onboarding');
      }, 0);
    }
    return Promise.reject(error);
  },
);

export { TOKEN_KEY };
export default api;
