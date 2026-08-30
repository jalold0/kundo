import { neon } from '@neondatabase/serverless';
import { parseSignup } from './_lib/validate.js';

/**
 * Kutish ro'yxatiga yozilish.
 * POST /api/waitlist  { email, name?, website? }
 *
 * Muhit o'zgaruvchisi: DATABASE_URL — Neon ulanish satri.
 * Jadval `db/schema.sql` da; email UNIQUE, shuning uchun takroriy yozilish xato bermaydi.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Faqat POST.' });
  }

  const parsed = parseSignup(req.body);
  if (!parsed.ok) {
    // Honeypot ushlagan bo'lsa, botga muvaffaqiyat ko'rsatamiz — qayta urinmasin.
    if (parsed.status === 202) return res.status(200).json({ ok: true, already: false });
    return res.status(parsed.status).json({ ok: false, error: parsed.error });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL sozlanmagan');
    return res.status(500).json({ ok: false, error: 'Server sozlanmagan. Birozdan keyin urinib ko‘ring.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      INSERT INTO waitlist (email, name, source)
      VALUES (${parsed.email}, ${parsed.name}, 'sayt')
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    // Bo'sh natija — email allaqachon ro'yxatda.
    return res.status(200).json({ ok: true, already: rows.length === 0 });
  } catch (err) {
    console.error('waitlist insert failed:', err?.message ?? err);
    return res.status(500).json({ ok: false, error: 'Saqlab bo‘lmadi. Birozdan keyin urinib ko‘ring.' });
  }
}
