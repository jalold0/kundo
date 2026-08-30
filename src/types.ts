import type { ThemeMode } from './theme';

export type CatKey = 'ish' | 'oqish' | 'biznes' | 'shaxsiy';
export type BlockKey = 'ertalab' | 'kunduzi' | 'kechqurun';
export type Pri = 1 | 2 | 3;
export type RepeatRule = 'kun' | 'ish' | 'hafta';

export type Task = {
  id: string;
  title: string;
  cat: CatKey;
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
  cat: CatKey;
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
  cat: string; // MONEY_CATS kaliti
  note?: string;
  date: string; // "YYYY-MM-DD"
  created: number;
};

export type Settings = {
  theme: ThemeMode;
  currency: string; // "so'm"
  weekStartsMonday: boolean;
  onboarded: boolean;
  lastTaskCat: CatKey;
  lastSpendCat: string;
  lastIncomeCat: string;
};

export type AppState = {
  v: number;
  tasks: Task[];
  repeats: Repeat[];
  habits: Habit[];
  entries: Entry[];
  budgets: Record<string, number>; // "YYYY-MM" -> oylik limit
  notes: string;
  settings: Settings;
  updated: string | null;
};
