import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CATS } from './lib/catalog';
import { addDays, daysInMonth, iso, today, wd } from './lib/date';
import type {
  AppState,
  Cat,
  CatKind,
  Entry,
  EntryKind,
  Habit,
  Repeat,
  RepeatRule,
  Settings,
  Task,
  ToneKey,
} from './types';

const KEY = 'kundo.state.v1';

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

const TONE_KEYS: ToneKey[] = ['lojuvard', 'feruza', 'oltin', 'anor', 'bodom'];

/** Namunaviy yo'nalishlarning nusxasi — asl ro'yxat o'zgarmasin. */
function defaultCats(): Record<CatKind, Cat[]> {
  return {
    task: DEFAULT_CATS.task.map((c) => ({ ...c })),
    spend: DEFAULT_CATS.spend.map((c) => ({ ...c })),
    income: DEFAULT_CATS.income.map((c) => ({ ...c })),
  };
}

/**
 * Saqlangan yo'nalish ro'yxatini tekshiradi. Eski zaxirada `cats` bo'lmasligi
 * mumkin (yo'nalishlar ilgari kod ichida edi) — bunda namunaviylar qo'yiladi.
 */
function normCats(raw: unknown, kind: CatKind): Cat[] {
  const list: Cat[] = [];
  const seen = new Set<string>();
  // Bir o'tishda: tekshirish ham, takroriy kalitni tashlash ham. Filter+map bo'lsa
  // `seen` filtrlash paytida bo'sh qolib, dublikat o'tib ketadi.
  if (Array.isArray(raw)) {
    for (const c of raw as any[]) {
      if (!c || typeof c.k !== 'string' || !c.k) continue;
      if (typeof c.uz !== 'string' || !c.uz.trim()) continue;
      if (seen.has(c.k)) continue;
      seen.add(c.k);
      list.push({
        k: c.k,
        uz: String(c.uz).trim(),
        tone: (TONE_KEYS.includes(c.tone) ? c.tone : 'lojuvard') as ToneKey,
      });
    }
  }
  return list.length ? list : defaultCats()[kind];
}

/** Yo'nalishga bog'langan yozuvlar soni — o'chirishdan oldin ko'rsatiladi. */
export function catUsage(s: AppState, kind: CatKind, k: string): number {
  if (kind === 'task') {
    return s.tasks.filter((t) => t.cat === k).length + s.repeats.filter((r) => r.cat === k).length;
  }
  const ek: EntryKind = kind === 'income' ? 'kirim' : 'chiqim';
  return s.entries.filter((e) => e.kind === ek && e.cat === k).length;
}

function seed(): AppState {
  return {
    v: 1,
    tasks: [],
    repeats: [],
    habits: [],
    entries: [],
    cats: defaultCats(),
    budgets: {},
    notes: '',
    settings: {
      theme: 'system',
      currency: "so'm",
      weekStartsMonday: true,
      onboarded: false,
      lastTaskCat: 'ish',
      lastSpendCat: 'oziq',
      lastIncomeCat: 'maosh',
    },
    updated: null,
  };
}

/** Boshlanish uchun taklif qilinadigan odatlar — foydalanuvchi tanlasa qo'shiladi. */
export const STARTER_HABITS = ['Sport / mashq', "Kitob o'qish (30 daqiqa)", 'Suv — 2 litr'];

export function normalize(raw: any): AppState {
  const base = seed();
  if (!raw || typeof raw !== 'object') return base;
  const s: AppState = {
    v: 1,
    tasks: Array.isArray(raw.tasks) ? raw.tasks.filter((t: any) => t && t.id && t.title) : [],
    repeats: Array.isArray(raw.repeats) ? raw.repeats.filter((r: any) => r && r.id && r.title) : [],
    habits: Array.isArray(raw.habits)
      ? raw.habits.filter((h: any) => h && h.id && h.name).map((h: any) => ({ ...h, days: h.days ?? {} }))
      : [],
    entries: Array.isArray(raw.entries)
      ? raw.entries.filter((e: any) => e && e.id && typeof e.amount === 'number')
      : [],
    cats: {
      task: normCats(raw.cats?.task, 'task'),
      spend: normCats(raw.cats?.spend, 'spend'),
      income: normCats(raw.cats?.income, 'income'),
    },
    budgets: raw.budgets && typeof raw.budgets === 'object' ? raw.budgets : {},
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    settings: { ...base.settings, ...(raw.settings ?? {}) },
    updated: raw.updated ?? null,
  };
  return s;
}

