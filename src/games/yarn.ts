import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, sessionItems, shell } from './common';
import { shuffle } from '../core/srs';
import { splitKana, ALL_KANA } from '../data/kana';

/** Build words from kana tiles, guided by a picture and English clue. */
export const yarnGame: GameDef = {
  id: 'yarn',
  name: 'Yarn Words',
  jp: 'ことばづくり',
  emoji: '🧶',
  blurb: 'Roll the kana tiles into the right word.',
  kinds: ['word'],
  skill: 'writing',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Yarn Words 🧶');
    const items = sessionItems(ctx, 8, ['word']).filter((w) => splitKana(w.reading).length <= 7);
    if (!items.length) return ctx.quit();
    let idx = 0;
    let correct = 0;
    sh.setLives(3);

    const next = async (): Promise<void> => {
      if (idx >= items.length) {
        sh.destroy();
        return ctx.finish({ correct, total: items.length });
      }
      sh.setProgress(idx, items.length);
      const item = items[idx]!;
      const target = splitKana(item.reading);
      const decoyCount = ctx.level === 1 ? 0 : ctx.level === 2 ? 2 : 4;
      const script = item.script ?? (/[゠-ヿ]/.test(item.reading) ? 'katakana' : 'hiragana');
      const decoys = shuffle(ALL_KANA.filter((k) => k.script === script && k.char.length === 1 && !target.includes(k.char)))
        .slice(0, decoyCount)
        .map((k) => k.char);
      const tiles = shuffle([...target, ...decoys].map((t, i) => ({ t, i })));
      const answer: { t: string; i: number }[] = [];
      let locked = false;

      const slots = h('div', { class: 'slots' });
      const tray = h('div', { class: 'tray' });
      const draw = (): void => {
        slots.replaceChildren(
          ...target.map((_, k) => {
            const a = answer[k];
            const el = h('button', { class: `slot jp ${a ? 'filled' : ''}` }, a ? a.t : '');
            if (a) el.addEventListener('click', () => { if (!locked) { answer.splice(k, 1); draw(); sfx.tap(); } });
            return el;
          }),
        );
        tray.replaceChildren(
          ...tiles.map((tile) => {
            const used = answer.includes(tile);
            const b = h('button', { class: `tile jp ${used ? 'used' : ''}`, disabled: used }, tile.t);
            b.addEventListener('click', () => {
              if (locked || answer.length >= target.length) return;
              answer.push(tile);
              sfx.tap();
              draw();
              if (answer.length === target.length) void check();
            });
            return b;
          }),
        );
      };
      const check = async (): Promise<void> => {
        locked = true;
        const ok = answer.map((a) => a.t).join('') === target.join('');
        recordAnswer(ctx, item, ok, sh);
        if (ok) correct++;
        slots.classList.add(ok ? 'right' : 'wrong');
        if (!ok) {
          slots.replaceChildren(...target.map((t) => h('div', { class: 'slot jp filled right' }, t)));
        }
        void speak(item.reading);
        await sleep(ok ? 900 : 1700);
        idx++;
        void next();
      };

      sh.body.replaceChildren(
        h('div', { class: 'prompt' }, h('div', { class: 'prompt-emoji' }, item.emoji ?? '❓'), h('div', { class: 'prompt-romaji' }, item.en ?? ''), ctx.level === 1 ? h('div', { class: 'prompt-romaji' }, item.romaji) : null),
        slots,
        tray,
        h('button', { class: 'btn ghost small', onClick: () => { answer.length = 0; draw(); } }, '↺ Reset'),
      );
      draw();
    };
    sh.say('Spell the word!', 'think');
    void next();
  },
};
