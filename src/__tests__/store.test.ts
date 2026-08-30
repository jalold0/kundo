import { addDays, today } from '../lib/date';
import {
  byCategory,
  dailyTotals,
  entriesInMonth,
  normalize,
  overdue,
  recentAmounts,
  repeatMatches,
  sortTasks,
  streak,
  sumBy,
  tasksOn,
  uid,
} from '../store';
import type { AppState, Entry, Habit, Repeat, Task } from '../types';

const t = (over: Partial<Task> = {}): Task => ({
  id: uid(),
  title: 'vazifa',
  cat: 'ish',
  pri: 3,
  block: 'ertalab',
  date: today(),
  done: false,
  created: 1,
  ...over,
});

const e = (over: Partial<Entry> = {}): Entry => ({
  id: uid(),
  kind: 'chiqim',
  amount: 1000,
  cat: 'oziq',
  date: today(),
  created: 1,
  ...over,
});

const base = (over: Partial<AppState> = {}): AppState => normalize({ ...over });

describe('normalize — buzilgan ma’lumotdan himoya', () => {
  test('bo‘sh yoki noto‘g‘ri kiritmadan ishlaydigan holat qaytaradi', () => {
    expect(normalize(null).tasks).toEqual([]);
    expect(normalize('salom' as any).habits).toEqual([]);
    expect(normalize(undefined).settings.currency).toBe("so'm");
  });

  test('nomsiz yoki id’siz yozuvlar tashlab yuboriladi', () => {
    const s = normalize({
      tasks: [{ id: 'a', title: 'bor' }, { id: 'b' }, { title: 'idsiz' }, null],
      habits: [{ id: 'h', name: 'sport' }, { id: 'x' }],
      entries: [
        { id: 'e', amount: 100 },
        { id: 'bad', amount: 'ko‘p' },
      ],
    });
    expect(s.tasks).toHaveLength(1);
    expect(s.habits).toHaveLength(1);
    expect(s.entries).toHaveLength(1);
  });

  test('eski zaxirada yo‘q maydonlar sozlamadan to‘ldiriladi', () => {
    const s = normalize({ tasks: [], habits: [], settings: { theme: 'dark' } });
    expect(s.settings.theme).toBe('dark');
    expect(s.settings.onboarded).toBe(false);
    expect(s.settings.lastSpendCat).toBe('oziq');
    expect(s.budgets).toEqual({});
  });

  test('odatning days maydoni yo‘q bo‘lsa bo‘sh ob’ekt bo‘ladi', () => {
    const s = normalize({ tasks: [], habits: [{ id: 'h', name: 'suv' }] });
    expect(s.habits[0].days).toEqual({});
  });
});

describe('vazifalar tartibi', () => {
  test('bajarilmagan avval, keyin vaqt, keyin ustuvorlik', () => {
    const rows = sortTasks([
      t({ title: 'bajarilgan', done: true, time: '07:00' }),
      t({ title: 'kechroq', time: '15:00' }),
      t({ title: 'ertaroq', time: '09:00' }),
      t({ title: 'vaqtsiz-muhim', pri: 1 }),
      t({ title: 'vaqtsiz-oddiy', pri: 3 }),
    ]);
    expect(rows.map((x) => x.title)).toEqual([
      'ertaroq',
      'kechroq',
      'vaqtsiz-muhim',
      'vaqtsiz-oddiy',
      'bajarilgan',
    ]);
  });

  test('asl massiv o‘zgarmaydi', () => {
    const list = [t({ title: 'b', done: true }), t({ title: 'a' })];
    const copy = [...list];
    sortTasks(list);
    expect(list).toEqual(copy);
  });
});

describe('kunlar va kechikkanlar', () => {
  test('tasksOn faqat o‘sha kunni beradi', () => {
    const s = base({ tasks: [t({ date: '2026-08-29' }), t({ date: '2026-08-30' })] });
    expect(tasksOn(s, '2026-08-29')).toHaveLength(1);
  });

  test('overdue — o‘tgan kunlarning bajarilmaganlari', () => {
    const s = base({
      tasks: [
        t({ date: addDays(today(), -2) }),
        t({ date: addDays(today(), -1), done: true }),
        t({ date: today() }),
        t({ date: addDays(today(), 1) }),
      ],
    });
    expect(overdue(s)).toHaveLength(1);
  });
});

