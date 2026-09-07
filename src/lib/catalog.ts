import { t, type TKey } from '../i18n';
import type { BlockKey, Cat, CatKind, EntryKind, Pri, RepeatRule, ToneKey } from '../types';

export const TONE_KEYS: ToneKey[] = ['lojuvard', 'feruza', 'oltin', 'anor', 'bodom'];

/** Yo'nalish qo'shganda tanlanadigan ranglar. Funksiya — nomlar tilga bog'liq. */
export const tones = (): { k: ToneKey; label: string }[] =>
  TONE_KEYS.map((k) => ({ k, label: t(`tone.${k}` as TKey) }));

/**
 * Boshlang'ich yo'nalishlar: kalit va rang. Nomlari birinchi ochilishda joriy
 * tilda `AppState.cats` ga ko'chiriladi, keyin foydalanuvchi ularni o'zgartira
 * oladi — shuning uchun bu ro'yxat faqat *urug'*, ko'rinadigan manba emas.
 */
export const DEFAULT_CATS: Record<CatKind, { k: string; tone: ToneKey }[]> = {
  task: [
    { k: 'ish', tone: 'lojuvard' },
    { k: 'oqish', tone: 'feruza' },
    { k: 'biznes', tone: 'oltin' },
    { k: 'shaxsiy', tone: 'bodom' },
  ],
  // Xarajat yo'nalishlari — O'zbekiston sharoitiga moslangan
  spend: [
    { k: 'oziq', tone: 'feruza' },
    { k: 'transport', tone: 'lojuvard' },
    { k: 'uy', tone: 'oltin' },
    { k: 'aloqa', tone: 'bodom' },
    { k: 'salomatlik', tone: 'anor' },
    { k: 'talim', tone: 'feruza' },
    { k: 'kiyim', tone: 'bodom' },
    { k: 'kongil', tone: 'oltin' },
    { k: 'sovga', tone: 'anor' },
    { k: 'boshqa', tone: 'lojuvard' },
  ],
  income: [
    { k: 'maosh', tone: 'feruza' },
    { k: 'qoshimcha', tone: 'lojuvard' },
    { k: 'savdo', tone: 'oltin' },
    { k: 'boshqa_kirim', tone: 'bodom' },
  ],
};

/** Namunaviy ro'yxat joriy tilda — birinchi ochilishda ma'lumotga yoziladi. */
export function defaultCatList(kind: CatKind): Cat[] {
  return DEFAULT_CATS[kind].map((c) => ({ ...c, label: t(`cat.${c.k}` as TKey) }));
}

/** Xarajat turi qaysi ro'yxatga tegishli. */
export function kindOf(kind: EntryKind): CatKind {
  return kind === 'kirim' ? 'income' : 'spend';
}

/**
 * Kalit bo'yicha yo'nalishni topadi. O'chirilgan yo'nalishga tegishli eski yozuv
 * uchrab qolsa ham ekran yiqilmasin — oxirgisi qaytariladi.
 */
export function findCat(list: Cat[], k: string): Cat {
  return list.find((c) => c.k === k) ?? list[list.length - 1] ?? defaultCatList('spend')[0];
}

export const BLOCKS: { k: BlockKey; span: string }[] = [
  { k: 'ertalab', span: '06:00 — 12:00' },
  { k: 'kunduzi', span: '12:00 — 18:00' },
  { k: 'kechqurun', span: '18:00 — 23:00' },
];

export const PRIS: { k: Pri; tone: ToneKey | null }[] = [
  { k: 1, tone: 'anor' },
  { k: 2, tone: 'oltin' },
  { k: 3, tone: null },
];

export const REPEAT_RULES: { k: RepeatRule | '' }[] = [{ k: '' }, { k: 'kun' }, { k: 'ish' }, { k: 'hafta' }];

/* Nomlar tildan olinadi — `t()` chaqiruvi render paytida bo'lishi kerak,
   aks holda til almashganda eski nom qolib ketadi. */
export const blockLabel = (k: BlockKey) => t(`block.${k}` as TKey);
export const priLabel = (k: Pri) => t(`pri.${k}` as TKey);
export const repeatLabel = (k: RepeatRule | '') => t(`repeat.${k || 'once'}` as TKey);

export function pri(k: Pri) {
  return PRIS.find((p) => p.k === k) ?? PRIS[2];
}

export function blockOf(k: BlockKey) {
  return BLOCKS.find((b) => b.k === k) ?? BLOCKS[0];
}
