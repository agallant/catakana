import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { sessionItems, shell } from './common';
import { loadStrokes } from '../core/strokes';
import { createWriter } from '../ui/writer';
import { toHiragana } from '../data/kana';

function promptFor(item: Item, hints: boolean): HTMLElement {
  if (item.kind === 'kanji') return h('div', { class: 'prompt' }, h('div', { class: 'prompt-emoji' }, item.emoji ?? ''), h('div', { class: 'prompt-romaji' }, `${item.en ?? ''} · ${item.reading}`));
  if (item.kind === 'word')
    return h('div', { class: 'prompt' }, h('div', { class: 'prompt-emoji' }, item.emoji ?? ''), h('div', { class: 'prompt-romaji' }, `${item.en ?? ''}${item.text !== item.reading ? ` · ${item.reading}` : ''}${hints ? ` · ${item.romaji}` : ''}`));
  return h('div', { class: 'prompt' }, h('div', { class: 'prompt-sound' }, item.script === 'katakana' ? `${item.romaji} · ${toHiragana(item.text)}` : item.romaji));
}

/** Paw Painting: write characters stroke by stroke, in the right order and direction. */
export const traceGame: GameDef = {
  id: 'trace',
  name: 'Paw Painting',
  jp: 'かきじゅん',
  emoji: '🐾',
  blurb: 'Write each stroke in the right order with your paw!',
  kinds: ['kana', 'word', 'kanji'],
  skill: 'writing',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Paw Painting 🐾');
    const items = sessionItems(ctx, 10).filter((i) => [...i.text].length <= 3);
    const queue = (items.length ? items : ctx.pool).slice(0, 6);
    let idx = 0;
    let correct = 0;
    sh.setLives(3);

    const run = async (): Promise<void> => {
      const data = await loadStrokes();
      const next = (): void => {
        if (idx >= queue.length) {
          sh.destroy();
          return ctx.finish({ correct, total: queue.length });
        }
        sh.setProgress(idx, queue.length);
        const item = queue[idx]!;
        const chars = [...item.text];
        let ci = 0;
        let totalMistakes = 0;
        const size = Math.min(300, window.innerWidth - 48);
        const pad = h('div', { class: 'writers' });
        const word = h('div', { class: 'write-word jp' });
        const drawWord = (): void => word.replaceChildren(...chars.map((c, k) => h('span', { class: k < ci ? 'w-ok' : k === ci ? 'w-cur' : 'w-todo' }, k <= ci || ctx.level === 1 ? c : '・')));
        let current: ReturnType<typeof createWriter> | null = null;
        const writeChar = (): void => {
          drawWord();
          const strokes = data[chars[ci]!] ?? [];
          current = createWriter({
            strokes,
            level: ctx.level,
            size,
            onStroke(ok, reversed) {
              if (ok) sfx.tap();
              else {
                sfx.wrong();
                sh.say(reversed ? 'Other direction!' : 'Check the stroke order!', 'think');
              }
            },
            async onDone(m) {
              totalMistakes += m;
              sfx.correct();
              ci++;
              if (ci < chars.length) {
                await sleep(350);
                writeChar();
                return;
              }
              drawWord();
              const ok = totalMistakes <= chars.length * (ctx.level === 1 ? 2 : 1);
              ctx.store.recordAnswer(item.id, ok);
              if (ok) correct++;
              sh.flash(ok);
              sh.say(ok ? 'Beautiful brushwork!' : 'Finished — keep practicing the order!', ok ? 'happy' : 'sad');
              void speak(item.reading);
              await sleep(1100);
              idx++;
              next();
            },
          });
          pad.replaceChildren(current.el);
        };
        sh.body.replaceChildren(
          h('div', { class: 'prompt-row' }, promptFor(item, ctx.hints), h('button', { class: 'btn small ghost', onClick: () => void speak(item.reading), 'aria-label': 'Hear it' }, '🔊')),
          word,
          pad,
          h(
            'div',
            { class: 'row' },
            h('button', { class: 'btn ghost', onClick: () => { totalMistakes++; current?.hint(); } }, '💡 Hint'),
            h('button', { class: 'btn ghost', onClick: () => current?.reset() }, '↺ Restart'),
          ),
        );
        writeChar();
      };
      next();
    };
    sh.say(ctx.level === 3 ? 'Write from memory — order counts!' : 'Start at the pink dot!', 'think');
    void run();
  },
};
