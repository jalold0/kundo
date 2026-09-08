# Sayt — holat va sozlash

Sayt **joylangan va ishlayapti**, uch tilda:

| Til     | Manzil                            |
| ------- | --------------------------------- |
| O'zbek  | <https://kundoapp.vercel.app>     |
| Русский | <https://kundoapp.vercel.app/ru/> |
| English | <https://kundoapp.vercel.app/en/> |

| Nima                                                                     | Holat             |
| ------------------------------------------------------------------------ | ----------------- |
| Kod GitLab'da (`gitlab.com/jalold0/kundo`)                               | ✅                |
| Vercel'ga joylangan (proyekt: `kundo`, jamoa: Sifat Nazorati's projects) | ✅                |
| Statik sahifalar uch tilda: bosh sahifa, maxfiylik, qo'llab-quvvatlash   | ✅                |
| Hammaga ochiq kirish                                                     | ✅                |
| Kutish ro'yxati formasi (`/api/waitlist`)                                | ⏳ baza ulanmagan |

`kundo.vercel.app` manzilini boshqa birov egallagan, shuning uchun asosiy manzil —
**`kundoapp.vercel.app`**. `kundo.uz` sotib olinsa, uni shu proyektga ulash mumkin
(Vercel → Project → Settings → Domains).

---

## 1. Sahifalarni tahrirlash

Sahifalar **qo'lda yozilmaydi** — ular `web/src/` dan yig'iladi:

```
src/site.json               barcha matn, uch tilda (menyu, sarlavha, bosh sahifa)
src/shell.html              umumiy qobiq: head, menyu, til almashtirgich, footer
src/page.index.html         bosh sahifa markupi, {{kalit}} o'rinbosarlari bilan
src/waitlist.js.html        kutish ro'yxati formasi skripti
src/doc.privacy.<til>.html  maxfiylik matni (uzun matn — til bo'yicha alohida)
src/doc.support.<til>.html  qo'llab-quvvatlash matni
```

O'zgartirgandan keyin yig'ib qo'yasiz:

```powershell
cd C:\Dev\kundo\web
npm run site
```

Bu to'qqizta faylni qaytadan yozadi: `index.html`, `maxfiylik.html`, `qollab.html`
va ularning `ru/`, `en/` nusxalari. Chiqqan fayllar omborga qo'shiladi — Vercel
ularni oddiy statik fayl sifatida beradi, qurish qadami yo'q.

> Skript nomi ataylab `build` emas. Vercel `build` nomli skriptni ko'rsa, uni
> deploy paytida o'zi ishga tushiradi va natijani `public/` papkasidan qidiradi —
> topmaydi va deploy yiqiladi. Bir marta shunday bo'ldi, shuning uchun nomi `site`.

> **Nega generator:** uchta sahifa × uchta til = to'qqizta fayl, qobig'i hammasida
> bir xil. Qo'lda saqlanganda ular albatta uzilib ketadi — ilgari sahifalarda
> `</body>` ikki marta yozilgani va boshqa sahifadan ishlamaydigan
> `#imkoniyatlar` havolalari shuning isboti edi.

Chiqqan `.html` fayllarni to'g'ridan-to'g'ri tahrirlamang: keyingi `npm run site`
o'zgarishni yo'q qiladi.

---

## 2. Kutish ro'yxatini ishga tushirish (Neon)

Bazasiz forma xato beradi. Tuzatish uchun:

1. [neon.com](https://neon.com) → **Sign up** → **Create project**:
   - Name: `kundo`
   - Region: **Europe (Frankfurt)** — O'zbekistonga eng yaqini
2. **SQL Editor** ga o'ting, `web/db/schema.sql` ichidagini nusxalab qo'ying va **Run**.
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

5. Qayta joylang — muhit o'zgaruvchisi faqat yangi deploydan keyin kuchga kiradi.

Server xatosining matni foydalanuvchiga ko'rsatilmaydi: javob o'zbekcha, shuning
uchun sahifa o'zining tarjima qilingan xabarini chiqaradi, serverning matni esa
brauzer konsoliga yoziladi.

---

## 3. Tekshirish

- Har uch tilda saytni ochib, til almashtirgichni bosib ko'ring: sahifa o'sha
  tildagi nusxaga o'tishi kerak, manzil `/ru/...` yoki `/en/...` bo'ladi.
- Pastdagi **«Chiqqanda xabar beraylikmi?»** formasiga emailingizni yozing.
  Yashil xabar chiqishi kerak; o'sha emailni yana yuborsangiz — «allaqachon
  ro'yxatdasiz».
- Neon → **Tables** → `waitlist` — yozuv ko'rinib turibdimi.

---

## 4. Play Market va App Store uchun havolalar

| Til | Maxfiylik siyosati   | Qo'llab-quvvatlash |
| --- | -------------------- | ------------------ |
| uz  | `/maxfiylik.html`    | `/qollab.html`     |
| ru  | `/ru/maxfiylik.html` | `/ru/qollab.html`  |
| en  | `/en/maxfiylik.html` | `/en/qollab.html`  |

Play Console maxfiylik siyosati uchun bitta manzil so'raydi — o'zbekchasini
qo'yasiz, sahifada esa til almashtirgich turadi. App Store Connect har lokal
uchun alohida manzil qabul qiladi, ya'ni yuqoridagi jadval to'liq ishlaydi.

Ilova ichidagi havolalar ham tilga qarab o'zi tanlanadi
(`SettingsScreen.tsx` dagi `sahifa()`).

---

## 5. Saytni qayta joylash

```powershell
cd C:\Dev\kundo\web
npm run site
vercel --prod
```

`kundoapp.vercel.app` loyihaga **domen** sifatida bog'langan, ya'ni har bir
production deploy'ga o'zi o'tadi. Ilgari u bitta deploy'ga qo'lda alias qilingan
edi va yangi deploy chiqqanda eski sahifalar ko'rinib turardi — `/ru/` va `/en/`
404 berdi. Shuning uchun alias emas, domen.

Proyekt Vercel'ga **CLI orqali** ulangan, git bilan emas — ya'ni `git push` o'zi
qayta joylamaydi. Avtomatik joylash kerak bo'lsa: Vercel → `kundo` → Settings →
Git → omborni ulang, **keyin o'sha yerda Root Directory'ni `web` qilib qo'ying**.
Root Directory `web` bo'lmasa, Vercel butun omborni (mobil ilovani ham) qurishga
urinadi va xato beradi.

---

## 6. Ro'yxatdagilarga xabar yuborish (ilova chiqqanda)

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
