# Sayt — holat va sozlash

Sayt **joylangan va ishlayapti**: <https://kundoapp.vercel.app>

| Nima                                                                     | Holat                                       |
| ------------------------------------------------------------------------ | ------------------------------------------- |
| Kod GitLab'da (`gitlab.com/jalold0/kundo`)                               | ✅                                          |
| Vercel'ga joylangan (proyekt: `kundo`, jamoa: Sifat Nazorati's projects) | ✅                                          |
| Statik sahifalar: bosh sahifa, maxfiylik, qo'llab-quvvatlash             | ✅                                          |
| Kutish ro'yxati formasi (`/api/waitlist`)                                | ⏳ baza ulanmagan                           |
| Hammaga ochiq kirish                                                     | ⏳ Vercel Authentication o'chirilishi kerak |

> **Diqqat:** yangi proyektda Vercel «Deployment Protection → Vercel Authentication»
> ni o'zi yoqib qo'yadi va `*.vercel.app` manzillari Vercel'ga kirishni talab qiladi
> (302 → sso-api). Play Console maxfiylik siyosatini anonim ocholmaydi, shuning uchun
> uni o'chirish shart:
>
> Vercel → `kundo` → Settings → Deployment Protection → Vercel Authentication →
> **Disabled** → Save. Terminaldan: `vercel project protection disable kundo --sso`.

`kundo.vercel.app` manzilini boshqa birov egallagan, shuning uchun asosiy manzil —
**`kundoapp.vercel.app`**. `kundo.uz` sotib olinsa, uni shu proyektga ulash mumkin
(Vercel → Project → Settings → Domains).

---

## 1. Kutish ro'yxatini ishga tushirish (Neon)

Bazasiz forma «Server sozlanmagan» deb xato beradi. Tuzatish uchun:

1. [neon.com](https://neon.com) → **Sign up** → **Create project**:
   - Name: `kundo`
   - Region: **Europe (Frankfurt)** — O'zbekistonga eng yaqini
2. **SQL Editor** ga o'ting, `web/db/schema.sql` ichidagini nusxalab qo'ying va **Run**.
   «Success» chiqsa — jadval tayyor.
3. **Dashboard → Connect** → **Connection string** ni nusxalang:

   ```
   postgresql://neondb_owner:XXXXXXXX@ep-nimadir-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   > Bu satr — parolning o'zi. Uni hech kimga bermang, chatga ham tashlamang,
   > kod ichiga ham yozmang. Faqat Vercel sozlamasiga qo'yiladi.

4. Vercel'ga qo'shing — ikki yo'ldan biri:

   **Brauzerdan:** Vercel → `kundo` → Settings → Environment Variables →
   Name `DATABASE_URL`, qiymati o'sha satr; Production, Preview va Development
   uchun ham belgilangan bo'lsin.

   **Terminaldan:**

   ```powershell
   cd C:\Dev\kundo\web
   vercel env add DATABASE_URL production
   ```

5. Qayta joylang — muhit o'zgaruvchisi faqat yangi deploydan keyin kuchga kiradi:

   ```powershell
   cd C:\Dev\kundo\web
   vercel --prod
   ```

---

## 2. Tekshirish

- Saytni oching, pastdagi **«Chiqqanda xabar beraylikmi?»** formasiga emailingizni yozing.
  «Bo'ldi!» degan yashil xabar chiqishi kerak.
- O'sha emailni yana yuboring — bu safar «Siz allaqachon ro'yxatdasiz» chiqadi.
- Neon → **Tables** → `waitlist` — yozuv ko'rinib turibdimi.

Agar «Server sozlanmagan» chiqsa — `DATABASE_URL` qo'shilmagan yoki deploy yangilanmagan.

---

## 3. Play Market uchun havolalar

Play Console shu ikkitasini so'raydi, ikkalasi ham hozir ishlayapti:

- Maxfiylik siyosati: <https://kundoapp.vercel.app/maxfiylik.html>
- Qo'llab-quvvatlash: <https://kundoapp.vercel.app/qollab.html>

---

## 4. Saytni yangilash

Proyekt Vercel'ga **CLI orqali** ulangan, git bilan emas — ya'ni `git push` o'zi
qayta joylamaydi. `web/` ichida biror narsa o'zgartirsangiz:

```powershell
cd C:\Dev\kundo\web
vercel --prod
```

Avtomatik joylash kerak bo'lsa (har `git push` da o'zi deploy bo'lsin), GitLab'ni ulash
mumkin: Vercel → `kundo` → Settings → Git → omborni ulang, **keyin o'sha yerda Root
Directory'ni `web` qilib qo'ying**. Root Directory `web` bo'lmasa, Vercel butun omborni
(mobil ilovani ham) qurishga urinadi va xato beradi.

---

## 5. Ro'yxatdagilarga xabar yuborish (ilova chiqqanda)

Neon SQL Editor'da:

```sql
-- Kimlarga yuborish kerak
SELECT email, name FROM waitlist WHERE notified_at IS NULL ORDER BY created_at;

-- Yuborib bo'lgach belgilab qo'ying
UPDATE waitlist SET notified_at = now() WHERE notified_at IS NULL;
```

Xat yuborish uchun alohida xizmat kerak bo'ladi (masalan Resend yoki oddiy pochta
mijozi — ro'yxat kichik bo'lsa, qo'lda ham bo'ladi).

---

## Xarajat

| Xizmat | Bepul reja                                                        |
| ------ | ----------------------------------------------------------------- |
| GitLab | private ombor — cheklovsiz                                        |
| Vercel | shaxsiy loyihalar uchun bepul                                     |
| Neon   | bepul rejada bitta loyiha, 0.5 GB — bu ro'yxat uchun juda yetarli |
