import { h, ruby, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { pickItems, shuffle, type SrsRecord } from '../core/srs';
import { BLANK, PARTICLES, particleDistractors, type ParticleItem } from '../data/particles';
import { STOPS } from '../data/journey';
import { readingOf } from '../screens/explore';

/** Particle sentences unlocked at or before stop `stopIndex`. */
export function particlesThrough(stopIndex: number): ParticleItem[] {
  return PARTICLES.filter((p) => {
    const at = STOPS.findIndex((s) => s.id === p.from);
    return at >= 0 && at <= stopIndex;
  });
}

const ROUNDS = 8;
/** rounds drawn from the current level's sentences when there are enough */
const FRESH = 5;

/** Split unlocked items into this stop's JLPT level and earlier review. */
export function splitByTier(items: ParticleItem[], stopIndex: number): { fresh: ParticleItem[]; review: ParticleItem[] } {
  const tier = STOPS[stopIndex]?.tier;
  const fresh = items.filter((p) => STOPS.find((s) => s.id === p.from)?.tier === tier);
  return { fresh, review: items.filter((p) => !fresh.includes(p)) };
}

/**
 * Pick a round: up to FRESH sentences from this stop's level, then spaced review of earlier levels,
 * then more of this level if there is too little review (e.g. at N5 stops) — up to ROUNDS in all.
 */
export function particleRounds(stopIndex: number, srs: Record<string, SrsRecord>): ParticleItem[] {
  const tag = (list: ParticleItem[]) => list.map((p) => ({ ...p, id: `particle:${p.id}` }));
  const { fresh, review } = splitByTier(particlesThrough(stopIndex), stopIndex);
  const first = pickItems(tag(fresh), srs, Math.min(FRESH, fresh.length));
  const older = pickItems(tag(review), srs, Math.min(ROUNDS - first.length, review.length));
  const taken = new Set(first.map((p) => p.id));
  const rest = tag(fresh).filter((p) => !taken.has(p.id));
  const extra = pickItems(rest, srs, Math.min(ROUNDS - first.length - older.length, rest.length));
  return shuffle([...first, ...older, ...extra]);
}

/** Particle Pounce: pounce on the particle that fills the gap (は, を, に, で, より, によって…). */
export const particlesGame: GameDef = {
  id: 'particles',
  name: 'Particle Pounce',
  jp: 'てにをは',
  emoji: '🐾',
  blurb: 'Pounce on the missing particle: は or が, に or で, だけ or しか…',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || particlesThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Particle Pounce 🐾');
    const rounds = particleRounds(ctx.stopIndex, ctx.store.data.srs);
    if (!rounds.length) return ctx.quit();
    const mode = ctx.level === 1 ? 'always' : ctx.store.data.settings.furigana;
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
      const p = rounds[idx]!;
      const accepted = [p.answer, ...(p.also ?? [])];
      const options = shuffle([p.answer, ...particleDistractors(p, ctx.level === 1 ? 2 : 3)]);
      const filled = p.text.replace(BLANK, p.answer);
      let locked = false;
      const reveal = h('div', { class: 'keigo-reveal' }, ' ');
      const buttons = options.map((o) => {
        const b = h('button', { class: 'choice text jp' }, o);
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          const ok = accepted.includes(o);
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons[options.indexOf(p.answer)]!.classList.add('right');
          recordAnswer(ctx, { id: p.id, kind: 'word', text: p.answer, reading: p.answer, romaji: '', en: p.en }, ok, sh);
          if (ok) correct++;
          else {
            lives--;
            sh.setLives(lives);
          }
          const alsoNote = p.also?.length ? ` (also: ${p.also.join(' / ')})` : '';
          reveal.replaceChildren(
            h('div', { class: 'jp' }, ruby(filled, 'always')),
            h('div', { class: 'muted' }, p.en),
            h('div', { class: 'muted' }, `${p.why}${alsoNote}`),
          );
          void speak(readingOf(filled));
          await sleep(ok ? 1600 : 3000);
          idx++;
          next();
        });
        return b;
      });
      const prompt = h(
        'div',
        { class: 'prompt' },
        h('div', { class: 'prompt-emoji' }, '🐾'),
        h('div', { class: 'prompt-jp jp keigo-ex' }, ruby(p.text, mode)),
        // level 3 hides the translation: read the sentence on its own
        ctx.level === 3 ? null : h('div', { class: 'prompt-romaji' }, p.en),
      );
      sh.body.replaceChildren(prompt, h('div', { class: 'choices two-col' }, buttons), reveal);
    };
    sh.say('Which little word fits? Pounce, nya!', 'think');
    next();
  },
};
