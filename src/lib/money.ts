/**
 * Minglar ajratuvchisi — uzilmaydigan bo'shliq (U+00A0).
 * Oddiy bo'shliq bo'lsa, «1 250 000» qatorlar orasida bo'linib ketardi.
 */
export const NBSP = '\u00A0';

/** Minus — matematik belgi (U+2212), defis emas: raqamlar bilan bir tekis turadi. */
export const MINUS = '\u2212';

/** So'm summalarini formatlash: 1 250 000 */
export function fmt(n: number): string {
  const v = Math.round(Math.abs(n));
  const s = String(v).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return (n < 0 ? MINUS : '') + s;
}

export function fmtWith(n: number, currency = "so'm"): string {
  return `${fmt(n)} ${currency}`;
}

/** Qisqa ko'rinish: 1,2 mln / 340 ming */
export function fmtShort(n: number): string {
  const v = Math.abs(Math.round(n));
  const sign = n < 0 ? MINUS : '';
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return sign + (m >= 10 ? Math.round(m) : m.toFixed(1).replace('.', ',')) + NBSP + 'mln';
  }
  if (v >= 1000) return sign + Math.round(v / 1000) + NBSP + 'ming';
  return sign + String(v);
}

/** Foydalanuvchi kiritgan matndan summa ajratish ("1 200 000", "1200000,50") */
export function parseAmount(s: string): number {
  const cleaned = String(s).replace(/[^\d]/g, '');
  if (!cleaned) return 0;
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Kiritish maydonida jonli formatlash */
export function maskAmount(s: string): string {
  const n = parseAmount(s);
  return n ? fmt(n) : '';
}
