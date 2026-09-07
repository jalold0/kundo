import { getLang, t } from '../i18n';
import { MONTHS_FULL, MONTHS_IN, WDAYS_FULL, WDAYS_MIN, WDAYS_SHORT } from '../i18n/dates';

/*
 * Nomlar joriy tildan olinadi. Ular o'zgarmas ro'yxat emas, funksiya — chunki til
 * ish paytida almashadi. Hafta indeksi hamma joyda `Date.getDay()` tartibida:
 * 0 — yakshanba.
 */
export const months = () => MONTHS_FULL[getLang()];
export const monthsIn = () => MONTHS_IN[getLang()];
export const wdays = () => WDAYS_FULL[getLang()];
export const wshort = () => WDAYS_SHORT[getLang()];
export const wmin = () => WDAYS_MIN[getLang()];

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
  return `${months()[m - 1]} ${y}`;
}
export function daysInMonth(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}
/** Sana yozilishi har tilda boshqacha: «7-sentabr», «7 сентября», «Sep 7». */
export function longDate(s: string): string {
  const d = parseISO(s);
  const m = monthsIn()[d.getMonth()];
  const lang = getLang();
  if (lang === 'uz') return `${d.getDate()}-${m}`;
  if (lang === 'ru') return `${d.getDate()} ${m}`;
  return `${m} ${d.getDate()}`;
}
export function dayTitle(s: string): string {
  if (s === today()) return t('common.today');
  if (s === addDays(today(), -1)) return t('common.yesterday');
  if (s === addDays(today(), 1)) return t('common.tomorrow');
  return longDate(s);
}
export function nowHM(): string {
  const d = new Date();
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
