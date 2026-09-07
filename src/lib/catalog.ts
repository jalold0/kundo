import type { BlockKey, Cat, CatKind, EntryKind, Pri, RepeatRule, ToneKey } from '../types';

/** Yo'nalish qo'shganda tanlanadigan ranglar. */
export const TONES: { k: ToneKey; uz: string }[] = [
  { k: 'lojuvard', uz: "Ko'k" },
  { k: 'feruza', uz: 'Feruza' },
  { k: 'oltin', uz: 'Oltin' },
  { k: 'anor', uz: 'Anor' },
  { k: 'bodom', uz: 'Bodom' },
];

/**
 * Boshlang'ich yo'nalishlar. Bular faqat *namuna*: birinchi ishga tushirishda
 * `AppState.cats` ga ko'chiriladi, keyin foydalanuvchi ularni o'zgartira oladi.
 */
export const DEFAULT_CATS: Record<CatKind, Cat[]> = {
  task: [
    { k: 'ish', uz: 'Ish', tone: 'lojuvard' },
    { k: 'oqish', uz: "O'qish", tone: 'feruza' },
    { k: 'biznes', uz: 'Biznes', tone: 'oltin' },
    { k: 'shaxsiy', uz: 'Shaxsiy', tone: 'bodom' },
  ],
  // Xarajat yo'nalishlari — O'zbekiston sharoitiga moslangan
  spend: [
    { k: 'oziq', uz: 'Oziq-ovqat', tone: 'feruza' },
    { k: 'transport', uz: 'Transport', tone: 'lojuvard' },
    { k: 'uy', uz: 'Uy va kommunal', tone: 'oltin' },
    { k: 'aloqa', uz: 'Aloqa, internet', tone: 'bodom' },
    { k: 'salomatlik', uz: 'Salomatlik', tone: 'anor' },
    { k: 'talim', uz: "Ta'lim", tone: 'feruza' },
    { k: 'kiyim', uz: 'Kiyim-kechak', tone: 'bodom' },
    { k: 'kongil', uz: "Ko'ngilochar", tone: 'oltin' },
    { k: 'sovga', uz: "Sovg'a, tadbir", tone: 'anor' },
    { k: 'boshqa', uz: 'Boshqa', tone: 'lojuvard' },
  ],
  income: [
    { k: 'maosh', uz: 'Maosh', tone: 'feruza' },
    { k: 'qoshimcha', uz: "Qo'shimcha daromad", tone: 'lojuvard' },
    { k: 'savdo', uz: 'Savdo, biznes', tone: 'oltin' },
    { k: 'boshqa_kirim', uz: 'Boshqa', tone: 'bodom' },
  ],
};

/** Xarajat turi qaysi ro'yxatga tegishli. */
export function kindOf(kind: EntryKind): CatKind {
  return kind === 'kirim' ? 'income' : 'spend';
}

/**
 * Kalit bo'yicha yo'nalishni topadi. O'chirilgan yo'nalishga tegishli eski yozuv
 * uchrab qolsa ham ekran yiqilmasin — oxirgisi qaytariladi.
 */
export function findCat(list: Cat[], k: string): Cat {
  return list.find((c) => c.k === k) ?? list[list.length - 1] ?? DEFAULT_CATS.spend[0];
}

export const BLOCKS: { k: BlockKey; uz: string; span: string }[] = [
  { k: 'ertalab', uz: 'Ertalab', span: '06:00 — 12:00' },
  { k: 'kunduzi', uz: 'Kunduzi', span: '12:00 — 18:00' },
  { k: 'kechqurun', uz: 'Kechqurun', span: '18:00 — 23:00' },
];

export const PRIS: { k: Pri; uz: string; tone: ToneKey | null }[] = [
  { k: 1, uz: 'Shoshilinch', tone: 'anor' },
  { k: 2, uz: 'Muhim', tone: 'oltin' },
  { k: 3, uz: 'Oddiy', tone: null },
];

export const REPEAT_RULES: { k: RepeatRule | ''; uz: string }[] = [
  { k: '', uz: 'Bir marta' },
  { k: 'kun', uz: 'Har kuni' },
  { k: 'ish', uz: 'Ish kunlari' },
  { k: 'hafta', uz: 'Har hafta' },
];

export function pri(k: Pri) {
  return PRIS.find((p) => p.k === k) ?? PRIS[2];
}

export function blockOf(k: BlockKey) {
  return BLOCKS.find((b) => b.k === k) ?? BLOCKS[0];
}
