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

  test('fmtWith yorliqni qo‘shadi', () => {
    expect(fmtWith(50000, "so'm")).toBe(`${n('50 000')} so'm`);
    expect(fmtWith(1234, '$', 'USD')).toBe('12,34 $');
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

describe('kasr xonali valyuta', () => {
  test('fmt sentlarni ajratadi', () => {
    expect(fmt(0, 'USD')).toBe('0,00');
    expect(fmt(5, 'USD')).toBe('0,05');
    expect(fmt(1234, 'USD')).toBe('12,34');
    expect(fmt(123456789, 'USD')).toBe(n('1 234 567,89'));
    expect(fmt(-1234, 'USD')).toBe(n('-12,34'));
  });

  test('so‘m kasrsiz qoladi', () => {
    expect(fmt(1234, 'UZS')).toBe(n('1 234'));
  });

  test('parseAmount kasrni sentga aylantiradi', () => {
    expect(parseAmount('12.34', 'USD')).toBe(1234);
    expect(parseAmount('12,34', 'USD')).toBe(1234);
    expect(parseAmount('12', 'USD')).toBe(1200);
    expect(parseAmount('12.3', 'USD')).toBe(1230);
    // Ortiqcha xona tashlanadi, yaxlitlanmaydi — pul hisobida taxmin qilinmaydi.
    expect(parseAmount('12.349', 'USD')).toBe(1234);
    expect(parseAmount('0.05', 'USD')).toBe(5);
    expect(parseAmount('', 'USD')).toBe(0);
    expect(parseAmount('abc', 'USD')).toBe(0);
    expect(parseAmount(n('1 234,56'), 'USD')).toBe(123456);
  });

  test('kiritish → saqlash → ko‘rsatish aylanasi dollarda ham buzilmaydi', () => {
    const stored = parseAmount('1 234,56', 'USD');
    expect(stored).toBe(123456);
    expect(fmt(stored, 'USD')).toBe(n('1 234,56'));
  });

  test('fmtShort dollarda butun qismdan hisoblaydi', () => {
    // 1 200 000 sent = 12 000 dollar
    expect(fmtShort(1_200_000, 'USD')).toBe(n('12 ming'));
    expect(fmtShort(120_000_000, 'USD')).toBe(n('1,2 mln'));
  });

  test('maskAmount kasr ajratuvchisini saqlaydi', () => {
    expect(maskAmount('12.3', 'USD')).toBe('12,3');
    expect(maskAmount('12.345', 'USD')).toBe('12,34');
    expect(maskAmount('12', 'USD')).toBe('12');
    expect(maskAmount('abc', 'USD')).toBe('');
  });
});
