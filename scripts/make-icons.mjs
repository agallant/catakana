// Renders public/icons/icon.svg to the PNG sizes the PWA manifest needs.
// Usage: node scripts/make-icons.mjs  (requires a Chromium via Playwright)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/icons/icon.svg', 'utf8');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
const targets = [
  ['icon-192.png', 192, 0],
  ['icon-512.png', 512, 0],
  ['icon-maskable-512.png', 512, 0.12],
];
for (const [name, size, pad] of targets) {
  const inner = Math.round(size * (1 - pad * 2));
  const off = Math.round(size * pad);
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:#ff8fa3"><div style="position:absolute;left:${off}px;top:${off}px;width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body>`);
  await page.screenshot({ path: `public/icons/${name}` });
}
await browser.close();