type Ctx = {
  ready: boolean;
  state: AppState;
  addTask: (t: Omit<Task, 'id' | 'created' | 'done'> & { repeat?: RepeatRule | '' }) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  undo: () => void;
  pushTask: (id: string, days: number) => void;
  rollover: () => void;
  removeRepeat: (id: string) => void;
  ensureRepeats: (date: string) => void;
  addHabit: (name: string) => void;
  addHabits: (names: string[]) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  addEntry: (e: Omit<Entry, 'id' | 'created'>) => void;
  updateEntry: (id: string, patch: Partial<Entry>) => void;
  removeEntry: (id: string) => void;
  setBudget: (ym: string, amount: number) => void;
  setNotes: (v: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  addCat: (kind: CatKind, uz: string, tone: ToneKey) => void;
  updateCat: (kind: CatKind, k: string, patch: { uz?: string; tone?: ToneKey }) => void;
  /** `moveTo` — o'chirilayotgan yo'nalishdagi yozuvlar ko'chiriladigan yo'nalish. */
  removeCat: (kind: CatKind, k: string, moveTo: string) => void;
  replaceAll: (s: AppState) => void;
  mergeIn: (s: AppState) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seed);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);
  const undoRef = useRef<AppState | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState(normalize(JSON.parse(raw)));
      } catch {
        // birinchi ishga tushirish yoki buzilgan ma'lumot — namunaviy holat qoladi
      } finally {
        loaded.current = true;
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state]);

  const edit = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => ({ ...fn(prev), updated: new Date().toISOString() }));
  }, []);

  /** Qaytarib bo'ladigan o'zgarish — oldingi holat eslab qolinadi. */
  const editU = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      undoRef.current = prev;
      return { ...fn(prev), updated: new Date().toISOString() };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      const snapshot = undoRef.current;
      undoRef.current = null;
      return snapshot ?? prev;
    });
  }, []);

  /**
   * Takrorlanuvchi vazifalarni ko'rilayotgan kunga tushiradi.
   * Barqaror (bog'liqliksiz) — shuning uchun useEffect ichida bemalol ishlatiladi.
   */
  const ensureRepeats = useCallback((date: string) => {
    setState((s) => {
      if (!s.repeats.length || date < today()) return s;
      const made: Task[] = [];
      for (const r of s.repeats) {
        if (date < r.from || !repeatMatches(r, date)) continue;
        if (s.tasks.some((t) => t.rid === r.id && t.date === date)) continue;
        made.push({
          id: uid(),
          rid: r.id,
          title: r.title,
          cat: r.cat,
          pri: r.pri,
          block: r.block,
          time: r.time,
          date,
          done: false,
          created: Date.now(),
        });
      }
      return made.length ? { ...s, tasks: [...s.tasks, ...made] } : s;
    });
  }, []);

  const api: Ctx = useMemo(
    () => ({
      ready,
      state,
      undo,

      addTask: ({ repeat, ...t }) =>
        edit((s) => {
          const task: Task = { ...t, id: uid(), done: false, created: Date.now() };
          if (repeat) {
            const r: Repeat = {
              id: uid(),
              title: t.title,
              cat: t.cat,
              pri: t.pri,
              block: t.block,
              time: t.time,
              rule: repeat,
              wd: wd(t.date),
              from: t.date,
            };
            task.rid = r.id;
            return { ...s, repeats: [...s.repeats, r], tasks: [...s.tasks, task] };
          }
          return { ...s, tasks: [...s.tasks, task] };
        }),

      toggleTask: (id) =>
        edit((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null } : t,
          ),
        })),

      updateTask: (id, patch) =>
        edit((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTask: (id) => editU((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),

      pushTask: (id, days) =>
        edit((s) => ({
          ...s,
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, date: addDays(t.date, days) } : t)),
        })),

      rollover: () =>
        editU((s) => {
          const t = today();
          return { ...s, tasks: s.tasks.map((x) => (!x.done && x.date < t ? { ...x, date: t } : x)) };
        }),

      removeRepeat: (id) =>
        editU((s) => {
          const t = today();
          return {
            ...s,
            repeats: s.repeats.filter((r) => r.id !== id),
            tasks: s.tasks.filter((x) => !(x.rid === id && !x.done && x.date > t)),
          };
        }),

      ensureRepeats,

      addHabit: (name) => edit((s) => ({ ...s, habits: [...s.habits, { id: uid(), name, days: {} }] })),
      addHabits: (names) =>
        edit((s) => ({
          ...s,
          habits: [...s.habits, ...names.map((name) => ({ id: uid(), name, days: {} }))],
        })),
      removeHabit: (id) => editU((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) })),
      toggleHabit: (id, date) =>
        edit((s) => ({
          ...s,
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const days = { ...h.days };
            if (days[date]) delete days[date];
            else days[date] = true;
            return { ...h, days };
          }),
        })),

      addEntry: (e) =>
        edit((s) => ({ ...s, entries: [...s.entries, { ...e, id: uid(), created: Date.now() }] })),
      updateEntry: (id, patch) =>
        edit((s) => ({
          ...s,
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeEntry: (id) => editU((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) })),

      setBudget: (ym, amount) =>
        edit((s) => {
          const budgets = { ...s.budgets };
          if (amount > 0) budgets[ym] = amount;
          else delete budgets[ym];
          return { ...s, budgets };
        }),

      setNotes: (v) => edit((s) => ({ ...s, notes: v })),
      setSettings: (patch) => edit((s) => ({ ...s, settings: { ...s.settings, ...patch } })),

      addCat: (kind, uz, tone) =>
        edit((s) => {
          const name = uz.trim();
          if (!name) return s;
          const list = s.cats[kind];
          // Bir xil nom ikki marta bo'lmasin — foydalanuvchi o'zi ham ajratmaydi.
          if (list.some((c) => c.uz.toLowerCase() === name.toLowerCase())) return s;
          return { ...s, cats: { ...s.cats, [kind]: [...list, { k: `c${uid()}`, uz: name, tone }] } };
        }),

      updateCat: (kind, k, patch) =>
        edit((s) => ({
          ...s,
          cats: {
            ...s.cats,
            // Kalit o'zgarmaydi: yozuvlar shu kalitga bog'langan.
            [kind]: s.cats[kind].map((c) =>
              c.k === k ? { ...c, uz: patch.uz?.trim() || c.uz, tone: patch.tone ?? c.tone } : c,
            ),
          },
        })),

      removeCat: (kind, k, moveTo) =>
        editU((s) => {
          const list = s.cats[kind];
          // Oxirgi yo'nalish o'chmaydi, aks holda yozuv qo'yadigan joy qolmaydi.
          if (list.length <= 1 || !list.some((c) => c.k === k)) return s;
          const fallback = list.find((c) => c.k !== k)!.k;
          const target = moveTo && moveTo !== k && list.some((c) => c.k === moveTo) ? moveTo : fallback;
          const cats = { ...s.cats, [kind]: list.filter((c) => c.k !== k) };

          if (kind === 'task') {
            return {
              ...s,
              cats,
              tasks: s.tasks.map((t) => (t.cat === k ? { ...t, cat: target } : t)),
              repeats: s.repeats.map((r) => (r.cat === k ? { ...r, cat: target } : r)),
              settings: s.settings.lastTaskCat === k ? { ...s.settings, lastTaskCat: target } : s.settings,
            };
          }

          const ek: EntryKind = kind === 'income' ? 'kirim' : 'chiqim';
          const settings = { ...s.settings };
          if (kind === 'spend' && settings.lastSpendCat === k) settings.lastSpendCat = target;
          if (kind === 'income' && settings.lastIncomeCat === k) settings.lastIncomeCat = target;
          return {
            ...s,
            cats,
            entries: s.entries.map((e) => (e.kind === ek && e.cat === k ? { ...e, cat: target } : e)),
            settings,
          };
        }),

      replaceAll: (next) => editU(() => normalize(next)),

      mergeIn: (incoming) =>
        edit((s) => {
          const ni = normalize(incoming);
          const haveT = new Set(s.tasks.map((t) => t.id));
          const haveE = new Set(s.entries.map((e) => e.id));
          const haveR = new Set(s.repeats.map((r) => r.id));
          const habits = s.habits.map((h) => ({ ...h, days: { ...h.days } }));
          for (const h of ni.habits) {
            const cur = habits.find((x) => x.id === h.id);
            if (cur)
              Object.keys(h.days).forEach((d) => {
                cur.days[d] = true;
              });
            else habits.push(h);
          }
          return {
            ...s,
            tasks: [...s.tasks, ...ni.tasks.filter((t) => !haveT.has(t.id))],
            entries: [...s.entries, ...ni.entries.filter((e) => !haveE.has(e.id))],
            repeats: [...s.repeats, ...ni.repeats.filter((r) => !haveR.has(r.id))],
            habits,
            budgets: { ...ni.budgets, ...s.budgets },
            notes:
              ni.notes && ni.notes !== s.notes
                ? s.notes
                  ? `${s.notes}\n\n— — —\n\n${ni.notes}`
                  : ni.notes
                : s.notes,
          };
        }),
    }),
    [state, ready, edit, editU, undo, ensureRepeats],
  );

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

