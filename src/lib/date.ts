export const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];
export const MONTHS_CAP = MONTHS.map((m) => m[0].toUpperCase() + m.slice(1));
export const WDAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
export const WSHORT = ['yak', 'dush', 'sesh', 'chor', 'pay', 'jum', 'shan'];
export const WMIN = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];

const p2 = (n: number) => (n < 10 ? '0' + n : '' + n);

export function iso(d: Date): string {
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
export function today(): string {
  return iso(new Date());
}
export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: string, n: number): string {
  const d = parseISO(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
export function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}`;
}
export function wd(s: string): number {
  return parseISO(s).getDay();
}
export function weekStart(s: string): string {
  const d = parseISO(s);
  const off = (d.getDay() + 6) % 7; // dushanbadan boshlanadi
  d.setDate(d.getDate() - off);
  return iso(d);
}
export function monthOf(s: string): string {
  return s.slice(0, 7);
}
export function thisMonth(): string {
  return today().slice(0, 7);
}
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS_CAP[m - 1]} ${y}`;
}
export function daysInMonth(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}
export function longDate(s: string): string {
  const d = parseISO(s);
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`;
}
export function dayTitle(s: string): string {
  if (s === today()) return 'Bugun';
  if (s === addDays(today(), -1)) return 'Kecha';
  if (s === addDays(today(), 1)) return 'Ertaga';
  return longDate(s);
}
export function nowHM(): string {
  const d = new Date();
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
