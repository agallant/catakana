import { h, ruby, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { KEIGO, keigoDistractors, keigoRounds, type KeigoRound } from '../data/keigo';
import { STOPS } from '../data/journey';
import { readingOf } from '../screens/explore';

export function keigoThrough(stopIndex: number) {
  return KEIGO.filter((v) => {
    const at = STOPS.findIndex((s) => s.id === v.from);
    return at >= 0 && at <= stopIndex;
  });
}

const ROUNDS = 8;

/** Ryokan Manners: help at a cat inn by picking respectful (sonkeigo) or humble (kenjōgo) verbs. */
export const keigoGame: GameDef = {
  id: 'keigo',
  name: 'Ryokan Manners',
  jp: 'おもてなし',
  emoji: '🙇',
  blurb: 'Speak politely at the inn: respectful verbs for guests, humble ones for yourself.',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || keigoThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Ryokan Manners 🙇');
    const verbs = keigoThrough(ctx.stopIndex);
    const all = keigoRounds(verbs);
    const rounds = pickItems(all, ctx.store.data.srs, Math.min(ROUNDS, all.length));
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
      const r: KeigoRound = rounds[idx]!;
      const options = shuffle([r.use.form, ...keigoDistractors(r, ctx.level === 1 ? 2 : 3, shuffle(verbs))]);
      const filled = r.use.ex.replace('＿＿', r.use.form);
      let locked = false;
      const reveal = h('div', { class: 'keigo-reveal' }, ' ');
      const buttons = options.map((o) => {
        const b = h('button', { class: 'choice text jp' }, ruby(o, mode));
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          const ok = o === r.use.form;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons[options.indexOf(r.use.form)]!.classList.add('right');
          recordAnswer(ctx, { id: r.id, kind: 'word', text: r.use.form, reading: readingOf(r.use.form), romaji: '', en: r.verb.en }, ok, sh);
          if (ok) correct++;
          else {
            lives--;
            sh.setLives(lives);
          }
          reveal.replaceChildren(h('div', { class: 'jp' }, ruby(filled, 'always')), h('div', { class: 'muted' }, r.use.en));
          void speak(readingOf(filled));
          await sleep(ok ? 1300 : 2400);
          idx++;
          next();
        });
        return b;
      });
      // Level 3 hides who is acting: work it out from the sentence.
      const chip =
        ctx.level === 3
          ? null
          : h('div', { class: 'form-chip' }, r.dir === 'sonkei' ? '🧳 Guest acts → respectful 尊敬語' : '🐱 I act → humble 謙譲語');
      const prompt = h(
        'div',
        { class: 'prompt' },
        h('div', { class: 'prompt-emoji' }, '🏮'),
        h('div', { class: 'prompt-jp jp keigo-ex' }, ruby(r.use.ex, mode)),
        h('div', { class: 'prompt-romaji' }, h('span', { class: 'jp' }, ruby(r.verb.plain, mode)), ` · ${r.verb.en}`),
        chip,
      );
      sh.body.replaceChildren(prompt, h('div', { class: 'choices one-col' }, buttons), reveal);
    };
    sh.say('A guest! Mind your manners, nya.', 'think');
    next();
  },
};
