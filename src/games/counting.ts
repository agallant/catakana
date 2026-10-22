import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell, startingLives } from './common';
import { pickItems, sample, shuffle } from '../core/srs';
import { COUNTERS, counterDistractors, written, type Counter } from '../data/counters';
import { STOPS } from '../data/journey';
import { romajiToHiragana } from '../data/kana';

export function countersThrough(stopIndex: number): Counter[] {
  return COUNTERS.filter((c) => {
    const at = STOPS.findIndex((s) => s.id === c.from);
    return at >= 0 && at <= stopIndex;
  });
}

const ROUNDS = 8;

interface Round {
  id: string;
  counter: Counter;
  n: number;
}

/** Cat Count: count fish, dango and tea cups with the right counter (いっぴき, さんぼん, ろっぱい…). */
export const countingGame: GameDef = {
  id: 'counting',
  name: 'Cat Count',
  jp: 'かぞえよう',
  emoji: '🔢',
  blurb: 'Count fish, dango and teacups with the right counter: いっぴき, さんぼん, ろっぱい…',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || countersThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Cat Count 🔢');
    const counters = countersThrough(ctx.stopIndex);
    if (!counters.length) return ctx.quit();
    const max = ctx.level === 1 ? 5 : 10;
    const all: Round[] = counters.flatMap((counter) => Array.from({ length: max }, (_, i) => ({ id: `count:${counter.id}:${i + 1}`, counter, n: i + 1 })));
    // favour the newest counter a little, then the weakest by spaced repetition
    const newest = counters[counters.length - 1]!;
    const rounds = shuffle([
      ...pickItems(all.filter((r) => r.counter === newest), ctx.store.data.srs, 3),
      ...pickItems(all.filter((r) => r.counter !== newest), ctx.store.data.srs, ROUNDS - 3),
    ]);
    while (rounds.length < ROUNDS && all.length) rounds.push(sample(all));
    let idx = 0;
    let correct = 0;
    let lives = startingLives(ctx.store.data.settings);
    sh.setLives(lives);

    const next = (): void => {
      if (idx >= rounds.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const { id, counter, n } = rounds[idx]!;
      // level 3 hides the counter, and round things like apples and rice balls take either つ or 個
      const twin = ctx.level === 3 ? ({ tsu: 'ko', ko: 'tsu' } as Record<string, string>)[counter.id] : undefined;
      const accepted = [...counter.readings[n - 1]!, ...(COUNTERS.find((c) => c.id === twin)?.readings[n - 1] ?? [])];
      const main = accepted[0]!;
      const [emoji, noun] = sample(counter.things);
      let locked = false;
      const reveal = h('div', { class: 'type-preview jp' }, ' ');
      const done = async (ok: boolean): Promise<void> => {
        locked = true;
        recordAnswer(ctx, { id, kind: 'word', text: written(counter, n), reading: main, romaji: '', en: `${n} ${noun}` }, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        reveal.textContent = `${written(counter, n)} = ${accepted.join(' / ')}`;
        void speak(main);
        await sleep(ok ? 1000 : 2200);
        idx++;
        next();
      };
      const prompt = h(
        'div',
        { class: 'prompt' },
        h('div', { class: 'count-pile', 'aria-label': `${n} ${noun}` }, Array.from({ length: n }, () => h('span', null, emoji))),
        h('div', { class: 'prompt-romaji' }, `How many ${noun}?`),
        // level 3 leaves out the counter: pick it from what is being counted
        ctx.level === 3 ? null : h('div', { class: 'form-chip' }, `${counter.kanji} · ${counter.what}`),
      );
      if (ctx.level === 3) {
        const input = h('input', { class: 'type-input', type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Type the count in romaji', placeholder: 'romaji, e.g. sanbiki' });
        const preview = h('div', { class: 'type-preview jp' }, ' ');
        input.addEventListener('input', () => (preview.textContent = romajiToHiragana(input.value)));
        const submit = (): void => {
          if (locked) return;
          const typed = romajiToHiragana(input.value.trim().toLowerCase());
          void done(accepted.includes(typed) || accepted.includes(input.value.trim()));
        };
        input.addEventListener('keydown', (e) => (e as KeyboardEvent).key === 'Enter' && submit());
        sh.body.replaceChildren(prompt, preview, input, h('button', { class: 'btn primary', onClick: submit }, 'Count ⏎'), reveal);
        input.focus();
      } else {
        const options = shuffle([main, ...shuffle(counterDistractors(counter, n)).slice(0, ctx.level === 1 ? 2 : 3)]);
        const buttons = options.map((o) => {
          const b = h('button', { class: 'choice text jp' }, o);
          b.addEventListener('click', () => {
            if (locked) return;
            const ok = accepted.includes(o);
            b.classList.add(ok ? 'right' : 'wrong');
            if (!ok) buttons[options.indexOf(main)]!.classList.add('right');
            void done(ok);
          });
          return b;
        });
        sh.body.replaceChildren(prompt, h('div', { class: 'choices one-col' }, buttons), reveal);
      }
    };
    sh.say('Let’s count, nya! 1, 2, 3…', 'think');
    next();
  },
};
