// Local smoke test: walks the main flow in headless Chromium and saves screenshots.
// Usage: CHROMIUM_PATH=... node scripts/smoke.mjs [baseUrl] [outDir]
import { chromium, devices } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4173/catakana/';
const out = process.argv[3] ?? '/tmp/shots';
import { mkdirSync } from 'node:fs';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(base);
await page.screenshot({ path: `${out}/1-welcome.png` });
await page.click('text=Start the journey');
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/2-travel.png` });
await page.click('text=/Arrive in/');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/3-stop.png`, fullPage: true });
await page.click('text=Start lesson');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/4-lesson.png` });
for (let i = 0; i < 5; i++) { await page.click('text=/Next ▶/'); await page.waitForTimeout(100); }
await page.waitForTimeout(300);
for (const game of ['sushi', 'pairs', 'trace', 'listen', 'typing']) {
  await page.goto(`${base}#/play/tokyo/${game}/1`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/5-${game}.png` });
}
await page.goto(`${base}#/map`); await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/6-map.png`, fullPage: true });
await page.goto(`${base}#/dojo`); await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/7-dojo.png`, fullPage: true });
await page.goto(`${base}#/cats`); await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/8-cats.png`, fullPage: true });
console.log('errors:', errors);
await browser.close();
