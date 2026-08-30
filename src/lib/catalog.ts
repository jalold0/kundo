import type { BlockKey, CatKey, EntryKind, Pri, RepeatRule } from '../types';
import type { Palette } from '../theme';

export const CATS: { k: CatKey; uz: string; tone: keyof Palette }[] = [
  { k: 'ish', uz: 'Ish', tone: 'lojuvard' },
  { k: 'oqish', uz: "O'qish", tone: 'feruza' },
  { k: 'biznes', uz: 'Biznes', tone: 'oltin' },
  { k: 'shaxsiy', uz: 'Shaxsiy', tone: 'bodom' },
];

export const BLOCKS: { k: BlockKey; uz: string; span: string }[] = [
  { k: 'ertalab', uz: 'Ertalab', span: '06:00 — 12:00' },
  { k: 'kunduzi', uz: 'Kunduzi', span: '12:00 — 18:00' },
  { k: 'kechqurun', uz: 'Kechqurun', span: '18:00 — 23:00' },
];

export const PRIS: { k: Pri; uz: string; tone: keyof Palette | null }[] = [
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

/** Xarajat kategoriyalari — O'zbekiston sharoitiga moslangan */
export const SPEND_CATS: { k: string; uz: string; tone: keyof Palette }[] = [
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
];

export const INCOME_CATS: { k: string; uz: string; tone: keyof Palette }[] = [
  { k: 'maosh', uz: 'Maosh', tone: 'feruza' },
  { k: 'qoshimcha', uz: "Qo'shimcha daromad", tone: 'lojuvard' },
  { k: 'savdo', uz: 'Savdo, biznes', tone: 'oltin' },
  { k: 'boshqa_kirim', uz: 'Boshqa', tone: 'bodom' },
];

export function moneyCats(kind: EntryKind) {
  return kind === 'kirim' ? INCOME_CATS : SPEND_CATS;
}
export function moneyCat(kind: EntryKind, k: string) {
  const list = moneyCats(kind);
  return list.find((c) => c.k === k) ?? list[list.length - 1];
}
export function taskCat(k: CatKey) {
  return CATS.find((c) => c.k === k) ?? CATS[0];
}
export function pri(k: Pri) {
  return PRIS.find((p) => p.k === k) ?? PRIS[2];
}
export function blockOf(k: BlockKey) {
  return BLOCKS.find((b) => b.k === k) ?? BLOCKS[0];
}