describe('odat ketma-ketligi (streak)', () => {
  const h = (days: string[]): Habit => ({
    id: 'h',
    name: 'sport',
    days: Object.fromEntries(days.map((d) => [d, true])) as Habit['days'],
  });

  test('bugun belgilangan bo‘lsa bugundan sanaydi', () => {
    expect(streak(h([today(), addDays(today(), -1), addDays(today(), -2)]))).toBe(3);
  });

  test('bugun hali belgilanmagan bo‘lsa kechagi ketma-ketlik saqlanadi', () => {
    expect(streak(h([addDays(today(), -1), addDays(today(), -2)]))).toBe(2);
  });

  test('uzilish ketma-ketlikni to‘xtatadi', () => {
    expect(streak(h([today(), addDays(today(), -1), addDays(today(), -3)]))).toBe(2);
  });

  test('hech qachon belgilanmagan odat — 0', () => {
    expect(streak(h([]))).toBe(0);
  });

  test('faqat ancha oldingi kunlar — 0', () => {
    expect(streak(h([addDays(today(), -5)]))).toBe(0);
  });
});

describe('takrorlanuvchi vazifalar qoidasi', () => {
  const r = (over: Partial<Repeat>): Repeat => ({
    id: 'r',
    title: 'yig‘ilish',
    cat: 'ish',
    pri: 3,
    block: 'ertalab',
    rule: 'kun',
    wd: 1,
    from: '2026-08-01',
    ...over,
  });

  test('«har kuni» — hamma kunga', () => {
    expect(repeatMatches(r({ rule: 'kun' }), '2026-08-29')).toBe(true);
    expect(repeatMatches(r({ rule: 'kun' }), '2026-08-30')).toBe(true);
  });

  test('«ish kunlari» — dushanbadan jumagacha', () => {
    const rule = r({ rule: 'ish' });
    expect(repeatMatches(rule, '2026-08-24')).toBe(true); // dushanba
    expect(repeatMatches(rule, '2026-08-28')).toBe(true); // juma
    expect(repeatMatches(rule, '2026-08-29')).toBe(false); // shanba
    expect(repeatMatches(rule, '2026-08-30')).toBe(false); // yakshanba
  });

  test('«har hafta» — faqat o‘sha hafta kuni', () => {
    const rule = r({ rule: 'hafta', wd: 3 }); // chorshanba
    expect(repeatMatches(rule, '2026-08-26')).toBe(true);
    expect(repeatMatches(rule, '2026-08-27')).toBe(false);
  });
});

describe('moliyaviy hisob-kitob', () => {
  const s = base({
    entries: [
      e({ amount: 185000, cat: 'oziq', date: '2026-08-10' }),
      e({ amount: 42000, cat: 'transport', date: '2026-08-10' }),
      e({ amount: 63000, cat: 'oziq', date: '2026-08-22' }),
      e({ amount: 5000000, kind: 'kirim', cat: 'maosh', date: '2026-08-05' }),
      e({ amount: 99000, cat: 'oziq', date: '2026-07-30' }), // boshqa oy
    ],
  });

  test('entriesInMonth faqat shu oyni oladi', () => {
    expect(entriesInMonth(s, '2026-08')).toHaveLength(4);
    expect(entriesInMonth(s, '2026-07')).toHaveLength(1);
  });

  test('sumBy chiqim va kirimni ajratadi', () => {
    const m = entriesInMonth(s, '2026-08');
    expect(sumBy(m, 'chiqim')).toBe(290000);
    expect(sumBy(m, 'kirim')).toBe(5000000);
  });

  test('byCategory kamayish tartibida yig‘adi', () => {
    const rows = byCategory(entriesInMonth(s, '2026-08'), 'chiqim');
    expect(rows).toEqual([
      { cat: 'oziq', total: 248000 },
      { cat: 'transport', total: 42000 },
    ]);
  });

  test('dailyTotals kunlarga to‘g‘ri taqsimlaydi', () => {
    const d = dailyTotals(entriesInMonth(s, '2026-08'), '2026-08', 31);
    expect(d).toHaveLength(31);
    expect(d[9]).toBe(227000); // 10-avgust
    expect(d[21]).toBe(63000); // 22-avgust
    expect(d[4]).toBe(0); // kirim hisobga olinmaydi
    expect(d.reduce((a, b) => a + b, 0)).toBe(290000);
  });

  test('recentAmounts takrorlanmaydigan so‘nggi summalarni beradi', () => {
    const st = base({
      entries: [
        e({ amount: 10000, created: 1 }),
        e({ amount: 20000, created: 2 }),
        e({ amount: 20000, created: 3 }),
        e({ amount: 30000, created: 4 }),
        e({ amount: 900000, kind: 'kirim', created: 5 }),
      ],
    });
    expect(recentAmounts(st, 'chiqim')).toEqual([30000, 20000, 10000]);
    expect(recentAmounts(st, 'kirim')).toEqual([900000]);
    expect(recentAmounts(st, 'chiqim', 2)).toEqual([30000, 20000]);
  });
});
