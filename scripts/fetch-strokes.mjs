// Downloads KanjiVG stroke paths for every kana and kanji the game teaches and writes
// src/data/strokes.json  ({ char: [svg path d, ...] } in stroke order, 109x109 viewBox).
// KanjiVG (c) Ulrich Apel, CC BY-SA 3.0 — https://kanjivg.tagaini.net
// Usage: npx vite-node scripts/fetch-strokes.mjs   (needs network)
import { writeFileSync } from 'node:fs';
import { ALL_KANA } from '../src/data/kana.ts';
import { KANJI } from '../src/data/kanji.ts';

const chars = new Set();
for (const k of ALL_KANA) for (const c of k.char) chars.add(c);
for (const c of 'っッー') chars.add(c);
for (const k of KANJI) chars.add(k.char);

const out = {};
for (const c of [...chars].sort()) {
  const hex = c.codePointAt(0).toString(16).padStart(5, '0');
  const res = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
  if (!res.ok) {
    console.warn('missing', c, res.status);
    continue;
  }
  const svg = await res.text();
  const paths = [...svg.matchAll(/<path\b[^>]*>/g)].map((m) => /\sd="([^"]+)"/.exec(m[0])?.[1]).filter(Boolean);
  // compact numbers to 1 decimal to keep the bundle small
  // (keep the sign even when rounding to zero: in SVG paths a '-' doubles as the separator)
  out[c] = paths.map((d) =>
    d.replace(/-?\d+\.\d+/g, (n) => (n.startsWith('-') ? '-' : '') + String(Math.abs(Math.round(parseFloat(n) * 10) / 10))),
  );
}
writeFileSync('src/data/strokes.json', JSON.stringify(out));
console.log('chars', Object.keys(out).length);
