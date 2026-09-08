/**
 * Saytni uch tilda yig'adi.
 *
 * Nega generator: uchta sahifa × uchta til = to'qqizta fayl, qobig'i (head,
 * menyu, footer) hammasida bir xil. Qo'lda saqlaganda ular albatta uzilib
 * ketadi — hozirgi sahifalarda `</body>` ikki marta yozilgani va boshqa
 * sahifadan ishlamaydigan `#imkoniyatlar` havolalari shuning isboti.
 *
 * Ishlatish: `npm run build` (yoki `node build.mjs`). Chiqqan fayllar omborga
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

/** `{{kalit}}` larni almashtiradi; qolgani bo'sh satrga aylanadi. */
function fill(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? String(vars[k]) : ''));
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
      const href = `${ORIGIN.length ? '' : ''}/${dirFor(l)}${file === 'index.html' ? '' : file}`;
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

    // Sahifa tanasi: uzun matnli sahifalarda tana o'zi tarjima qilingan,
    // qolganlarida umumiy markup + shu tildagi matn.
    const rawBody = readFileSync(bodyFile, 'utf8');
    const body = page.doc ? fill(rawBody, { ...L, ...text, email: site.email }) : fill(rawBody, text);

    const scripts = page.key === 'index' ? readFileSync(join(SRC, 'waitlist.js.html'), 'utf8') : '';

    const html = fill(shell, {
      htmlLang: L.htmlLang,
      title: text.title,
      desc: text.desc,
      ogDesc: text.ogDesc ?? text.desc,
      base: lang === 'uz' ? '' : '../',
      home: `/${dirFor(lang)}`,
      canonical: urlFor(lang, page.file),
      origin: ORIGIN,
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
      body: fill(body, { base: lang === 'uz' ? '' : '../', email: site.email }),
      scripts: fill(scripts, text),
    });

    const outDir = join(HERE, dirFor(lang));
    if (dirFor(lang)) mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, page.file), html, 'utf8');
    written++;
  }
}

console.log(`${written} sahifa yig'ildi (${site.langs.join(', ')}).`);
