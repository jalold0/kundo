# Saytni ishga tushirish — Vercel va Neon

Sayt tayyor. Qolgani — uni internetga chiqarish va bazani ulash.
Hammasi bepul rejada ishlaydi. Taxminan 15 daqiqa.

Tartib muhim: **GitHub → Neon → Vercel**. Vercel bazaning manzilini so'raydi, shuning uchun Neon oldin.

---

## 1. Kodni GitHub'ga yuklash

Ombor allaqachon yaratilgan: `gitlab.com/jalold0/kundo`

```powershell
cd C:\Dev\kundo
git push -u origin main
```

Birinchi marta brauzerda GitHub'ga kirishni so'raydi — ruxsat berasiz.

---

## 2. Neon — ma'lumotlar bazasi

1. [neon.com](https://neon.com) → **Sign up** → GitHub bilan kiring (alohida parol kerak emas).
2. **Create project**:
   - Name: `kundo`
   - Postgres version: eng oxirgisi (o'zi tanlab qo'yadi)
   - Region: **Europe (Frankfurt)** — O'zbekistonga eng yaqini
3. Loyiha ochilgach chapdagi **SQL Editor** ga o'ting.
4. Shu loyihadagi `web/db/schema.sql` faylini oching, ichidagi hammasini nusxalab
   SQL Editor'ga qo'ying va **Run** bosing.
   «Success» chiqsa — jadval tayyor.
5. **Connection string** ni oling: chapdagi **Dashboard** → **Connect** tugmasi →
   ochilgan oynadan **Connection string** ni nusxalang. U shunday ko'rinadi:

   ```
   postgresql://neondb_owner:XXXXXXXX@ep-nimadir-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   > Bu satr — parolning o'zi. Uni hech kimga bermang, chatga ham tashlamang,
   > kod ichiga ham yozmang. Faqat Vercel sozlamasiga qo'yiladi.

---

## 3. Vercel — saytni chiqarish

1. [vercel.com](https://vercel.com) → **Continue with GitHub** bilan kiring.
2. **Add New → Project** → ro'yxatdan `kundo` ni toping → **Import**.
3. Sozlamalar (eng muhim joyi):

   | Maydon             | Qiymat                                |
   | ------------------ | ------------------------------------- |
   | Framework Preset   | **Other**                             |
   | **Root Directory** | **`web`** ← buni albatta o'zgartiring |
   | Build Command      | bo'sh qoldiring                       |
   | Output Directory   | bo'sh qoldiring                       |
   | Install Command    | bo'sh qoldiring (o'zi topadi)         |

   Root Directory'ni `web` qilmasangiz, Vercel butun loyihani (mobil ilovani ham)
   deploy qilishga urinadi va xato beradi.

4. **Environment Variables** bo'limida bittasini qo'shing:

   | Name           | Value                                 |
   | -------------- | ------------------------------------- |
   | `DATABASE_URL` | Neon'dan nusxalagan connection string |

   Uchala muhit (Production, Preview, Development) uchun ham belgilangan bo'lsin.

5. **Deploy** bosing. 1–2 daqiqada sayt tayyor:
   `https://kundo.vercel.app`

---

## 4. Tekshirish

- Saytni oching, pastdagi **«Chiqqanda xabar beraylikmi?»** formasiga o'z emailingizni yozing.
  «Bo'ldi!» degan yashil xabar chiqishi kerak.
- O'sha emailni yana bir marta yuboring — bu safar «Siz allaqachon ro'yxatdasiz» chiqadi.
- Neon → **Tables** → `waitlist` — yozuv ko'rinib turibdimi.

Agar «Server sozlanmagan» degan xato chiqsa — `DATABASE_URL` qo'shilmagan yoki noto'g'ri.
Vercel → Project → Settings → Environment Variables dan tekshiring, keyin
**Deployments → oxirgisi → Redeploy**.

---

## 5. Play Market uchun kerak bo'ladigan havolalar

Deploy bo'lgach shu ikkitasi tayyor bo'ladi — Play Console shularni so'raydi:

- Maxfiylik siyosati: `https://kundo.vercel.app/maxfiylik.html`
- Qo'llab-quvvatlash: `https://kundo.vercel.app/qollab.html`

---

## Keyingi o'zgarishlar

`web/` ichidagi biror faylni o'zgartirib GitHub'ga yuborsangiz, Vercel o'zi qayta deploy qiladi:

```powershell
git add -A
git commit -m "sayt matni yangilandi"
git push
```

## Ro'yxatdagilarga xabar yuborish (ilova chiqqanda)

Neon SQL Editor'da:

```sql
-- Kimlarga yuborish kerak
SELECT email, name FROM waitlist WHERE notified_at IS NULL ORDER BY created_at;

-- Yuborib bo'lgach belgilab qo'ying
UPDATE waitlist SET notified_at = now() WHERE notified_at IS NULL;
```

Xat yuborish uchun alohida xizmat kerak bo'ladi (masalan Resend yoki oddiy pochta mijozi —
ro'yxat kichik bo'lsa, qo'lda ham bo'ladi).

---

## Xarajat

| Xizmat | Bepul reja                                                        |
| ------ | ----------------------------------------------------------------- |
| GitHub | public ombor — cheklovsiz                                         |
| Vercel | shaxsiy loyihalar uchun bepul                                     |
| Neon   | bepul rejada bitta loyiha, 0.5 GB — bu ro'yxat uchun juda yetarli |
