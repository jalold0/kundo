import { t } from '../i18n';
import { curOf, decSep } from './currency';

/**
 * Pul summalari **eng kichik birlikda butun son** bo'lib yuritiladi: so'mda
 * 1 = 1 so'm, dollarda 1 = 1 sent. Kasr sonlar ishlatilmaydi — 0.1 + 0.2
 * muammosi pul hisobida yo'l qo'yilmaydi.
 *
 * Ko'rsatish paytida valyutaning kasr xonalari (`dec`) qo'llanadi.
 */

/**
 * Minglar ajratuvchisi — uzilmaydigan bo'shliq (U+00A0).
 * Oddiy bo'shliq bo'lsa, «1 250 000» qatorlar orasida bo'linib ketardi.
 */
export const NBSP = ' ';

/** Minus — matematik belgi (U+2212), defis emas: raqamlar bilan bir tekis turadi. */
export const MINUS = '−';

const group = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

/**
 * Summani formatlash. `code` berilmasa butun son sifatida ko'rsatiladi
 * (masalan so'm uchun) — bu eski xatti-harakat bilan bir xil.
 */
export function fmt(minor: number, code?: string): string {
  const dec = code ? curOf(code).dec : 0;
  const sign = minor < 0 ? MINUS : '';
  const v = Math.round(Math.abs(minor));
  if (dec === 0) return sign + group(String(v));
  const unit = Math.floor(v / 100);
  const rest = String(v % 100).padStart(2, '0');
  return sign + group(String(unit)) + decSep() + rest;
}

export function fmtWith(minor: number, label: string, code?: string): string {
  return `${fmt(minor, code)} ${label}`;
}

/**
 * Qisqa ko'rinish: 1,2 mln / 340 ming. Katta raqamlar grafik yonida joy
 * yetmaganda ishlatiladi, shuning uchun kasr qismi tushiriladi.
 */
export function fmtShort(minor: number, code?: string): string {
  const dec = code ? curOf(code).dec : 0;
  const whole = dec === 0 ? Math.abs(Math.round(minor)) : Math.round(Math.abs(minor) / 100);
  const sign = minor < 0 ? MINUS : '';
  if (whole >= 1_000_000) {
    const m = whole / 1_000_000;
    const num = m >= 10 ? String(Math.round(m)) : m.toFixed(1).replace('.', decSep());
    return sign + num + NBSP + t('money.mln');
  }
  if (whole >= 1000) return sign + Math.round(whole / 1000) + NBSP + t('money.k');
  return sign + String(whole);
}

/**
 * Foydalanuvchi kiritgan matndan summani eng kichik birlikda oladi.
 * Kasr xonasi bor valyutada «12,3» → 1230, «12,345» → 1234 (ortig'i tashlanadi).
 */
export function parseAmount(s: string, code?: string): number {
  const dec = code ? curOf(code).dec : 0;
  const raw = String(s);
  if (dec === 0) {
    const digits = raw.replace(/[^\d]/g, '');
    if (!digits) return 0;
    const n = parseInt(digits, 10);
    return Number.isFinite(n) ? n : 0;
  }
  // Oxirgi nuqta yoki vergul — kasr ajratuvchisi; qolgan belgilar tashlanadi.
  const cleaned = raw.replace(/[^\d.,]/g, '');
  const cut = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
  const whole = (cut === -1 ? cleaned : cleaned.slice(0, cut)).replace(/[^\d]/g, '');
  const frac = (cut === -1 ? '' : cleaned.slice(cut + 1)).replace(/[^\d]/g, '').slice(0, 2);
  if (!whole && !frac) return 0;
  const n = parseInt(whole || '0', 10) * 100 + parseInt(frac.padEnd(2, '0') || '0', 10);
  return Number.isFinite(n) ? n : 0;
}

/** Kiritish maydonida jonli formatlash. */
export function maskAmount(s: string, code?: string): string {
  const dec = code ? curOf(code).dec : 0;
  if (dec === 0) {
    const n = parseAmount(s, code);
    return n ? fmt(n, code) : '';
  }
  // Kasr xonali valyutada foydalanuvchi ajratuvchini yozib turadi, shuning
  // uchun matnni qayta yig'maymiz — faqat keraksiz belgilarni olib tashlaymiz.
  const cleaned = s.replace(/[^\d.,]/g, '');
  const cut = Math.max(cleaned.lastIndexOf('.'), cleaned.lastIndexOf(','));
  if (cut === -1) return cleaned;
  const whole = cleaned.slice(0, cut).replace(/[^\d]/g, '');
  const frac = cleaned
    .slice(cut + 1)
    .replace(/[^\d]/g, '')
    .slice(0, 2);
  return `${whole}${decSep()}${frac}`;
}