/** Takrorlanuvchi vazifa shu kunga tushadimi — testlarda ham ishlatiladi. */
export function repeatMatches(r: Repeat, date: string): boolean {
  if (r.rule === 'kun') return true;
  if (r.rule === 'ish') {
    const w = wd(date);
    return w >= 1 && w <= 5;
  }
  return wd(date) === r.wd;
}

export function useStore(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore StoreProvider ichida chaqirilishi kerak');
  return c;
}

/* ---------- hisob-kitob yordamchilari ---------- */

export function tasksOn(s: AppState, date: string): Task[] {
  return s.tasks.filter((t) => t.date === date);
}

export function sortTasks(list: Task[]): Task[] {
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const at = a.time || '99:99';
    const bt = b.time || '99:99';
    if (at !== bt) return at < bt ? -1 : 1;
    if (a.pri !== b.pri) return a.pri - b.pri;
    return a.created - b.created;
  });
}

export function overdue(s: AppState): Task[] {
  const t = today();
  return s.tasks.filter((x) => !x.done && x.date < t);
}

export function streak(h: Habit): number {
  let n = 0;
  let d = today();
  if (!h.days[d]) d = addDays(d, -1);
  while (h.days[d]) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/** Eng uzun ketma-ketlik — butun tarix bo'ylab, hozirgi seriya bilan cheklanmagan. */
export function longestStreak(h: Habit): number {
  const days = Object.keys(h.days).sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}

export type HabitMonth = {
  days: { d: string; on: boolean; future: boolean }[];
  done: number;
  /** Kelasi kunlarsiz — foiz oy oxirigacha soxta pasaymasin. */
  counted: number;
};

/** Oy bo'ylab odat holati: har kun belgilangan-belgilanmaganligi va foiz uchun hisob. */
export function habitMonth(h: Habit, ym: string): HabitMonth {
  const n = daysInMonth(ym);
  const t = today();
  const days: HabitMonth['days'] = [];
  let done = 0;
  let counted = 0;
  for (let i = 1; i <= n; i++) {
    const d = `${ym}-${String(i).padStart(2, '0')}`;
    const future = d > t;
    const on = !!h.days[d];
    // Foiz faqat kelgan kunlardan hisoblanadi, aks holda 100% dan oshib ketishi mumkin
    // (eski ma'lumotda kelasi kun belgilangan bo'lsa — ilgari bunga ruxsat bor edi).
    if (!future) {
      counted++;
      if (on) done++;
    }
    days.push({ d, on, future });
  }
  return { days, done, counted };
}

export function entriesInMonth(s: AppState, ym: string): Entry[] {
  return s.entries.filter((e) => e.date.startsWith(ym));
}

export function sumBy(list: Entry[], kind: EntryKind): number {
  return list.reduce((a, e) => (e.kind === kind ? a + e.amount : a), 0);
}

export function byCategory(list: Entry[], kind: EntryKind): { cat: string; total: number }[] {
  const map = new Map<string, number>();
  list.forEach((e) => {
    if (e.kind !== kind) return;
    map.set(e.cat, (map.get(e.cat) ?? 0) + e.amount);
  });
  return [...map.entries()].map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
}

export function dailyTotals(list: Entry[], ym: string, days: number): number[] {
  const out = new Array(days).fill(0);
  list.forEach((e) => {
    if (e.kind !== 'chiqim' || !e.date.startsWith(ym)) return;
    const d = Number(e.date.slice(8, 10));
    if (d >= 1 && d <= days) out[d - 1] += e.amount;
  });
  return out;
}

/** Shu turdagi so'nggi ishlatilgan summalar — tez kiritish uchun */
export function recentAmounts(s: AppState, kind: EntryKind, n = 4): number[] {
  const seen: number[] = [];
  [...s.entries]
    .filter((e) => e.kind === kind)
    .sort((a, b) => b.created - a.created)
    .forEach((e) => {
      if (seen.length < n && !seen.includes(e.amount)) seen.push(e.amount);
    });
  return seen;
}

export function todayISO() {
  return today();
}
export { iso };
