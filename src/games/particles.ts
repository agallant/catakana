import { h, ruby, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { BLANK, PARTICLES, particleDistractors, type ParticleItem } from '../data/particles';
import { STOPS } from '../data/journey';
import { readingOf } from '../screens/explore';

export function particlesThrough(stopIndex: number): ParticleItem[] {
  return PARTICLES.filter((p) => {
    const at = STOPS.findIndex((s) => s.id === p.from);
    return at >= 0 && at <= stopIndex;
  });
}

const ROUNDS = 8;

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
    const items = particlesThrough(ctx.stopIndex);
    const rounds = pickItems(
      items.map((p) => ({ ...p, id: `particle:${p.id}` })),
      ctx.store.data.srs,
      Math.min(ROUNDS, items.length),
    );
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
