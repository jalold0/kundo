import { MINUS, NBSP, fmt, fmtShort, fmtWith, maskAmount, parseAmount } from '../money';

/** Testlarda ko'zga ko'rinmas belgilarni aniq yozamiz. */
const n = (s: string) => s.replace(/ /g, NBSP).replace(/^-/, MINUS);

describe('summa formatlash', () => {
  test('fmt uch xonadan bo‘shliq qo‘yadi', () => {
    expect(fmt(0)).toBe('0');
    expect(fmt(500)).toBe('500');
    expect(fmt(1000)).toBe(n('1 000'));
    expect(fmt(185000)).toBe(n('185 000'));
    expect(fmt(1250000)).toBe(n('1 250 000'));
    expect(fmt(12345678)).toBe(n('12 345 678'));
  });

  test('manfiy summa minus belgisi bilan', () => {
    expect(fmt(-185000)).toBe(n('-185 000'));
  });

  test('kasr son yaxlitlanadi', () => {
    expect(fmt(1999.6)).toBe(n('2 000'));
  });

  test('fmtWith valyutani qo‘shadi', () => {
    expect(fmtWith(50000)).toBe(`${n('50 000')} so'm`);
    expect(fmtWith(50000, 'USD')).toBe(`${n('50 000')} USD`);
  });

  test('fmtShort — ming va mln', () => {
    expect(fmtShort(500)).toBe('500');
    expect(fmtShort(42000)).toBe(n('42 ming'));
    expect(fmtShort(950000)).toBe(n('950 ming'));
    expect(fmtShort(1200000)).toBe(n('1,2 mln'));
    expect(fmtShort(12000000)).toBe(n('12 mln'));
    expect(fmtShort(-1500000)).toBe(n('-1,5 mln'));
  });

  test('parseAmount faqat raqamlarni oladi', () => {
    expect(parseAmount(n('185 000'))).toBe(185000);
    expect(parseAmount('1 250 000')).toBe(1250000);
    expect(parseAmount('')).toBe(0);
    expect(parseAmount('abc')).toBe(0);
    expect(parseAmount('12a3')).toBe(123);
    expect(parseAmount('0')).toBe(0);
  });

  test('maskAmount kiritish paytida formatlaydi', () => {
    expect(maskAmount('185000')).toBe(n('185 000'));
    expect(maskAmount(n('185 000'))).toBe(n('185 000')); // qayta formatlashda buzilmaydi
    expect(maskAmount('')).toBe('');
    expect(maskAmount('abc')).toBe('');
  });

  test('kiritish → saqlash → ko‘rsatish aylanasi qiymatni buzmaydi', () => {
    const typed = n('1 250 000');
    const stored = parseAmount(typed);
    expect(stored).toBe(1250000);
    expect(fmt(stored)).toBe(typed);
  });
});
