// Smoke test for late-tour stops: seeds a save through the stops in $STOP_IDS and visits N2/N1 screens.
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
const shots = [['', 'map'], ['stop/gotokuji', 'stop'], ['lesson/sannai', 'lesson1'], ['explore/amami', 'explore1'], ['play/izu/train/2', 'train'], ['lesson/hirosaki', 'lesson'], ['explore/kumano', 'explore'], ['trivia/asakusa', 'trivia'], ['play/kotohira/story/1', 'story'], ['play/munakata/story/2', 'story-n1'], ['play/kawagoe/keigo/1', 'keigo1'], ['play/gotokuji/keigo/3', 'keigo3'], ['play/kobe/kitchen/2', 'kitchen-adj'], ['play/hikone/kitchen/1', 'kitchen'], ['play/kochi/counting/2', 'count2'], ['play/hikone/counting/3', 'count3'], ['play/tsumago/counting/2', 'count-n3'], ['play/kanazawa/timetable/1', 'time1'], ['play/kochi/timetable/2', 'time2'], ['play/kanazawa/particles/1', 'particles1'], ['play/otaru/particles/3', 'particles3'], ['play/gotokuji/particles/2', 'particles-n1'], ['play/aomori/onomatopoeia/1', 'ono1'], ['play/takachiho/onomatopoeia/3', 'ono3'], ['play/gotokuji/onomatopoeia/3', 'ono-n1'], ['play/gotokuji/cafe/1', 'cafe-n1'], ['play/kusatsu/roleplay/1', 'roleplay1'], ['play/gotokuji/roleplay/3', 'roleplay3'], ['play/kurashiki/sushi/2', 'sushi'], ['play/kurashiki/bento/1', 'bento'], ['play/arita/trace/1', 'trace'], ['passport', 'passport']];
for (const [r, n] of shots) {
  await page.goto(`${base}#/${r}`); await page.reload(); await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${n}.png` });
}
console.log('errors:', errors);
await browser.close();
if (errors.length > 0) process.exitCode = 1;
