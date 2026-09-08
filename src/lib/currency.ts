import * as Localization from 'expo-localization';
import { getLang, t, type TKey } from '../i18n';

/**
 * Valyuta.
 *
 * `dec` — kasr xonalari soni. So'm va tenge amalda butun sonda yuritiladi
 * (tiyin ishlatilmaydi), dollar va evro esa ikki xonali.
 *
 * Summalar **eng kichik birlikda** butun son bo'lib saqlanadi: so'mda 1 = 1 so'm,
 * dollarda 1 = 1 sent. So'm uchun `dec = 0` bo'lgani uchun eski yozuvlar
 * o'zgarmaydi — ular allaqachon butun so'm edi, migratsiya kerak emas.
 */
export type Cur = { code: string; dec: 0 | 2; quick: number[] };

/**
 * `quick` — «tez qo'shish» tugmalari eng kichik birlikda. Har valyutada o'z
 * miqyosi bor: so'mda o'n minglar, dollarda birliklar.
 */
export const CURRENCIES: Cur[] = [
  { code: 'UZS', dec: 0, quick: [10_000, 50_000, 100_000, 500_000] },
  { code: 'RUB', dec: 2, quick: [10_000, 50_000, 100_000, 500_000] },
  { code: 'KZT', dec: 0, quick: [500, 2_000, 5_000, 20_000] },
  { code: 'USD', dec: 2, quick: [100, 500, 1_000, 5_000] },
  { code: 'EUR', dec: 2, quick: [100, 500, 1_000, 5_000] },
  { code: 'TRY', dec: 2, quick: [5_000, 20_000, 50_000, 200_000] },
];

export const DEFAULT_CUR = 'UZS';

/**
 * Qurilma valyutasi — faqat birinchi ochilishda. Til emas, **mintaqa** muhim:
 * Toshkentdagi rus tilli foydalanuvchi ham so'mda hisob yuritadi.
 */
export function deviceCur(): string {
  try {
    for (const loc of Localization.getLocales()) {
      const code = (loc.currencyCode ?? '').toUpperCase();
      if (CURRENCIES.some((c) => c.code === code)) return code;
    }
  } catch {
    // qurilma ma'lumoti yo'q — so'm
  }
  return DEFAULT_CUR;
}

export function curOf(code: string): Cur {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Ko'rinadigan nom — tilga qarab («so'm», «сум», «UZS»). */
export function curLabel(code: string): string {
  return t(`cur.${curOf(code).code}` as TKey);
}

/**
 * Kasr ajratuvchisi. O‘zbekcha va ruschada vergul, inglizchada nuqta —
 * O‘zbekistonda ham «12,34» deb yoziladi.
 */
export const decSep = () => (getLang() === 'en' ? '.' : ',');

/**
 * Eski sozlamadagi valyuta *yorlig'ini* kodga o'giradi. Ilgari `settings.currency`
 * da «so'm» kabi matn turardi — endi kod (`UZS`) saqlanadi.
 */
export function curFromLabel(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.trim()) return DEFAULT_CUR;
  const v = raw.trim().toUpperCase();
  const known = CURRENCIES.find((c) => c.code === v);
  if (known) return known.code;
  const s = raw.trim().toLowerCase();
  if (s.includes('so') || s.includes('сум') || s.includes('sum')) return 'UZS';
  if (s.includes('руб') || s.includes('rub') || s === '₽') return 'RUB';
  if (s.includes('тенге') || s === '₸') return 'KZT';
  if (s.includes('dollar') || s === '$') return 'USD';
  if (s.includes('evro') || s.includes('евро') || s === '€') return 'EUR';
  if (s.includes('lira') || s === '₺') return 'TRY';
  return DEFAULT_CUR;
}
