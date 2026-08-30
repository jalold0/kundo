# Kun Tartibi

Kun rejasi, odatlar va xarajatlarni bir joyda yuritadigan mobil ilova.
Expo (React Native) da yozilgan — bitta koddan Android va iOS uchun ilova chiqadi.

Ma'lumot faqat telefonda saqlanadi: server yo'q, hisob ochish shart emas, internetsiz ishlaydi.

---

## Ilovada nima bor

| Bo'lim      | Nima qiladi                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kun**     | Vazifalar uch vaqt blokida (Ertalab / Kunduzi / Kechqurun), yo'nalish, ustuvorlik, aniq vaqt. Bajarilmay qolganlarni bir tugma bilan bugunga ko'chirish. |
| **Hafta**   | 7 kunlik ko'rinish, har kunning bajarilish darajasi, haftalik statistika, ochiq vazifalar.                                                               |
| **Xarajat** | Chiqim va kirim yozuvlari, 14 ta yo'nalish, oylik byudjet va qolgan mablag', kunlik sarf grafigi, yo'nalishlar bo'yicha taqsimot.                        |
| **Odatlar** | Kundalik odatlar va ketma-ket kunlar hisobi; takrorlanuvchi vazifalarni boshqarish.                                                                      |
| **Sozlama** | Mavzu (tizim / yorug' / qorong'i), zaxira olish va tiklash, xarajatlarni CSV qilib chiqarish.                                                            |

### Ishlatishni qulaylashtiradigan narsalar

- **Tez qo'shish** — Kun ekranida bir qatorli maydon: yozdingiz, «enter» bosdingiz, vazifa ro'yxatda.
  Vaqt, ustuvorlik va takror kerak bo'lsa, yuqoridagi «+» batafsil oynani ochadi.
- **Bekor qilish** — o'chirilgan vazifa, xarajat yoki odat darhol yo'qolmaydi: pastda
  «Bekor qilish» tugmasi bilan xabar chiqadi. Shuning uchun ilova hech qachon
  «rostdan o'chirasizmi?» deb yo'lni to'smaydi.
- **Eslab qoladi** — oxirgi ishlatilgan yo'nalish keyingi safar o'zi tanlanadi;
  xarajat oynasida so'nggi summalar bir bosishda qo'yiladi.
- **Toza boshlanish** — birinchi ochilishda qisqa tanishtiruv va «uchta odat bilan boshlansin»
  degan bitta savol. Soxta namunaviy vazifalar yo'q.
- **Oylar solishtiriladi** — oylik chiqim ostida o'tgan oyga nisbatan farq ko'rsatiladi.
- **Sezilarli javob** — bajarilgan vazifa, saqlangan xarajat va o'chirish paytida telefon
  yengil tebranadi (haptics).

---

## 1. Kompyuterda ishga tushirish

Kerak bo'ladi: **Node.js 20 yoki undan yuqori** ([nodejs.org](https://nodejs.org)) va telefoningizda **Expo Go** ilovasi (Play Market / App Store'dan bepul).

```bash
npm install
npx expo start
```

Terminalda QR kod chiqadi:

- **Android** — Expo Go ilovasini ochib QR kodni skanerlang
- **iPhone** — Kamera ilovasi bilan QR kodni skanerlang

Telefon va kompyuter bir Wi-Fi tarmog'ida bo'lishi kerak. Boshqa tarmoqda bo'lsa: `npx expo start --tunnel`.

Kodni o'zgartirsangiz, ilova telefonda o'zi yangilanadi.

### Sifat nazorati

```bash
npm run check
```

Bitta buyruq to'rttasini ketma-ket bajaradi: TypeScript tiplari, ESLint, Prettier va testlar.
O'zgarish kiritgandan keyin shuni ishga tushirish odat bo'lsin — batafsili `CONTRIBUTING.md` da.

Alohida ishga tushirish: `npm run typecheck`, `npm run lint`, `npm test`, `npm run format`.

---

## 2. APK yig'ish (Android)

APK — telefonga to'g'ridan-to'g'ri o'rnatiladigan fayl. Android Studio kerak emas, hammasi bulutda quriladi.

**Bir marta:**

```bash
npm install -g eas-cli
eas login          # expo.dev'da bepul hisob ochasiz
eas init           # loyihani hisobingizga bog'laydi (app.json'ga projectId yozadi)
```

**Har safar:**

```bash
npm run build:apk
```

15–25 daqiqada havola beradi — telefondan o'sha havolani ochib APK'ni o'rnatasiz.
Android «nomalum manbadan o'rnatish» haqida ogohlantirsa, ruxsat berasiz.

## 3. Play Market uchun (AAB)

```bash
npm run build:play
```

Play Console AAB (`.aab`) formatini talab qiladi — shu buyruq aynan shuni chiqaradi.

