# Telefonda sinab ko'rish — Expo Go

Ilovani APK qilmasdan, to'g'ridan-to'g'ri telefonda ochib ko'rish mumkin.
Kompyuterda dev-server ishlaydi, telefon unga Wi-Fi orqali ulanadi.
Kodni o'zgartirsangiz — telefonda bir soniyada yangilanadi.

Bir marta sozlanadi, keyin har safar bitta buyruq.

---

## 1. Kompyuterda (bir marta)

**Node.js** kerak. Bormi-yo'qmi tekshirish:

```powershell
node -v
```

Agar xato bersa yoki 20 dan kichik raqam chiqsa — [nodejs.org](https://nodejs.org) dan **LTS**
versiyasini o'rnating, keyin PowerShell'ni yopib qayta oching.

Paketlarni o'rnatish (3–5 daqiqa, internet kerak):

```powershell
cd C:\Dev\kun-tartibi
npm install
```

---

## 2. Telefonda (bir marta)

**Expo Go** ilovasini o'rnating:

- Android: Play Market → «Expo Go»
- iPhone: App Store → «Expo Go»

Telefon va kompyuter **bitta Wi-Fi** da bo'lishi shart.

---

## 3. Har safar ishga tushirish

```powershell
cd C:\Dev\kun-tartibi
npx expo start
```

Terminalda QR kod chiqadi.

- **Android:** Expo Go ni oching → «Scan QR code» → QR ni skanerlang.
- **iPhone:** oddiy **Kamera** ilovasi bilan QR ga qarating → chiqqan havolani bosing.

Birinchi ochilish 20–40 soniya (bundle yig'iladi), keyingilari tez.

To'xtatish: terminalda `Ctrl + C`.

---

## Ishlatish paytida foydali

| Nima                | Qanday                                             |
| ------------------- | -------------------------------------------------- |
| Qayta yuklash       | terminalda `r` bosing                              |
| Dev menyu           | telefonni **silkiting** (yoki uch barmoq bilan bosing) |
| Kompyuter brauzerda | terminalda `w` bosing                              |
| Loglarni ko'rish    | terminal oynasining o'zida chiqadi                 |

---

## Agar ulanmasa

**QR skanerlandi, lekin «Something went wrong» yoki cheksiz kutish:**

Wi-Fi bir xil emas yoki router qurilmalar orasidagi aloqani to'sib qo'ygan
(mehmonxona, ofis, «Guest» tarmoqlari ko'pincha shunday). Tunnel rejimida ishlating —
u internet orqali aylanib o'tadi, sekinroq, lekin har doim ishlaydi:

```powershell
npx expo start --tunnel
```

Birinchi marta qo'shimcha paketni o'rnatishga ruxsat so'raydi — `y` bosing.

**«Project is incompatible with this version of Expo Go»:**

Play Market / App Store'dan Expo Go ni yangilang. Loyiha SDK 57 da.

**Windows Firewall so'rasa** — «Allow access» bosing, aks holda telefon ulana olmaydi.

**`npm install` xato bersa** — antivirus yoki `C:\Dev` ga yozish huquqi to'sayotgan bo'lishi
mumkin. PowerShell'ni «Run as administrator» bilan oching.

---

## Nimalarni sinab ko'ring

Bu ro'yxat — ilovaning asosiy yo'llari. Har birini bir marta bosib chiqsangiz,
buzilgan joy bormi-yo'qmi bilinadi.

**Kun**

- [ ] Birinchi ochilishda salomlashuv oynasi chiqadimi, «boshlang'ich odatlar» qo'shiladimi
- [ ] Pastdagi qatorga vazifa yozib qo'shish
- [ ] `+` tugmasi orqali kategoriya va takror bilan qo'shish
- [ ] Vazifani bajarilgan qilib belgilash (belgilangach pastga tushadimi)
- [ ] O'chirish → pastda «Qaytarish» chiqadi → bosing, qaytadimi
- [ ] Kechagi bajarilmagan vazifa «kechikkan» bo'lib ko'rinadimi

**Xarajat**

- [ ] Xarajat qo'shish, kategoriya tanlash
- [ ] Kirim qo'shish
- [ ] Oylik byudjet belgilash → chiziq to'ladimi, oshib ketsa rangi o'zgaradimi
- [ ] Oyni orqaga/oldinga surish
- [ ] Kunlik grafik va kategoriya bo'yicha taqsimot to'g'rimi
- [ ] Sanani o'zgartirib, o'tgan kunga xarajat yozish

**Odatlar**

- [ ] Odat qo'shish, kunini belgilash
- [ ] Ketma-ketlik (streak) raqami oshadimi
- [ ] Haftalik ko'rinish

**Sozlamalar**

- [ ] Yorug'/qorong'i/tizim rejimi — uchalasi ham to'g'ri ko'rinadimi
- [ ] Ma'lumotni faylga chiqarish (eksport)
- [ ] O'sha faylni qaytadan yuklash (import) — yozuvlar joyidami

**Eng muhimi**

- [ ] Ilovani **butunlay yopib** (ro'yxatdan ham surib tashlang) qaytadan oching —
      hamma yozuvlaringiz joyidami. Bu saqlash tizimi ishlayotganining isboti.

Biror joyda xato ko'rsangiz — ekran rasmini oling va terminaldagi qizil matnni
nusxalab yuboring, tuzataman.
