# Do'kon materiallari

| Fayl                     | Nima uchun                                             | Talab                                                       |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- |
| `listing-uz.md`          | Ilova nomi, qisqa va to'liq tavsif                     | Play Console, App Store Connect                             |
| `privacy-uz.md`          | Maxfiylik siyosati matni                               | Saytda ham turibdi: kundoapp.vercel.app/maxfiylik.html      |
| `banner-1024x500.png`    | Play «Feature graphic»                                 | 1024×500, shaffofliksiz                                     |
| `icon-512-play.png`      | Play ilova ikonkasi                                    | 512×512                                                     |
| `icon-1024-appstore.png` | App Store ikonkasi                                     | 1024×1024, **alfa kanalsiz** — Apple shaffoflikni rad etadi |
| `banner.html`            | Bannerning manbasi                                     | quyida qarang                                               |
| `mark.png`               | `assets/adaptive-icon.png` dan chekkasi kesilgan belgi | faqat banner uchun                                          |

Ekran rasmlari (kamida 2 ta, telefon o'lchamida) hali kerak — ularni telefondan
olasiz, `SINOV.md` dagi ro'yxat bo'yicha yurib.

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

Ingliz yoki rus tili qo'shilganda: `banner.html` dan nusxa olib matnini o'zgartiring
(`banner-en.html`), har til uchun alohida rasm kerak bo'ladi.
