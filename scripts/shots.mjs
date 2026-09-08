/* eslint-disable no-console -- buyruq satri skripti: chiqishi uning interfeysi */

/**
 * Do'kon va sayt uchun ekran rasmlarini oladi — uch tilda, telefon o'lchamida.
 *
 * Nega qo'lda emas: har til uchun to'rt ekran, jami o'n ikki rasm, va har UI
 * o'zgarishida qaytadan olish kerak. Qo'lda olinganda ular tez orada eskiradi
 * va tillar orasida bir xil ma'lumot bo'lmaydi.
 *
 * Nega brauzer paneli emas: u ~1,25x aniqlikda beradi (469px), do'kon uchun bu
 * xira. Bu skript Chrome'ni DevTools protokoli orqali boshqaradi va
 * `deviceScaleFactor: 3` bilan 1170×2532 chiqaradi.
 *
 * Talab: Expo web serveri ishlab turishi kerak —
 *   cd C:\Dev\kundo && npm run web
 * keyin boshqa terminalda:
 *   node scripts/shots.mjs
 *
 * Natija: store/shots/<til>/<tartib>-<ekran>.png
 */

import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'store', 'shots');
const APP = 'http://localhost:8081';
const PORT = 9333;

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));

/** Telefon o'lchami: Pixel 7 mantiqiy o'lchami, 3x aniqlik → 1170×2532. */
const VIEW = { width: 390, height: 844, scale: 3 };

/** Ekranlar: menyu yorlig'i har tilda boshqacha, shuning uchun til bo'yicha. */
const SCREENS = {
  uz: [
    ['kun', 'Kun'],
    ['xarajat', 'Xarajat'],
    ['odatlar', 'Odatlar'],
    ['hafta', 'Hafta'],
  ],
  ru: [
    ['kun', 'День'],
    ['xarajat', 'Расходы'],
    ['odatlar', 'Привычки'],
    ['hafta', 'Неделя'],
  ],
  en: [
    ['kun', 'Day'],
    ['xarajat', 'Money'],
    ['odatlar', 'Habits'],
    ['hafta', 'Week'],
  ],
};

/** Namunaviy ma'lumot: bo'sh ekran ilovani tayyor emasdek ko'rsatadi. */
const DEMO = {
  uz: {
    tasks: [
      ['Bannerni Play Console\u2018ga yuklash', 'ish', 1, 'kunduzi', '14:00', false],
      ['Yopiq sinovchilarga yozish', 'ish', 2, 'ertalab', '09:30', true],
      ['Bozordan non va sut', 'shaxsiy', 3, 'kechqurun', '', false],
      ['Kitob \u2014 30 daqiqa', 'shaxsiy', 3, 'kechqurun', '21:00', false],
      ['Ingliz tili darsi', 'oqish', 2, 'ertalab', '08:00', true],
    ],
    habits: ['Sport / mashq', 'Kitob o\u2018qish (30 daqiqa)', 'Suv \u2014 2 litr'],
    entries: [
      ['chiqim', 1_850_000, 'uy', 'Ijara'],
      ['chiqim', 240_000, 'oziq', 'Bozor'],
      ['chiqim', 60_000, 'transport', ''],
      ['chiqim', 145_000, 'aloqa', 'Internet'],
      ['kirim', 6_500_000, 'maosh', ''],
    ],
    budget: 5_000_000,
  },
  ru: {
    tasks: [
      [
        '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0431\u0430\u043d\u043d\u0435\u0440 \u0432 Play Console',
        'ish',
        1,
        'kunduzi',
        '14:00',
        false,
      ],
      [
        '\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0449\u0438\u043a\u0430\u043c',
        'ish',
        2,
        'ertalab',
        '09:30',
        true,
      ],
      [
        '\u041a\u0443\u043f\u0438\u0442\u044c \u0445\u043b\u0435\u0431 \u0438 \u043c\u043e\u043b\u043e\u043a\u043e',
        'shaxsiy',
        3,
        'kechqurun',
        '',
        false,
      ],
      [
        '\u0427\u0442\u0435\u043d\u0438\u0435 \u2014 30 \u043c\u0438\u043d\u0443\u0442',
        'shaxsiy',
        3,
        'kechqurun',
        '21:00',
        false,
      ],
      [
        '\u0423\u0440\u043e\u043a \u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u043e\u0433\u043e',
        'oqish',
        2,
        'ertalab',
        '08:00',
        true,
      ],
    ],
    habits: [
      '\u0421\u043f\u043e\u0440\u0442 / \u0437\u0430\u0440\u044f\u0434\u043a\u0430',
      '\u0427\u0442\u0435\u043d\u0438\u0435 (30 \u043c\u0438\u043d\u0443\u0442)',
      '\u0412\u043e\u0434\u0430 \u2014 2 \u043b\u0438\u0442\u0440\u0430',
    ],
    entries: [
      ['chiqim', 1_850_000, 'uy', '\u0410\u0440\u0435\u043d\u0434\u0430'],
      ['chiqim', 240_000, 'oziq', '\u0420\u044b\u043d\u043e\u043a'],
      ['chiqim', 60_000, 'transport', ''],
      ['chiqim', 145_000, 'aloqa', '\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442'],
      ['kirim', 6_500_000, 'maosh', ''],
    ],
    budget: 5_000_000,
  },
  en: {
    tasks: [
      ['Upload the Play Console banner', 'ish', 1, 'kunduzi', '14:00', false],
      ['Write to the closed testers', 'ish', 2, 'ertalab', '09:30', true],
      ['Bread and milk from the market', 'shaxsiy', 3, 'kechqurun', '', false],
      ['Reading \u2014 30 minutes', 'shaxsiy', 3, 'kechqurun', '21:00', false],
      ['English lesson', 'oqish', 2, 'ertalab', '08:00', true],
    ],
    habits: ['Exercise', 'Reading (30 minutes)', 'Water \u2014 2 litres'],
    entries: [
      ['chiqim', 1_850_000, 'uy', 'Rent'],
      ['chiqim', 240_000, 'oziq', 'Market'],
      ['chiqim', 60_000, 'transport', ''],
      ['chiqim', 145_000, 'aloqa', 'Internet'],
      ['kirim', 6_500_000, 'maosh', ''],
    ],
    budget: 5_000_000,
  },
};

