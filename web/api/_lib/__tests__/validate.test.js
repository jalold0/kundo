import { cleanEmail, cleanName, parseSignup } from '../validate.js';

describe('email tekshiruvi', () => {
  test('to‘g‘ri manzillar qabul qilinadi va kichik harfga o‘tkaziladi', () => {
    expect(cleanEmail('Jaloldin@Buxoro.online')).toEqual({ ok: true, value: 'jaloldin@buxoro.online' });
    expect(cleanEmail('  a.b+tag@mail.co.uk  ')).toEqual({ ok: true, value: 'a.b+tag@mail.co.uk' });
    expect(cleanEmail('user_123@example-site.uz')).toEqual({ ok: true, value: 'user_123@example-site.uz' });
  });

  test('noto‘g‘ri manzillar rad etiladi', () => {
    const bad = [
      '',
      '   ',
      'salom',
      'a@b',
      '@example.com',
      'user@',
      'user@@example.com',
      'user@.com',
      'user@example.',
      'user@exam..ple.com',
      'user name@example.com',
      'user@exam ple.com',
    ];
    bad.forEach((v) => expect(cleanEmail(v).ok).toBe(false));
  });

  test('matn bo‘lmagan qiymatlar rad etiladi', () => {
    expect(cleanEmail(undefined).ok).toBe(false);
    expect(cleanEmail(null).ok).toBe(false);
    expect(cleanEmail(42).ok).toBe(false);
    expect(cleanEmail({}).ok).toBe(false);
  });

  test('juda uzun manzil rad etiladi', () => {
    expect(cleanEmail('a'.repeat(250) + '@example.com').ok).toBe(false);
  });
});

describe('ism maydoni', () => {
  test('ortiqcha bo‘shliqlar tozalanadi', () => {
    expect(cleanName('  Jaloldin   Yusupov ')).toBe('Jaloldin Yusupov');
  });

  test('bo‘sh yoki matn bo‘lmasa null', () => {
    expect(cleanName('')).toBeNull();
    expect(cleanName('   ')).toBeNull();
    expect(cleanName(undefined)).toBeNull();
    expect(cleanName(123)).toBeNull();
  });

  test('juda uzun ism qisqartiriladi', () => {
    expect(cleanName('x'.repeat(200)).length).toBe(80);
  });
});

describe('formani qabul qilish', () => {
  test('to‘g‘ri so‘rov', () => {
    expect(parseSignup({ email: 'A@example.com', name: ' Ali ' })).toEqual({
      ok: true,
      email: 'a@example.com',
      name: 'Ali',
    });
  });

  test('ismsiz ham bo‘ladi', () => {
    const r = parseSignup({ email: 'a@example.com' });
    expect(r).toEqual({ ok: true, email: 'a@example.com', name: null });
  });

  test('honeypot to‘ldirilgan bo‘lsa — bot, 202 bilan jimgina rad etiladi', () => {
    const r = parseSignup({ email: 'a@example.com', website: 'http://spam.example' });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(202);
  });

  test('bo‘sh honeypot xalaqit bermaydi', () => {
    expect(parseSignup({ email: 'a@example.com', website: '   ' }).ok).toBe(true);
  });

  test('noto‘g‘ri email — 400', () => {
    const r = parseSignup({ email: 'salom' });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(400);
  });

  test('bo‘sh yoki noto‘g‘ri so‘rov tanasi', () => {
    expect(parseSignup(null).ok).toBe(false);
    expect(parseSignup('matn').ok).toBe(false);
    expect(parseSignup(undefined).status).toBe(400);
  });
});
