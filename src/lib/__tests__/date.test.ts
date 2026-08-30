import {
  addDays,
  addMonths,
  dayTitle,
  daysInMonth,
  iso,
  longDate,
  monthLabel,
  monthOf,
  parseISO,
  wd,
  weekStart,
} from '../date';

describe('sana hisob-kitobi', () => {
  test('iso — bir xonali oy va kun nol bilan to‘ldiriladi', () => {
    expect(iso(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(iso(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  test('parseISO mahalliy vaqt bo‘yicha o‘qiydi (UTC siljishi yo‘q)', () => {
    const d = parseISO('2026-03-08');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(8);
  });

  test('addDays oy va yil chegarasidan to‘g‘ri o‘tadi', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  test('kabisa yili fevrali 29 kun', () => {
    expect(daysInMonth('2024-02')).toBe(29);
    expect(daysInMonth('2026-02')).toBe(28);
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
  });

  test('hafta dushanbadan boshlanadi', () => {
    // 2026-08-29 — shanba
    expect(wd('2026-08-29')).toBe(6);
    expect(weekStart('2026-08-29')).toBe('2026-08-24'); // dushanba
    // yakshanba oldingi haftaga tegishli
    expect(weekStart('2026-08-30')).toBe('2026-08-24');
    // dushanbaning o‘zi o‘zgarmaydi
    expect(weekStart('2026-08-24')).toBe('2026-08-24');
  });

  test('addMonths yil chegarasini hisobga oladi', () => {
    expect(addMonths('2026-01', -1)).toBe('2025-12');
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2026-08', 0)).toBe('2026-08');
  });

  test('monthOf va monthLabel', () => {
    expect(monthOf('2026-08-29')).toBe('2026-08');
    expect(monthLabel('2026-08')).toBe('Avgust 2026');
    expect(monthLabel('2026-01')).toBe('Yanvar 2026');
  });

  test('longDate o‘zbekcha oy nomini beradi', () => {
    expect(longDate('2026-08-29')).toBe('29-avgust');
    expect(longDate('2026-11-01')).toBe('1-noyabr');
  });

  test('dayTitle bugun / kecha / ertaga deb ataydi', () => {
    const t = iso(new Date());
    expect(dayTitle(t)).toBe('Bugun');
    expect(dayTitle(addDays(t, -1))).toBe('Kecha');
    expect(dayTitle(addDays(t, 1))).toBe('Ertaga');
    expect(dayTitle(addDays(t, 5))).toBe(longDate(addDays(t, 5)));
  });
});