/* ---------- DevTools protokoli ---------- */

let seq = 0;
const waiters = new Map();

function send(ws, method, params = {}, sessionId) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => {
    waiters.set(id, { resolve, reject });
    setTimeout(() => {
      if (waiters.delete(id)) reject(new Error(`${method}: javob kelmadi`));
    }, 30_000);
  });
}

function attach(ws) {
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && waiters.has(msg.id)) {
      const w = waiters.get(msg.id);
      waiters.delete(msg.id);
      if (msg.error) w.reject(new Error(msg.error.message));
      else w.resolve(msg.result);
    }
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Chrome hali ko'tarilmagan
    }
    await sleep(500);
  }
  throw new Error(`javob yo'q: ${url}`);
}

/* ---------- ma'lumot va bosish ---------- */

function stateFor(lang) {
  const d = DEMO[lang];
  const today = new Date();
  const iso = (dd) => {
    const x = new Date(today);
    x.setDate(x.getDate() - dd);
    return x.toISOString().slice(0, 10);
  };
  const ym = iso(0).slice(0, 7);

  const habitDays = (skip) => {
    const days = {};
    for (let i = 0; i < 12; i++) if (i % skip !== 0) days[iso(i)] = true;
    return days;
  };

  return {
    v: 1,
    tasks: d.tasks.map(([title, cat, pri, block, time, done], i) => ({
      id: `t${i}`,
      title,
      cat,
      pri,
      block,
      ...(time ? { time } : {}),
      date: iso(0),
      done,
      created: 1000 + i,
    })),
    repeats: [],
    habits: d.habits.map((name, i) => ({ id: `h${i}`, name, days: habitDays(i + 2) })),
    entries: d.entries.map(([kind, amount, cat, note], i) => ({
      id: `e${i}`,
      kind,
      amount,
      cur: 'UZS',
      cat,
      ...(note ? { note } : {}),
      date: iso(i % 4),
      created: 2000 + i,
    })),
    budgets: { [ym]: d.budget },
    notes: '',
    settings: {
      theme: 'light',
      lang,
      cur: 'UZS',
      weekStartsMonday: true,
      onboarded: true,
      notifyTasks: true,
      notifyDaily: true,
      notifyAt: '21:00',
      lastTaskCat: 'ish',
      lastSpendCat: 'oziq',
      lastIncomeCat: 'maosh',
    },
    updated: new Date().toISOString(),
  };
}

