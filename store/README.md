# Do'kon materiallari

| Fayl                     | Nima uchun                                             | Talab                                                       |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- |
| `listing-uz.md`          | Do'kon matnlari, `uz-UZ`                               | Play Console, App Store Connect                             |
| `listing-ru.md`          | Do'kon matnlari, `ru-RU`                               | Play Console, App Store Connect                             |
| `listing-en.md`          | Do'kon matnlari, `en-US`                               | Play Console, App Store Connect                             |
| `banner-1024x500.png`    | Play «Feature graphic»                                 | 1024×500, shaffofliksiz                                     |
| `icon-512-play.png`      | Play ilova ikonkasi                                    | 512×512                                                     |
| `icon-1024-appstore.png` | App Store ikonkasi                                     | 1024×1024, **alfa kanalsiz** — Apple shaffoflikni rad etadi |
| `banner.html`            | Bannerning manbasi                                     | quyida qarang                                               |
| `mark.png`               | `assets/adaptive-icon.png` dan chekkasi kesilgan belgi | faqat banner uchun                                          |
| `shots/<til>/*.png`      | Ekran rasmlari, uch tilda                              | 1170×2532 — quyida qarang                                   |

**Maxfiylik siyosati** bu papkada emas — u saytda yashaydi va do'kon aynan
o'sha havolani so'raydi: <https://kundoapp.vercel.app/maxfiylik.html>
(manbasi `web/maxfiylik.html`). Ilgari bu yerda `privacy-uz.md` nusxasi bor
edi; ikkita nusxa bir-biridan uzilib ketishi aniq bo'lgani uchun olib tashlandi.

## Ekran rasmlari

`shots/uz`, `shots/ru`, `shots/en` — har birida to'rtta rasm, **1170×2532px**:
kun rejasi, xarajat, odatlar, hafta. Ular skript bilan olinadi:

```powershell
# birinchi terminalda
cd C:\Dev\kundo
npm run web

# ikkinchi terminalda
cd C:\Dev\kundo
npm run shots
```

Skript Chrome'ni DevTools protokoli orqali boshqaradi: telefon o'lchamini
(390×844, 3x aniqlik) qo'yadi, har til uchun namunaviy ma'lumotni joylaydi va
to'rt ekranni suratga oladi. UI o'zgarganda buyruqni qaytadan ishlatasiz —
rasmlar eskirib qolmaydi va uch tilda bir xil ma'lumot ko'rinadi.

Namunaviy ma'lumot skript ichida (`scripts/shots.mjs` → `DEMO`): bo'sh ekran
ilovani tayyor emasdek ko'rsatadi, shuning uchun bir haftalik real ko'rinishdagi
vazifa, odat va xarajat qo'yilgan.

Shu rasmlar saytga ham ketadi: `web/img/<til>/` ichiga 620px kenglikda
kichraytirilgan nusxalari qo'yiladi (`npm run site` ni ishlatishdan oldin
kichraytirish qo'lda qilinadi — hozircha bir marta bajarilgan).

> Bu rasmlar **web build**dan olingan: kod bir xil, shrift va ranglar ham bir xil,
> lekin telefonning tepa qatori (soat, batareya) va tizim burchaklari yo'q.
> Do'kon buni talab qilmaydi. Xohlasangiz, keyinchalik haqiqiy qurilmadan olingan
> nusxalar bilan almashtirasiz — o'lcham va tartib bir xil bo'lganicha, listing
> o'zgarmaydi.

## Tilga bog'liq bo'lmagan narsalar

### Kategoriya

- Play Market: **Productivity** (ikkilamchi: Finance)
- App Store: **Productivity**

### Yosh reytingi

3+ / 4+ — ilovada reklama, xarid va tashqi kontent yo'q.

### Ma'lumot xavfsizligi formasi (Play Console)

Barcha savollarga javob bir xil:

- Ma'lumot yig'iladimi? — **Yo'q**
- Ma'lumot uchinchi tomonga ulashiladimi? — **Yo'q**
- Ma'lumot shifrlanadimi? — telefonning o'z himoyasi
- Foydalanuvchi ma'lumotni o'chira oladimi? — **Ha**, Sozlama bo'limidan

Bildirishnoma ruxsati (`POST_NOTIFICATIONS`) ma'lumot yig'ish emas — u faqat
qurilmaning o'zida eslatma ko'rsatish uchun.

### Ekran rasmlari — tavsiya etilgan ketma-ketlik

Birinchi ikkitasi eng muhim, ko'pchilik shundan nariga qaramaydi:

1. **Kun rejasi** — 5–6 ta haqiqiy vazifa, ba'zilari bajarilgan, odatlar bloki ko'rinib turgan
2. **Xarajat** — byudjet chizig'i va yo'nalishlar taqsimoti bilan
3. **Odatlar** — oylik dinamika chizig'i to'ldirilgan holda
4. **Hafta** — bir necha kun to'ldirilgan
5. (ixtiyoriy) Qorong'i rejimda kun rejasi

Skrinshot olishdan oldin ilovaga bir haftalik real ma'lumot kiritib qo'ying —
bo'sh ekranlar ilovani tayyor emasdek ko'rsatadi. Har til uchun alohida
skrinshot to'plami kerak: tildan tilga o'tib, o'sha tilda suratga olasiz.

## Bannerni qayta chizish

Matn yoki rang o'zgarsa, `banner.html` ni tahrirlab qayta suratga olasiz:

```powershell
cd C:\Dev\kundo\store
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
  --hide-scrollbars --force-device-scale-factor=1 --window-size=1024,500 `
  --virtual-time-budget=20000 --screenshot=banner-1024x500.png `
  "file:///C:/Dev/kundo/store/banner.html"
```

Shriftlar (Jost, Karla) Google Fonts'dan yuklanadi — internet kerak.
Ranglar ilovaning ikonkasidan: `#1D3F91` ko'k, `#FCFAF6` oq, `#0F7A80` yashil.

Rus va ingliz tili uchun banner ham kerak: `banner.html` dan nusxa olib matnini
o'zgartiring (`banner-ru.html`, `banner-en.html`) va har biri uchun alohida
rasm chiqaring.
