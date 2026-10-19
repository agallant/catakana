import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { decoyChunk, sentencesThrough } from '../core/sentences';
import { firstStopOfTier } from '../core/curriculum';

/** Couple the train cars in the right order to build a Japanese sentence. */
export const trainGame: GameDef = {
  id: 'train',
  name: 'Word Train',
  jp: 'ことばれっしゃ',
  emoji: '🚂',
  blurb: 'Link the word-cars into a correct sentence.',
  kinds: ['word'],
  skill: 'writing',
  available: (stopIndex) => stopIndex === undefined || (stopIndex >= firstStopOfTier('N5') && sentencesThrough(stopIndex).length >= 3),
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Word Train 🚂');
    const all = sentencesThrough(ctx.stopIndex);
    const own = all.filter((s) => s.stop === ctx.stop.id);
    const records = ctx.store.data.srs;
    const picked = [...pickItems(own, records, 3), ...pickItems(all.filter((s) => s.stop !== ctx.stop.id), records, 3)];
    const rounds = shuffle(picked.length ? picked : all).slice(0, 6);
    let idx = 0;
    let correct = 0;
    sh.setLives(3);

    const next = (): void => {
      if (idx >= rounds.length) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const sen = rounds[idx]!;
      const listening = ctx.level === 3;
      const decoy = ctx.level >= 2 ? decoyChunk(sen.chunks) : null;
      const cars = shuffle([...sen.chunks, ...(decoy ? [decoy] : [])].map((t, i) => ({ t, i })));
      const placed: { t: string; i: number }[] = [];
      let locked = false;
      const track = h('div', { class: 'track' });
      const yard = h('div', { class: 'tray' });
      const full = sen.chunks.join('');
      const draw = (): void => {
        track.replaceChildren(
          h('span', { class: 'loco', 'aria-hidden': 'true' }, '🚂'),
          ...placed.map((p, k) => {
            const b = h('button', { class: 'car jp' }, p.t);
            b.addEventListener('click', () => {
              if (locked) return;
              placed.splice(k, 1);
              sfx.tap();
              draw();
            });
            return b;
          }),
        );
        yard.replaceChildren(
          ...cars.map((c) => {
            const used = placed.includes(c);
            const b = h('button', { class: `car jp ${used ? 'used' : ''}`, disabled: used }, c.t);
            b.addEventListener('click', () => {
              if (locked || placed.length >= sen.chunks.length) return;
              placed.push(c);
              sfx.tap();
              draw();
              if (placed.length === sen.chunks.length) void check();
            });
            return b;
          }),
        );
      };
      const check = async (): Promise<void> => {
        locked = true;
        const ok = placed.map((p) => p.t).join('') === full;
        ctx.store.recordAnswer(sen.id, ok);
        if (ok) correct++;
        (ok ? sfx.correct : sfx.wrong)();
        sh.flash(ok);
        sh.say(ok ? 'All aboard! 🚃' : 'The cars got mixed up!', ok ? 'happy' : 'sad');
        track.classList.add(ok ? 'right' : 'wrong', 'go');
        if (!ok) answer.textContent = `✔ ${sen.chunks.join(' ')}`;
        await speak(full);
        await sleep(ok ? 400 : 1600);
        idx++;
        next();
      };
      const answer = h('div', { class: 'hint jp' });
      sh.body.replaceChildren(
        listening
          ? h('div', { class: 'prompt' }, h('button', { class: 'btn primary', onClick: () => void speak(full) }, '🔊 Listen'), h('div', { class: 'prompt-romaji' }, 'Build what you hear'))
          : h('div', { class: 'prompt' }, h('div', { class: 'prompt-romaji big-en' }, sen.en)),
        track,
        answer,
        yard,
        h('button', { class: 'btn ghost small', onClick: () => { if (!locked) { placed.length = 0; draw(); } } }, '↺ Uncouple'),
      );
      draw();
      if (listening) void speak(full);
    };
    sh.say('Build the sentence, verb goes last!', 'think');
    next();
  },
};
