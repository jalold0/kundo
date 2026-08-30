/**
 * Kutish ro'yxati formasi uchun tekshiruvlar.
 * Bu fayl sof funksiyalardan iborat — bazaga ham, tarmoqqa ham bog'liq emas,
 * shuning uchun testlar uni to'g'ridan-to'g'ri chaqira oladi.
 */

const EMAIL_MAX = 254;
const NAME_MAX = 80;

/**
 * Email manzilini tekshiradi va tartibga soladi.
 * Qat'iy RFC tekshiruvi emas — amalda foydali bo'lgan darajada:
 * bitta @, ikkala tomonda belgi bor, domenda nuqta bor, bo'shliq yo'q.
 *
 * @param {unknown} raw
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
export function cleanEmail(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'Email kiritilmadi.' };
  const value = raw.trim().toLowerCase();
  if (!value) return { ok: false, error: 'Email kiritilmadi.' };
  if (value.length > EMAIL_MAX) return { ok: false, error: 'Email juda uzun.' };
  if (/\s/.test(value)) return { ok: false, error: 'Emailda bo‘shliq bo‘lmaydi.' };

  const parts = value.split('@');
  if (parts.length !== 2) return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  const [local, domain] = parts;
  if (!local || !domain) return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  if (!domain.includes('.')) return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
    return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  }
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
    return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  }
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
    return { ok: false, error: 'Email manzil noto‘g‘ri.' };
  }
  return { ok: true, value };
}

/**
 * Ixtiyoriy ism maydoni. Bo'sh bo'lsa null qaytaradi.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function cleanName(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim().replace(/\s+/g, ' ');
  if (!value) return null;
  return value.slice(0, NAME_MAX);
}

/**
 * Butun so'rovni tekshiradi.
 * `website` — botlar uchun yashirin maydon (honeypot): odam uni to'ldirmaydi.
 *
 * @param {unknown} body
 * @returns {{ ok: true, email: string, name: string | null }
 *          | { ok: false, status: number, error: string }}
 */
export function parseSignup(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'So‘rov bo‘sh.' };
  }
  const data = /** @type {Record<string, unknown>} */ (body);

  // Honeypot to'ldirilgan bo'lsa — bot. Xatoni ko'rsatmaymiz, shunchaki qabul qilmaymiz.
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return { ok: false, status: 202, error: 'ignored' };
  }

  const email = cleanEmail(data.email);
  if (!email.ok) return { ok: false, status: 400, error: email.error };

  return { ok: true, email: email.value, name: cleanName(data.name) };
}
