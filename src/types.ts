import type { Lang } from './i18n';
import type { ThemeMode } from './theme';

/** Yo'nalish rangi — palitradagi urg'u ranglari (Buxoro koshini). */
export type ToneKey = 'lojuvard' | 'feruza' | 'oltin' | 'anor' | 'bodom';

/**
 * Yo'nalish. Foydalanuvchi qo'shadi, nomini va rangini o'zgartiradi, o'chiradi —
 * shuning uchun kod ichida qotib yozilgan ro'yxat emas, `AppState.cats` da yashaydi.
 * `k` — yozuvlarda saqlanadigan barqaror kalit, uni hech qachon o'zgartirmaymiz;
 * `label` — ko'rinadigan nom (avvalgi zaxiralarda `uz` deb saqlangan).
 */
export type Cat = { k: string; label: string; tone: ToneKey };

/** Uch xil ro'yxat: vazifa yo'nalishlari, chiqim va kirim yo'nalishlari. */
export type CatKind = 'task' | 'spend' | 'income';

export type BlockKey = 'ertalab' | 'kunduzi' | 'kechqurun';
export type Pri = 1 | 2 | 3;
export type RepeatRule = 'kun' | 'ish' | 'hafta';

export type Task = {
  id: string;
  title: string;
  cat: string; // cats.task kaliti
  pri: Pri;
  block: BlockKey;
  time?: string; // "HH:MM"
  date: string; // "YYYY-MM-DD"
  done: boolean;
  doneAt?: string | null;
  rid?: string; // takrorlanuvchi vazifa shabloni
  created: number;
};

export type Repeat = {
  id: string;
  title: string;
  cat: string; // cats.task kaliti
  pri: Pri;
  block: BlockKey;
  time?: string;
  rule: RepeatRule;
  wd: number; // 0..6 — "hafta" uchun
  from: string;
};

export type Habit = { id: string; name: string; days: Record<string, true> };

export type EntryKind = 'chiqim' | 'kirim';

export type Entry = {
  id: string;
  kind: EntryKind;
  amount: number; // butun son, so'mda
  cat: string; // cats.spend yoki cats.income kaliti
  note?: string;
  date: string; // "YYYY-MM-DD"
  created: number;
};

export type Settings = {
  theme: ThemeMode;
  lang: Lang;
  currency: string; // "so'm"
  weekStartsMonday: boolean;
  onboarded: boolean;
  lastTaskCat: string;
  lastSpendCat: string;
  lastIncomeCat: string;
};

export type AppState = {
  v: number;
  tasks: Task[];
  repeats: Repeat[];
  habits: Habit[];
  entries: Entry[];
  cats: Record<CatKind, Cat[]>;
  budgets: Record<string, number>; // "YYYY-MM" -> oylik limit
  notes: string;
  settings: Settings;
  updated: string | null;
};
