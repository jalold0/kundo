# Loyihada ishlash tartibi

## Har safar o'zgarish kiritgandan keyin

```bash
npm run check
```

Bu bitta buyruq uchtasini ketma-ket bajaradi:

| Bosqich             | Nima tekshiradi                                                              |
| ------------------- | ---------------------------------------------------------------------------- |
| `npm run typecheck` | TypeScript xatolari — noto'g'ri maydon nomi, yo'q funksiya, mos kelmagan tip |
| `npm run lint`      | Kod uslubi va React qoidalari (hook bog'liqliklari, ishlatilmayotgan kod)    |
| `npm test`          | Sana, pul va holat mantig'ining to'g'riligi                                  |

Uchalasi ham yashil bo'lmasa, o'zgarishni tugallangan deb hisoblamang.

## Testlar nimani qamrab oladi

Testlar **ko'rinishni emas, mantiqni** tekshiradi — ya'ni jimgina xato qiladigan,
foydalanuvchi sezmaydigan joylarni:

- `src/lib/__tests__/date.test.ts` — oy va yil chegaralari, kabisa yili,
  hafta dushanbadan boshlanishi, «bugun / kecha / ertaga» nomlari
- `src/lib/__tests__/money.test.ts` — summa formatlash va qayta o'qish
  (kiritilgan `1 250 000` saqlanib, yana `1 250 000` bo'lib chiqishi)
- `src/__tests__/store.test.ts` — buzilgan zaxira faylidan himoya, vazifalar tartibi,
  odat ketma-ketligi (streak), takrorlanish qoidalari, oylik hisob-kitob

Yangi funksiya qo'shganda: agar u **hisoblasa** (sana, summa, statistika) — testi ham bo'lsin.
Agar u faqat ko'rsatsa (rang, joylashuv) — test shart emas, telefonda ko'rib qo'ying.

## Qo'lda tekshirish (har relizdan oldin)

Ilovani telefonda ochib, shu yo'ldan bir marta o'ting:

1. Vazifa qo'shish → bajarish → tahrirlash → o'chirish → **Bekor qilish**
2. «Har kuni» takrorini qo'yish, ertasi kuni ilovani ochib tekshirish
3. Xarajat yozish, byudjet qo'yish, oyni almashtirish
4. Odatni bir necha kun belgilash — ketma-ketlik sanog'i to'g'rimi
5. Zaxira olish → «Hammasini o'chirish» → zaxiradan tiklash
6. Ilovani butunlay yopib qayta ochish — ma'lumot joyidami
7. Qorong'i rejimga o'tish

## Kod uslubi

```bash
npm run format
```

Prettier sozlamalari `.prettierrc` da. Ranglar va o'lchamlar faqat `src/theme.ts` dan
olinadi — komponent ichida qattiq kodlangan rang bo'lmasin, aks holda qorong'i rejim buziladi.

## Versiya chiqarish

1. `app.json` da `version` ni oshiring (masalan `1.0.1`)
2. `npm run check` — hammasi yashil
3. `npm run build:apk` — sinov uchun, yoki `npm run build:play` — do'kon uchun

`android.versionCode` va `ios.buildNumber` ni EAS `autoIncrement` bilan o'zi oshiradi.
