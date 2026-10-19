import { h, ruby, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { ALL_WORDS, type Word } from '../data/vocab';
import { kanjiThrough } from '../core/items';

const isKanji = (c: string): boolean => /[一-鿿]/.test(c);

/** Words written entirely in 2–3 kanji, all of which are taught by stop `index`. */
export function compoundsThrough(index: number): Word[] {
  const known = new Set(kanjiThrough(index).map((k) => k.char));
  return ALL_WORDS.filter((w) => {
    const chars = [...(w.kanji ?? '')];
    return chars.length >= 2 && chars.length <= 3 && chars.every((c) => isKanji(c) && known.has(c));
  });
}

/** Kanji Bento: pack kanji into the box to build compound words. */
export const bentoGame: GameDef = {
  id: 'bento',
  name: 'Kanji Bento',
  jp: 'かんじべんとう',
  emoji: '🍱',
  blurb: 'Pack kanji into the bento box to build words like 電車.',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || compoundsThrough(stopIndex).length >= 4,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Kanji Bento 🍱');
    const all = compoundsThrough(ctx.stopIndex);
    if (all.length < 4) return ctx.quit();
    // answers are saved under bento:<id>, so schedule rounds by those records
    const rounds = shuffle(pickItems(all.map((w) => ({ id: `bento:${w.id}`, w })), ctx.store.data.srs, 8)).map((c) => c.w);
    const known = kanjiThrough(ctx.stopIndex).map((k) => k.char);
    let idx = 0;
    let correct = 0;
    sh.setLives(3);

    const next = (): void => {
      if (idx >= rounds.length) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const w = rounds[idx]!;
      const target = [...w.kanji!];
      const decoys = shuffle(known.filter((k) => !target.includes(k))).slice(0, ctx.level === 1 ? 2 : ctx.level === 2 ? 4 : 6);
      const tiles = shuffle([...target, ...decoys]);
      const picked: number[] = [];
      let locked = false;
      const box = h('div', { class: 'bento-box' });
      const tray = h('div', { class: 'tray' });
      const draw = (): void => {
        box.replaceChildren(...target.map((_, k) => h('div', { class: `bento-slot jp ${picked[k] !== undefined ? 'filled' : ''}` }, picked[k] !== undefined ? tiles[picked[k]!]! : '')));
        tray.replaceChildren(
          ...tiles.map((t, i) => {
            const used = picked.includes(i);
            const b = h('button', { class: `tile jp ${used ? 'used' : ''}`, disabled: used }, t);
            b.addEventListener('click', () => {
              if (locked || used) return;
              picked.push(i);
              sfx.tap();
              draw();
              if (picked.length === target.length) void check();
            });
            return b;
          }),
        );
      };
      const check = async (): Promise<void> => {
        locked = true;
        const ok = picked.map((i) => tiles[i]).join('') === w.kanji;
        recordAnswer(ctx, { id: `bento:${w.id}`, kind: 'word', text: w.kanji!, reading: w.reading, romaji: w.romaji, en: w.en, emoji: w.emoji }, ok, sh);
        if (ok) correct++;
        box.classList.add(ok ? 'right' : 'wrong');
        reveal.replaceChildren(ruby(`{${w.kanji}|${w.reading}}`, 'always'));
        void speak(w.reading);
        await sleep(ok ? 1000 : 1900);
        idx++;
        next();
      };
      const reveal = h('div', { class: 'type-preview jp' });
      sh.body.replaceChildren(
        h(
          'div',
          { class: 'prompt' },
          h('div', { class: 'prompt-emoji' }, w.emoji),
          h('div', { class: 'big-en' }, w.en),
          // reading hint on easy; hard shows only the meaning
          ctx.level < 3 ? h('div', { class: 'prompt-romaji jp' }, w.reading) : null,
        ),
        box,
        reveal,
        tray,
        h('button', { class: 'btn ghost small', onClick: () => { if (!locked) { picked.length = 0; draw(); } } }, '↺ Unpack'),
      );
      draw();
    };
    sh.say('Fill the bento with the right kanji!', 'think');
    next();
  },
};
