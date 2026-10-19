import type { App, Screen } from '../ui/app';
import { fill, h } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { lessonBatch } from '../core/items';
import { sfx, speak } from '../core/audio';
import { MNEMONICS } from '../data/mnemonics';
import type { Item } from '../games/types';
import { WORDS } from '../data/vocab';
import { toHiragana } from '../data/kana';
import { romajiHints } from '../core/romaji';

/** Romaji hidden behind a tap once the training wheels come off. */
function revealRomaji(romaji: string): HTMLElement {
  const b = h('button', { class: 'chip reveal' }, 'Show romaji');
  b.addEventListener('click', () => {
    b.textContent = romaji;
    b.disabled = true;
  });
  return h('div', { class: 'lesson-romaji' }, b);
}

function exampleFor(item: Item): { jp: string; romaji: string; en: string; emoji: string } | null {
  if (item.kind !== 'kana') return null;
  const w = WORDS.find((x) => x.jp.startsWith(item.text) || x.jp.includes(item.text));
  return w ? { jp: w.jp, romaji: w.romaji, en: w.en, emoji: w.emoji } : null;
}

/** Flash-card style intro lesson for the items taught at a stop. */
export function lessonScreen(app: App, params: string[]): Screen {
  const stop = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  const idx = STOPS.indexOf(stop);
  const { items } = lessonBatch(idx, new Set(app.store.data.introduced));
  const hints = romajiHints(app.store.data, idx);
  let i = 0;
  const card = h('div', { class: 'lesson-card' });
  const dots = h('div', { class: 'dots' });

  const show = (): void => {
    const item = items[i]!;
    const ex = exampleFor(item);
    const mn = MNEMONICS[item.text];
    fill(
      card,
      h('div', { class: 'lesson-glyph jp' }, item.text),
      item.kind === 'kana'
        ? h('div', { class: 'lesson-romaji' }, item.romaji, item.script === 'katakana' ? h('span', { class: 'twin jp' }, ` = ${toHiragana(item.text)}`) : null)
        : hints
          ? h('div', { class: 'lesson-romaji small-romaji' }, item.romaji)
          : revealRomaji(item.romaji),
      item.en ? h('div', { class: 'lesson-en' }, `${item.emoji ?? ''} ${item.en}`) : null,
      mn ? h('div', { class: 'mnemonic' }, `🐾 ${mn}`) : null,
      ex ? h('div', { class: 'example' }, `e.g. `, h('span', { class: 'jp' }, ex.jp), hints ? ` (${ex.romaji})` : '', ` ${ex.emoji} ${ex.en}`) : null,
      h('button', { class: 'btn primary', onClick: () => void speak(item.reading) }, '🔊 Hear it'),
    );
    dots.replaceChildren(...items.map((_, k) => h('span', { class: `dot ${k === i ? 'on' : k < i ? 'seen' : ''}` })));
    void speak(item.reading);
  };
  const next = (): void => {
    sfx.tap();
    app.store.introduce([items[i]!.id]);
    if (i < items.length - 1) {
      i++;
      show();
    } else {
      app.store.introduce(items.map((x) => x.id));
      app.go(`stop/${stop.id}`);
    }
  };
  const el = h(
    'div',
    { class: 'screen lesson' },
    h('div', { class: 'row' }, h('button', { class: 'btn ghost small', onClick: () => app.go(`stop/${stop.id}`) }, '← Back'), h('strong', null, `${stop.emoji} ${stop.name} lesson`)),
    dots,
    card,
    h(
      'div',
      { class: 'row' },
      h('button', { class: 'btn ghost', onClick: () => { if (i > 0) { i--; show(); } } }, '◀'),
      h('button', { class: 'btn primary big', onClick: next }, 'Next ▶'),
    ),
  );
  if (items.length) show();
  else app.go(`stop/${stop.id}`);
  return { el };
}
