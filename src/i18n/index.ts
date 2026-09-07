import * as Localization from 'expo-localization';
import { en } from './en';
import { ru } from './ru';
import { uz, type Dict } from './uz';

export type Lang = 'uz' | 'ru' | 'en';

/** Til tanlash ro'yxati — nomlar har doim o'z tilida yoziladi. */
export const LANGS: { k: Lang; label: string }[] = [
  { k: 'uz', label: "O'zbek" },
  { k: 'ru', label: 'Русский' },
  { k: 'en', label: 'English' },
];

export type TKey = keyof Dict;

const DICTS: Record<Lang, Dict> = { uz, ru, en };

/**
 * Joriy til modul darajasida turadi, chunki tarjima React'dan tashqarida ham
 * kerak bo'ladi (`lib/date.ts`, `lib/backup.ts`). Til o'zgarganda `settings`
 * o'zgaradi va do'kondan foydalanadigan ekranlar qayta chiziladi.
 */
let current: Lang = 'uz';

export function setLang(l: Lang) {
  current = l;
}

export function getLang(): Lang {
  return current;
}

/** Qurilma tilidan mos til — faqat birinchi ochilishda ishlatiladi. */
export function deviceLang(): Lang {
  try {
    for (const loc of Localization.getLocales()) {
      const code = (loc.languageCode ?? '').toLowerCase();
      if (code === 'uz' || code === 'ru' || code === 'en') return code;
    }
  } catch {
    // qurilma ma'lumoti yo'q bo'lsa — o'zbekcha
  }
  return 'uz';
}

/**
 * Tarjima. `vars` — matn ichidagi `{nom}` o'rinbosarlari.
 * Kalit topilmasa o'zbekchasi, u ham bo'lmasa kalitning o'zi qaytadi — ilova
 * hech qachon bo'sh matn ko'rsatmaydi.
 */
export function t(key: TKey, vars?: Record<string, string | number>): string {
  const raw = DICTS[current][key] ?? uz[key] ?? String(key);
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name: string) => (name in vars ? String(vars[name]) : `{${name}}`));
}
