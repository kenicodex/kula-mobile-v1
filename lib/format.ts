import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function fmtDate(value?: string | Date | null, pattern = 'd MMM yyyy') {
  if (!value) return '—';
  const d = typeof value === 'string' ? parseISO(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, pattern);
}

export function fmtDateTime(value?: string | Date | null) {
  return fmtDate(value, 'd MMM yyyy · HH:mm');
}

export function fmtTime(value?: string | Date | null) {
  return fmtDate(value, 'HH:mm');
}

export function fmtRelative(value?: string | Date | null) {
  if (!value) return '—';
  const d = typeof value === 'string' ? parseISO(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function fmtMoney(amount?: number | null, currency = 'NGN') {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₦${amount.toLocaleString()}`;
  }
}

export function fmtNumber(n?: number | null) {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-NG').format(n);
}
