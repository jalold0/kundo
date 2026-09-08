/* eslint-disable no-console -- buyruq satri skripti: chiqishi uning interfeysi */
/**
 * Saytni uch tilda yig'adi.
 *
 * Nega generator: uchta sahifa × uchta til = to'qqizta fayl, qobig'i (head,
 * menyu, footer) hammasida bir xil. Qo'lda saqlaganda ular albatta uzilib
 * ketadi — hozirgi sahifalarda `</body>` ikki marta yozilgani va boshqa
 * sahifadan ishlamaydigan `#imkoniyatlar` havolalari shuning isboti.
 *
 * Ishlatish: `npm run site` (yoki `node build.mjs`). Chiqqan fayllar omborga
 * qo'shiladi — Vercel ularni oddiy statik fayl sifatida beradi, qurish qadami yo'q.
 *
 * Manba:
 *   src/site.json          — barcha matn, tillar bo'yicha
 *   src/shell.html         — umumiy qobiq
 *   src/page.<nom>.html    — sahifa tanasi, {{kalit}} o'rinbosarlari bilan
 *   src/doc.<nom>.<til>.html — uzun matnli sahifalar (til bo'yicha alohida)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'src');
const ORIGIN = 'https://kundoapp.vercel.app';

const site = JSON.parse(readFileSync(join(SRC, 'site.json'), 'utf8'));
const shell = readFileSync(join(SRC, 'shell.html'), 'utf8');

const OG_LOCALE = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };
const LANG_LABEL = { uz: 'Til', ru: 'Язык', en: 'Language' };

/** Sahifalar: fayl nomi va matn kaliti. `doc` — uzun matnli sahifa. */
const PAGES = [
  { file: 'index.html', key: 'index', doc: false },
  { file: 'maxfiylik.html', key: 'privacy', doc: true },
  { file: 'qollab.html', key: 'support', doc: true },
];

/**
 * `{{kalit}}` larni almashtiradi. Noma'lum kalit **o'z holida qoladi** — ilgari
 * u bo'sh satrga aylanardi va ketma-ket ikki o'tishda `{{base}}` yo'q bo'lib
 * ketdi: rasm yo'llari `../img/` emas, `img/` bo'lib qolib, rus va ingliz
 * sahifalarida rasmlar ochilmadi. Qolgan o'rinbosarni build oxirida tekshiramiz.
 */
function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Til uchun yo'l: o'zbekcha ildizda, qolganlari o'z papkasida. */
const dirFor = (lang) => (lang === 'uz' ? '' : `${lang}/`);
const urlFor = (lang, file) => `${ORIGIN}/${dirFor(lang)}${file === 'index.html' ? '' : file}`;

function alternates(file) {
  const rows = site.langs.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${urlFor(l, file)}" />`,
  );
  rows.push(`    <link rel="alternate" hreflang="x-default" href="${urlFor('uz', file)}" />`);
  return rows.join('\n');
}

function langLinks(lang, file) {
  return site.langs
    .map((l) => {
      const cls = l === lang ? ' class="on"' : '';
      const href = `/${dirFor(l)}${file === 'index.html' ? '' : file}`;
      const aria = l === lang ? ' aria-current="true"' : '';
      return `          <a${cls}${aria} hreflang="${l}" href="${href}">${l.toUpperCase()}</a>`;
    })
    .join('\n');
}

function navLinks(lang, isIndex) {
  const n = site[lang].nav;
  // Boshqa sahifalarda langar havolalari bosh sahifaga qaytadi, aks holda
  // ular hech qayerga olib bormaydi.
  const prefix = isIndex ? '' : `/${dirFor(lang)}`;
  return [
    `          <a href="${prefix}#imkoniyatlar" class="hide-sm">${n.features}</a>`,
    `          <a href="${prefix}#ekranlar" class="hide-sm">${n.shots}</a>`,
    `          <a href="${prefix}#xabar" class="hide-sm">${n.waitlist}</a>`,
  ].join('\n');
}

let written = 0;
for (const lang of site.langs) {
  const L = site[lang];
  for (const page of PAGES) {
    const text = L[page.key];
    const bodyFile = page.doc
      ? join(SRC, `doc.${page.key}.${lang}.html`)
      : join(SRC, `page.${page.key}.html`);
    if (!existsSync(bodyFile)) {
      console.error(`YO'Q: ${bodyFile}`);
      process.exitCode = 1;
      continue;
    }

    // Barcha o'zgaruvchi bitta to'plamda: tana ham, qobiq ham shundan to'ldiriladi.
    // Ketma-ket ikki o'tish qilmaymiz — aynan shu narsa `{{base}}` ni yo'q qilgan edi.
    const vars = {
      ...L,
      ...text,
      htmlLang: L.htmlLang,
      base: lang === 'uz' ? '' : '../',
      langDir: lang,
      home: `/${dirFor(lang)}`,
      canonical: urlFor(lang, page.file),
      origin: ORIGIN,
      ogDesc: text.ogDesc ?? text.desc,
      ogLocale: OG_LOCALE[lang],
      alternates: alternates(page.file),
      langLabel: LANG_LABEL[lang],
      langLinks: langLinks(lang, page.file),
      navLinks: navLinks(lang, page.key === 'index'),
      navPrivacy: L.nav.privacy,
      navSupport: L.nav.support,
      footPrivacy: L.footer.privacy,
      footSupport: L.footer.support,
      footContact: L.footer.contact,
      email: site.email,
    };

    const rawBody = readFileSync(bodyFile, 'utf8');
    const rawScripts = page.key === 'index' ? readFileSync(join(SRC, 'waitlist.js.html'), 'utf8') : '';

    const html = fill(shell, {
      ...vars,
      body: fill(rawBody, vars),
      scripts: fill(rawScripts, vars),
    });

    // To'ldirilmagan o'rinbosar qolsa, build yiqiladi: bunday xato jimgina
    // sahifaga chiqib ketmasligi kerak.
    const left = [...html.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
    if (left.length) {
      console.error(`${dirFor(lang)}${page.file}: to'ldirilmagan kalit — ${[...new Set(left)].join(', ')}`);
      process.exitCode = 1;
    }

    const outDir = join(HERE, dirFor(lang));
    if (dirFor(lang)) mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, page.file), html, 'utf8');
    written++;
  }
}

console.log(`${written} sahifa yig'ildi (${site.langs.join(', ')}).`);
