import type { AppState } from '../types';

/**
 * Web uchun bo'sh amalga oshirish.
 *
 * `expo-notifications` web platformasi uchun umuman qurilmaydi (moduli
 * `./unregisterForNotificationsAsync` ni topa olmaydi va butun to'plam yiqiladi).
 * Metro `notify.web.ts` ni web uchun avtomatik tanlaydi, mobil tomonda esa
 * `notify.ts` ishlatiladi — shuning uchun chaqiruvchi kodda platforma tekshiruvi
 * kerak emas.
 *
 * Brauzerda eslatma yo'q: sozlama tugmalari ko'rinadi, lekin ruxsat so'rovi
 * darhol «yo'q» qaytaradi va hech narsa rejalashtirilmaydi.
 */

export async function askPermission(): Promise<boolean> {
  return false;
}

export async function hasPermission(): Promise<boolean> {
  return false;
}

export async function resync(_s: AppState): Promise<void> {
  // web'da rejalashtiriladigan narsa yo'q
}

export async function cancelAll(): Promise<void> {
  // web'da bekor qilinadigan narsa yo'q
}
