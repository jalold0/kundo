# Do'konga chiqish yo'l xaritasi

Kod tayyor bo'lgani — yo'lning yarmi. Qolgan yarmi: sinov, hisoblar, matnlar va do'kon talablari.
Quyida bosqichlar real ketma-ketlikda.

---

## 1-bosqich. Telefonda sinash (1–3 kun)

Hech qanday to'lov yoki hisob kerak emas.

- [ ] `npm install` va `npx expo start`, Expo Go bilan telefonda ochish
- [ ] Har bir ekranni bosib ko'rish: vazifa qo'shish, bajarish, tahrirlash, o'chirish
- [ ] Takrorlanuvchi vazifa qo'shib, ertaga ilovani qayta ochib tekshirish
- [ ] Xarajat yozish, byudjet qo'yish, oy almashtirish
- [ ] Zaxira olish va tiklashni sinash
- [ ] Yorug' va qorong'i rejimni almashtirib ko'rish
- [ ] Ilovani yopib-ochib, ma'lumot joyida turganini tekshirish

**Nima chiqishi mumkin:** vaqt tanlash oynasi Android'da boshqacha ko'rinadi, ba'zi matnlar
kichik ekranda sig'maydi. Shu bosqichda ro'yxat tuzib, keyin bir yo'la tuzatamiz.

## 2-bosqich. APK va yaqinlar sinovi (3–7 kun)

- [ ] `eas login`, `eas init`, `npm run build:apk`
- [ ] APK'ni 5–10 tanish odamga berish (oila, hamkasblar)
- [ ] Ular bir hafta ishlatsin — nima tushunarsiz bo'lganini yozib boring
- [ ] Eng ko'p takrorlangan 3 ta shikoyatni tuzatish

Bu bosqichni o'tkazib yubormang. Do'konga chiqqan ilovaning birinchi bahosi eng og'ir bo'ladi.

## 3-bosqich. Do'kon hisobi va matnlar (1–2 hafta)

### Google Play

- [ ] [play.google.com/console](https://play.google.com/console) — hisob ochish, **$25 bir marta**
- [ ] Shaxsni tasdiqlash: pasport/ID, manzil. Bir necha kun ketishi mumkin
- [ ] **Muhim:** shaxsiy (individual) hisoblar uchun Google ishlab chiquvchidan
      ishlab chiqarishga chiqishdan oldin **yopiq sinov** o'tkazishni talab qiladi —
      ma'lum sondagi sinovchi ma'lum kun davomida ilovani ishlatishi kerak.
      Aniq raqamlar vaqti-vaqti bilan o'zgaradi, shuning uchun Play Console'dagi
      «Ishlab chiqarishga kirish» bo'limidan **o'sha paytdagi talabni o'zingiz tekshiring**.
      Amalda bu: 12 ga yaqin odamni oldindan topib qo'yish kerak degani.
- [ ] `npm run build:play` → `.aab` faylni yuklash

### App Store

- [ ] [developer.apple.com](https://developer.apple.com) — **$99/yil**
- [ ] Apple ID va shaxsni tasdiqlash
- [ ] `npm run build:ios` → App Store Connect'ga yuklash
- [ ] Apple ko'rib chiqishi odatda 1–3 kun

### Ikkala do'kon uchun kerak bo'ladigan materiallar

| Nima                                             | Holati                                              |
| ------------------------------------------------ | --------------------------------------------------- |
| Ilova nomi (30 belgi)                            | `store/listing-uz.md` da tayyor                     |
| Qisqa tavsif (80 belgi)                          | tayyor                                              |
| To'liq tavsif (4000 belgi)                       | tayyor                                              |
| Ekran rasmlari (kamida 2 ta, telefon o'lchamida) | **siz olasiz** — ilovani telefonda ochib skrinshot  |
| Ikonka 512×512                                   | `assets/icon.png` dan tayyorlanadi                  |
| Play uchun banner 1024×500                       | **kerak**                                           |
| Maxfiylik siyosati (internetdagi havola)         | `store/privacy-uz.md` da matn tayyor, joylash kerak |
| Yosh reytingi so'rovnomasi                       | Play Console'da to'ldiriladi                        |
| Ma'lumot xavfsizligi formasi                     | oson — ilova hech narsa yig'maydi                   |

Maxfiylik siyosatini joylashning eng oson yo'li: GitHub Pages sahifasi
(oldin qilgan PWA papkangiz turgan joyga qo'shib qo'yish mumkin).

## 4-bosqich. Chiqarish va keyingi ishlar

- [ ] Play'da avval **yopiq sinov**, keyin ishlab chiqarish
- [ ] App Store'da TestFlight, keyin ko'rib chiqishga yuborish
- [ ] Birinchi hafta sharhlarni kuzatib borish

---

## Keyingi versiyalar uchun g'oyalar

Birinchi versiya ataylab sodda. Odamlar ishlatgandan keyin nima kerakligi ma'lum bo'ladi.
Ehtimoliy yo'nalishlar:

**Yaqin kelajak**

- Eslatma bildirishnomalari (vazifa vaqti kelganda)
- Rus va ingliz tillari
- Bosh ekran vidjeti (bugungi vazifalar / oylik xarajat)

**Keyinroq**

- Hisoblar: naqd / karta / dollar alohida
- Takrorlanuvchi to'lovlar (ijara, internet, obuna)
- Qarz berdim / qarz oldim
- Jamg'arma maqsadlari
- Bulutli sinxronizatsiya (bir nechta qurilma) — bu server va maxfiylik siyosatini
  jiddiy o'zgartiradi, shuning uchun faqat haqiqiy talab bo'lsa

**Pul topish yo'llari** (agar kerak bo'lsa)

- Ilova bepul, ba'zi qo'shimcha imkoniyatlar pullik (masalan bulut sinxronizatsiyasi)
- Bir martalik to'lov bilan «Pro» versiya
- Reklama — tavsiya qilmayman: bunday ilovada reklama ishonchni yo'qotadi

---

## Xarajatlar jamlanmasi

| Nima                        | Narxi                                                      |
| --------------------------- | ---------------------------------------------------------- |
| Google Play hisobi          | $25, bir marta                                             |
| Apple Developer             | $99, yiliga                                                |
| EAS Build (Expo)            | bepul rejada oyiga cheklangan qurish; keyin oyiga ~$19 dan |
| Maxfiylik siyosati sahifasi | bepul (GitHub Pages)                                       |
| **Birinchi yil, taxminan**  | **$125–350**                                               |

Faqat Android'dan boshlasangiz — birinchi xarajat $25.
