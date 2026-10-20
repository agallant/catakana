import { h, ruby, sleep } from '../ui/dom';
import { hasJapaneseVoice, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { ONO_BLANK, ONOMATOPOEIA, type Ono } from '../data/onomatopoeia';
import { STOPS } from '../data/journey';
import { readingOf } from '../screens/explore';

export function onoThrough(stopIndex: number): Ono[] {
  return ONOMATOPOEIA.filter((o) => {
    const at = STOPS.findIndex((s) => s.id === o.from);
    return at >= 0 && at <= stopIndex;
  });
}

/** Meaning choices for levels 1–2: the right one plus other words' meanings. */
export function meaningChoices(target: Ono, pool: Ono[], n: number): Ono[] {
  const others = shuffle((pool.length > n ? pool : ONOMATOPOEIA).filter((o) => o.id !== target.id)).slice(0, n);
  return shuffle([target, ...others]);
}

const ROUNDS = 8;

/** Nyan Sounds: ニャー, ゴロゴロ, ドキドキ, ペラペラ… read them, hear them, use them. */
export const onomatopoeiaGame: GameDef = {
  id: 'onomatopoeia',
  name: 'Nyan Sounds',
  jp: 'オノマトペ',
  emoji: '🎶',
  blurb: 'ニャー, ゴロゴロ, ドキドキ: Japanese sound and feeling words. Read them, hear them, use them.',
  kinds: ['word'],
  skill: 'listening',
  available: (stopIndex) => stopIndex === undefined || onoThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Nyan Sounds 🎶');
    const words = onoThrough(ctx.stopIndex);
    const rounds = pickItems(
      words.map((o) => ({ ...o, id: `ono:${o.id}` })),
      ctx.store.data.srs,
      Math.min(ROUNDS, words.length),
    );
    if (!rounds.length) return ctx.quit();
    const mode = ctx.level === 1 ? 'always' : ctx.store.data.settings.furigana;
    // level 2 is listening only when speech is on and the device can actually say the word
    const earOnly = ctx.level === 2 && ctx.store.data.settings.speech && hasJapaneseVoice();
    let idx = 0;
    let correct = 0;
    let lives = 3;
    sh.setLives(lives);

    const next = (): void => {
      if (idx >= rounds.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const o = rounds[idx]!;
      const base = ONOMATOPOEIA.find((x) => `ono:${x.id}` === o.id)!;
      const filled = o.ex.replace(ONO_BLANK, o.word);
      let locked = false;
      const reveal = h('div', { class: 'keigo-reveal' }, ' ');
      const wordEl = h('div', { class: 'prompt-jp jp' }, earOnly ? '🔊 …' : o.word);
      // if the word could not be spoken after all, show it so the round stays answerable
      const play = (): void =>
        void speak(o.word).then((spoke) => {
          if (!spoke) wordEl.textContent = o.word;
        });
      const done = async (ok: boolean, b: HTMLElement, right: HTMLElement | undefined): Promise<void> => {
        locked = true;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) right?.classList.add('right');
        recordAnswer(ctx, { id: o.id, kind: 'word', text: o.word, reading: o.word, romaji: '', en: o.en, emoji: o.emoji }, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        reveal.replaceChildren(
          h('div', { class: 'jp' }, `${o.emoji} ${o.word} = ${o.en}`),
          h('div', { class: 'jp' }, ruby(filled, 'always')),
          h('div', { class: 'muted' }, o.exEn),
        );
        void speak(readingOf(filled));
        await sleep(ok ? 1800 : 3200);
        idx++;
        next();
      };

      if (ctx.level === 3) {
        // use it: pick the word that fits the sentence
        const options = shuffle([o.word, ...shuffle(o.wrong).slice(0, 3)]);
        const buttons = options.map((w) => {
          const b = h('button', { class: 'choice text jp' }, w);
          b.addEventListener('click', () => {
            if (locked) return;
            void done(w === o.word, b, buttons[options.indexOf(o.word)]);
          });
          return b;
        });
        sh.body.replaceChildren(
          // the English would give the word away, so it only appears in the reveal
          h('div', { class: 'prompt' }, h('div', { class: 'prompt-jp jp keigo-ex' }, ruby(o.ex, mode))),
          h('div', { class: 'choices two-col' }, buttons),
          reveal,
        );
        return;
      }

      // levels 1–2: what does it mean?
      const options = meaningChoices(base, words, ctx.level === 1 ? 2 : 3);
      const buttons = options.map((c) => {
        const b = h('button', { class: 'choice text' }, `${c.emoji} ${c.en}`);
        b.addEventListener('click', () => {
          if (locked) return;
          void done(c.id === base.id, b, buttons[options.indexOf(base)]);
        });
        return b;
      });
      sh.body.replaceChildren(
        h(
          'div',
          { class: 'prompt' },
          wordEl,
          h('button', { class: 'btn ghost', onClick: play, 'aria-label': 'Play the sound word again' }, '🔊 Again'),
        ),
        h('div', { class: 'choices one-col' }, buttons),
        reveal,
      );
      play();
    };
    sh.say('Nyaa! Japanese has a word for every sound and feeling.', 'think');
    next();
  },
};
