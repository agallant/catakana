// Smoke test for the N2 season: seeds a save through the stops in $STOP_IDS and visits N2 screens.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:4173/catakana/';
const out = process.argv[3] ?? '/tmp/shots-n2';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base);
const ids = JSON.parse(process.env.STOP_IDS ?? '[]');
await page.evaluate((ids) => {
  const stops = Object.fromEntries(ids.map((i) => [i, 2]));
  localStorage.setItem('catakana.save.v1', JSON.stringify({ v: 1, started: true, name: 'Tama', fish: 500, stops, stamps: ids, introduced: [] }));
}, ids);
await page.reload();
const shots = [['', 'map'], ['stop/hirosaki', 'stop'], ['lesson/hirosaki', 'lesson'], ['explore/kumano', 'explore'], ['trivia/asakusa', 'trivia'], ['play/kotohira/story/1', 'story'], ['play/kurashiki/sushi/2', 'sushi'], ['play/kurashiki/bento/1', 'bento'], ['play/arita/trace/1', 'trace'], ['passport', 'passport']];
for (const [r, n] of shots) {
  await page.goto(`${base}#/${r}`); await page.reload(); await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${n}.png` });
}
console.log('errors:', errors);
await browser.close();
