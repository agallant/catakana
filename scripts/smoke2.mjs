// Smoke test for culture screens: seeds a mid-journey save, visits explore/trivia/passport/station.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:4173/catakana/';
const out = process.argv[3] ?? '/tmp/shots2';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base);
await page.evaluate(() => {
  const ids = ['tokyo','yokohama','kamakura','hakone','fuji','nagoya','kyoto','osaka'];
  const stops = Object.fromEntries(ids.map((i) => [i, 2]));
  localStorage.setItem('catakana.save.v1', JSON.stringify({ v: 1, started: true, name: 'Tama', fish: 80, stops, stamps: ids, introduced: [] }));
});
await page.reload();
const shots = [['explore/kyoto','explore'],['trivia/kyoto','trivia'],['passport','passport'],['play/osaka/station/1','station'],['travel/nara','travel'],['play/osaka/sushi/1','sushi'],['lesson/osaka','lesson']];
for (const [r, n] of shots) {
  await page.goto(`${base}#/${r}`); await page.reload(); await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${n}.png`, fullPage: n === 'explore' || n === 'passport' });
}
console.log('errors:', errors);
await browser.close();