## 4. iOS uchun

```bash
npm run build:ios
```

Mac kerak emas — bulutda quriladi. Lekin **Apple Developer** hisobi kerak (yiliga $99).
Hisob ochilgach `eas build` o'zi sertifikat va provisioning profilni yaratib beradi.

---

## Loyiha tuzilishi

```
App.tsx                  navigatsiya, shriftlar, ilova qobig'i
app.json                 ilova nomi, ikonka, splash, paket nomi
eas.json                 qurish profillari (apk / play / ios)
eslint.config.js         lint qoidalari
jest.setup.js            testlar uchun tayyorgarlik
.github/workflows/ci.yml har bir o'zgarishda avtomatik tekshiruv
assets/                  ikonka va splash rasmlari
store/                   do'kon uchun matnlar va maxfiylik siyosati
src/
  theme.ts               ranglar (yorug'/qorong'i), shriftlar, masshtab
  types.ts               ma'lumot tuzilmalari
  store.tsx              holat va telefon xotirasiga saqlash
  lib/
    date.ts              sana va oy hisob-kitobi, o'zbekcha nomlar
    money.ts             summa formatlash (1 250 000)
    catalog.ts           yo'nalishlar, vaqt bloklari, xarajat kategoriyalari
    backup.ts            zaxira / tiklash / CSV
  ui/
    kit.tsx              umumiy komponentlar (Card, Btn, Chip, Ring...)
    icons.tsx            SVG ikonkalar
  components/            TaskForm, TaskRow, Sheet, Welcome
  screens/               Kun, Hafta, Xarajat, Odatlar, Sozlama
  __tests__/             holat mantig'i testlari
  lib/__tests__/         sana va pul testlari
```

### Nimani qayerdan o'zgartirasiz

- **Ranglar** — `src/theme.ts` (`LIGHT` va `DARK` ob'ektlari)
- **Xarajat kategoriyalari** — `src/lib/catalog.ts` → `SPEND_CATS`, `INCOME_CATS`
- **Vaqt bloklari** — `src/lib/catalog.ts` → `BLOCKS`
- **Ilova nomi, ikonkasi, paket nomi** — `app.json`

---

## Ma'lumot va maxfiylik

Barcha yozuvlar telefonning o'z xotirasida (`AsyncStorage`) saqlanadi. Ilova hech qanday
serverga ma'lumot yubormaydi, internet ruxsati faqat Expo yangilanishlari uchun kerak.
Foydalanuvchi «Sozlama → Zaxira olish» orqali hamma narsani `.json` fayl qilib chiqarib olishi mumkin.

---

## Bilib qo'yish kerak

- Ilova hozircha **haqiqiy qurilmada sinalmagan**. Tekshirilgani: TypeScript, ESLint, Prettier,
  38 ta avtomatik test (sana, pul, holat mantig'i) va veb-ko'rinishdagi to'liq yo'l —
  birinchi ochilish, vazifa qo'shish, o'chirish va bekor qilish, xarajat yozish, byudjet qo'yish.
  Birinchi ish: Expo Go bilan telefonda ochib, har bir ekranni bosib ko'rish.
- Vaqt tanlash oynasi (`DateTimePicker`) Android va iOS'da har xil ko'rinadi — bu normal holat.
- Ilova hozir bitta tilda (o'zbekcha). Rus yoki ingliz tili keyingi bosqichda qo'shiladi.

---

## Sayt (`web/`)

Loyiha ichida ilovaning sayti ham bor: bosh sahifa, maxfiylik siyosati va qo'llab-quvvatlash
sahifasi. Play Market maxfiylik siyosati uchun internetdagi havolani talab qiladi — shu sayt
o'sha vazifani bajaradi.

Saytda «Chiqqanda xabar beraylikmi?» formasi bor: email Vercel funksiyasi orqali Neon
(Postgres) bazasiga yoziladi. Bu — saytning qismi, ilovaga aloqasi yo'q; ilova hamon hech
qanday ma'lumot yig'maydi.

```
web/
  index.html maxfiylik.html qollab.html   sahifalar
  style.css                               uslub (ilova ranglari bilan bir xil)
  img/                                    ekran rasmlari, ikonka, og:image
  api/waitlist.js                         kutish ro'yxati API'si
  api/_lib/validate.js                    tekshiruvlar (testlari bor)
  db/schema.sql                           Neon uchun jadval
  SETUP.md                                Vercel va Neon'ni ulash yo'riqnomasi
```

Mahalliy ko'rish: `web/` papkasida oddiy statik server yeterli, masalan
`npx serve web`. API funksiyasi faqat Vercel'da (yoki `vercel dev` bilan) ishlaydi.

Ishga tushirish bo'yicha qadamlar — `web/SETUP.md`.
Do'konga chiqish bo'yicha reja — `ROADMAP.md`.
