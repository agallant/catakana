import { h, ruby } from '../ui/dom';
import type { FuriganaMode } from '../core/store';
import { sfx } from '../core/audio';
import type { GameContext, Item, ItemKind } from './types';
import { pickItems, sample, shuffle, type SrsRecord } from '../core/srs';
import { STOPS } from '../data/journey';
import { catSvg } from '../ui/cat';

export const ROUNDS = 10;

/** Pick the items for one session: new focus items first, then weakest of the pool. */
export function sessionItems(ctx: GameContext, n = ROUNDS, kinds?: ItemKind[]): Item[] {
  const ok = (i: Item) => !kinds || kinds.includes(i.kind);
  const pool = ctx.pool.filter(ok);
  const focus = ctx.focus.filter(ok);
  const records = ctx.store.data.srs;
  const half = Math.min(focus.length, Math.ceil(n / 2));
  const first = pickItems(focus, records, half);
  const rest = pickItems(
    pool.filter((p) => !first.includes(p)),
    records,
    n - first.length,
  );
  let out = [...first, ...rest];
  // cycle if the pool is tiny
  while (out.length < n && out.length > 0) out = out.concat(shuffle(out)).slice(0, n);
  return shuffle(out);
}

/** Distractors resembling the answer (same kind and script) from the pool. */
export function distractors(ctx: GameContext, answer: Item, n: number, keyOf: (i: Item) => string = (i) => i.text): Item[] {
  const same = ctx.pool.filter((p) => p.id !== answer.id && p.kind === answer.kind && p.script === answer.script);
  const unique = new Map<string, Item>();
  for (const p of same) {
    const key = keyOf(p);
    if (key !== keyOf(answer) && !unique.has(key)) unique.set(key, p);
  }
  const cands = [...unique.values()];
  if (cands.length < n) {
    // pad with look-alikes from any item of the same kind
    const seen = new Set([keyOf(answer), ...cands.map(keyOf)]);
    for (const p of [...ctx.pool, ...shuffle(ctx.wide)]) {
      if (cands.length >= n * 3) break;
      if (p.kind !== answer.kind || seen.has(keyOf(p))) continue;
      seen.add(keyOf(p));
      cands.push(p);
    }
  }
  // prefer similar length for words
  if (answer.kind === 'word') {
    cands.sort((a, b) => Math.abs(a.reading.length - answer.reading.length) - Math.abs(b.reading.length - answer.reading.length) + (Math.random() - 0.5));
    return cands.slice(0, n);
  }
  return shuffle(cands).slice(0, n);
}

export interface Shell {
  body: HTMLElement;
  setProgress(done: number, total: number): void;
  setLives(n: number): void;
  say(msg: string, mood?: 'happy' | 'sad' | 'think' | 'wow'): void;
  flash(ok: boolean): void;
  destroy(): void;
}

/** Correct answers in a row within the current game, so the chime climbs with a streak. */
let streak = 0;

/** Common chrome: back button, progress bar, a cat mascot who reacts. */
export function shell(ctx: GameContext, title: string): Shell {
  streak = 0;
  const progress = h('div', { class: 'progress-fill' });
  const lives = h('span', { class: 'lives' });
  const mascot = h('div', { class: 'mascot' }, catSvg(ctx.store.data.look, 'happy', 64));
  const bubble = h('div', { class: 'bubble', 'aria-live': 'polite' });
  const body = h('div', { class: 'game-body' });
  const top = h(
    'div',
    { class: 'game-top' },
    h('button', { class: 'btn ghost', onClick: () => ctx.quit(), 'aria-label': 'Quit' }, '✕'),
    h('div', { class: 'game-title' }, title),
    lives,
  );
  const bar = h('div', { class: 'progress' }, progress);
  const chat = h('div', { class: 'chat' }, mascot, bubble);
  const el = h('div', { class: 'game' }, top, bar, body, chat);
  ctx.root.replaceChildren(el);

  let timer: number | undefined;
  return {
    body,
    setProgress(done, total) {
      progress.style.width = `${Math.round((done / total) * 100)}%`;
    },
    setLives(n) {
      lives.textContent = '❤️'.repeat(Math.max(0, n)) + '🤍'.repeat(Math.max(0, 3 - n));
    },
    say(msg, mood = 'happy') {
      bubble.textContent = msg;
      mascot.replaceChildren(catSvg(ctx.store.data.look, mood, 64));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        mascot.replaceChildren(catSvg(ctx.store.data.look, 'happy', 64));
      }, 1600);
    },
    flash(ok) {
      el.classList.remove('flash-ok', 'flash-bad');
      void el.offsetWidth;
      el.classList.add(ok ? 'flash-ok' : 'flash-bad');
    },
    destroy() {
      window.clearTimeout(timer);
    },
  };
}

export const PRAISE = ['Purrfect!', 'Nya-ice!', 'Pawsome!', 'Meow-velous!', 'Whisker-tastic!', 'Cat-tastic!', 'Great job!'];
export const OOPS = ['Oops, almost!', 'Nyot quite…', 'Try to remember this one!', 'Hiss-take! Next time!'];

export function praise(): string {
  return sample(PRAISE);
}
export function oops(): string {
  return sample(OOPS);
}

/** Right/wrong sound that tracks the streak, so the chime climbs with each answer in a row. */
export function chime(ok: boolean): void {
  streak = ok ? streak + 1 : 0;
  if (ok) sfx.correct(streak - 1);
  else sfx.wrong();
}

export function recordAnswer(ctx: GameContext, item: Item, ok: boolean, sh: Shell): void {
  ctx.store.recordAnswer(item.id, ok);
  chime(ok);
  sh.say(ok ? praise() : oops(), ok ? 'happy' : 'sad');
  sh.flash(ok);
}

/** What an item means: emoji + English for words, the sound for kana. */
export function meaning(item: Item): string {
  return item.kind === 'kana' ? item.romaji : `${item.emoji ?? ''} ${item.en ?? ''}`.trim();
}

export function displayPrompt(item: Item, opts: { romaji?: boolean; furigana?: FuriganaMode } = {}): HTMLElement {
  const withRuby = item.kind === 'word' && item.text !== item.reading;
  return h(
    'div',
    { class: `prompt ${item.kind === 'word' ? 'prompt-word' : 'prompt-kana'}` },
    h('div', { class: 'prompt-jp jp' }, withRuby ? ruby(`{${item.text}|${item.reading}}`, opts.furigana ?? 'always') : item.text),
    opts.romaji ? h('div', { class: 'prompt-romaji' }, item.romaji) : null,
  );
}

/**
 * Pick up to `total` items, leading with this stop's JLPT level: up to `fresh` of the current
 * level, then spaced review of earlier levels, then more of the current level if review runs short.
 * `stopOf` gives the stop index from which an item is available.
 */
export function levelFirst<T extends { id: string }>(
  items: T[],
  stopOf: (item: T) => number,
  stopIndex: number,
  srs: Record<string, SrsRecord>,
  total: number,
  fresh: number,
): T[] {
  const tier = STOPS[stopIndex]?.tier;
  const current = items.filter((it) => STOPS[stopOf(it)]?.tier === tier);
  const review = items.filter((it) => !current.includes(it));
  const first = pickItems(current, srs, Math.min(fresh, current.length));
  const older = pickItems(review, srs, Math.min(total - first.length, review.length));
  const rest = current.filter((it) => !first.includes(it));
  const extra = pickItems(rest, srs, Math.min(total - first.length - older.length, rest.length));
  return shuffle([...first, ...older, ...extra]);
}
