import axios from 'axios';

/**
 * Normalises an axios/network error into a single user-facing message.
 * Backend NestJS validation surfaces `message` as either a string or string[]
 * (when ValidationPipe + class-validator runs).
 */
export function apiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
    return err.message || fallback;
  }
  return fallback;
}