/** Menyu yorlig'ini bosadi: eng pastdagi mos matnni topib, pointer voqealarini yuboradi. */
const clickTab = (label) => `
  (() => {
    const els = [...document.querySelectorAll('div,span')]
      .filter((e) => e.children.length === 0 && e.textContent.trim() === ${JSON.stringify(label)});
    if (!els.length) return 'topilmadi';
    els.sort((a, b) => b.getBoundingClientRect().y - a.getBoundingClientRect().y);
    const el = els[0];
    const t = el.closest('[tabindex],[role="button"]') || el.parentElement;
    const r = t.getBoundingClientRect();
    const o = { bubbles: true, cancelable: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2,
                pointerId: 1, isPrimary: true, button: 0, pointerType: 'mouse' };
    for (const ty of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
      t.dispatchEvent(new (ty.startsWith('pointer') ? PointerEvent : MouseEvent)(ty, o));
    return 'ok';
  })()
`;

/* ---------- asosiy oqim ---------- */

if (!CHROME) {
  console.error('Chrome yoki Edge topilmadi.');
  process.exit(1);
}
try {
  const res = await fetch(APP, { signal: AbortSignal.timeout(3000) });
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.error(`${APP} javob bermayapti. Avval boshqa terminalda: npm run web`);
  process.exit(1);
}

// Chrome profili ombordan tashqarida: ichida minglab fayl bo'ladi va ombor
// ichida bo'lsa eslint ularni tekshirib, tekshiruv ma'nosini yo'qotadi.
const profile = mkdtempSync(join(tmpdir(), 'kundo-shots-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let ws;
try {
  const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
  ws = new WebSocket(version.webSocketDebuggerUrl);
  attach(ws);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  const { targetId } = await send(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send(ws, 'Target.attachToTarget', { targetId, flatten: true });

  await send(ws, 'Page.enable', {}, sessionId);
  await send(ws, 'Runtime.enable', {}, sessionId);
  await send(
    ws,
    'Emulation.setDeviceMetricsOverride',
    { width: VIEW.width, height: VIEW.height, deviceScaleFactor: VIEW.scale, mobile: true },
    sessionId,
  );

  let n = 0;
  for (const lang of Object.keys(SCREENS)) {
    // Ma'lumot origin bo'yicha saqlanadi, shuning uchun avval sahifani ochamiz.
    await send(ws, 'Page.navigate', { url: APP }, sessionId);
    await sleep(1500);
    await send(
      ws,
      'Runtime.evaluate',
      {
        expression: `localStorage.setItem('kundo.state.v1', ${JSON.stringify(
          JSON.stringify(stateFor(lang)),
        )})`,
      },
      sessionId,
    );
    await send(ws, 'Page.navigate', { url: APP }, sessionId);

    // Ilova yuklanguncha kutamiz: menyu paydo bo'lishi belgisi.
    let ready = false;
    for (let i = 0; i < 40 && !ready; i++) {
      await sleep(500);
      const r = await send(
        ws,
        'Runtime.evaluate',
        { expression: `document.body.innerText.includes(${JSON.stringify(SCREENS[lang][1][1])})` },
        sessionId,
      );
      ready = r.result?.value === true;
    }
    if (!ready) throw new Error(`${lang}: ilova yuklanmadi`);

    const dir = join(OUT, lang);
    mkdirSync(dir, { recursive: true });

    for (const [i, [name, label]] of SCREENS[lang].entries()) {
      const r = await send(ws, 'Runtime.evaluate', { expression: clickTab(label) }, sessionId);
      if (r.result?.value !== 'ok') throw new Error(`${lang}/${name}: «${label}» topilmadi`);
      await sleep(1200);
      // Suratga olinadigan soha aniq beriladi. Aks holda Chrome viewport
      // pastini kesib qoldiradi va pastdagi menyu yarim ko'rinadi.
      const shot = await send(
        ws,
        'Page.captureScreenshot',
        {
          format: 'png',
          captureBeyondViewport: false,
          // `scale` — qurilma aniqligiga qo'shimcha ko'paytiruvchi. U ham 3 bo'lsa
          // natija 9x chiqadi (3510×7596 bo'lib ketdi). Aniqlik yuqorida
          // setDeviceMetricsOverride da berilgan, shuning uchun bu yerda 1.
          clip: { x: 0, y: 0, width: VIEW.width, height: VIEW.height, scale: 1 },
        },
        sessionId,
      );
      const file = join(dir, `${i + 1}-${name}.png`);
      writeFileSync(file, Buffer.from(shot.data, 'base64'));
      n++;
      console.log(`  ${lang}/${i + 1}-${name}.png`);
    }
  }

  console.log(`${n} rasm olindi \u2014 ${VIEW.width * VIEW.scale}\u00d7${VIEW.height * VIEW.scale}px`);
} finally {
  try {
    ws?.close();
  } catch {
    // yopilmasa ham muhim emas
  }
  chrome.kill();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    // vaqtinchalik papka qolib ketsa ham muhim emas
  }
}
