import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { distractors, displayPrompt, meaning, recordAnswer, sessionItems, shell, startingLives } from './common';
import { shuffle } from '../core/srs';

/** Kaiten-sushi quiz: pick the right plate off the belt. */
export const sushiGame: GameDef = {
  id: 'sushi',
  name: 'Sushi Belt',
  jp: 'かいてんずし',
  emoji: '🍣',
  blurb: 'Grab the right plate as it rolls by!',
  kinds: ['kana', 'word', 'kanji'],
  skill: 'reading',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Sushi Belt 🍣');
    const items = sessionItems(ctx);
    const options = ctx.level === 1 ? 3 : ctx.level === 2 ? 4 : 5;
    let idx = 0;
    let correct = 0;
    let lives = startingLives(ctx.store.data.settings);
    sh.setLives(lives);
    let timer: number | undefined;

    const next = async (): Promise<void> => {
      window.clearTimeout(timer);
      if (idx >= items.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: items.length });
      }
      sh.setProgress(idx, items.length);
      const item = items[idx]!;
      // direction: level 1 jp→romaji, 2 mixes, 3 romaji/english→jp too
      const reverse = ctx.level >= 2 && Math.random() < (ctx.level === 3 ? 0.6 : 0.35);
      // Words are matched with their meaning (not romaji); kana with their sound.
      const dist = distractors(ctx, item, options - 1, reverse ? (i) => i.text : meaning);
      const choices = shuffle([item, ...dist]);

      const label = (c: Item): string => (reverse ? c.text : meaning(c));
      const prompt = reverse
        ? h('div', { class: 'prompt prompt-kana' }, h('div', { class: item.kind === 'kana' ? 'prompt-jp' : 'prompt-emoji' }, item.kind === 'kana' ? item.romaji : item.emoji ?? ''), item.kind === 'kana' ? null : h('div', { class: 'prompt-romaji' }, item.en ?? ''))
        : displayPrompt(item, { romaji: ctx.hints && item.kind === 'word', furigana: ctx.store.data.settings.furigana });
      const listen = h('button', { class: 'btn small ghost', onClick: () => void speak(item.reading), 'aria-label': 'Hear it' }, '🔊');

      let locked = false;
      const plates = choices.map((c) => {
        const btn = h(
          'button',
          { class: `plate ${reverse ? 'jp' : ''} ${!reverse && item.kind !== 'kana' ? 'plate-wide' : ''}`, 'data-id': c.id },
          h('span', { class: 'plate-food' }, '🍣'),
          h('span', { class: 'plate-label' }, label(c)),
        );
        btn.addEventListener('click', () => {
          if (locked) return;
          locked = true;
          window.clearTimeout(timer);
          const ok = c.id === item.id;
          btn.classList.add(ok ? 'right' : 'wrong');
          if (!ok) plates.find((p) => p.dataset.id === item.id)?.classList.add('right');
          recordAnswer(ctx, item, ok, sh);
          if (ok) correct++;
          else {
            lives--;
            sh.setLives(lives);
          }
          void speak(item.reading);
          void sleep(ok ? 650 : 1500).then(() => {
            idx++;
            void next();
          });
        });
        return btn;
      });

      const belt = h('div', { class: `belt level-${ctx.level}` }, ...plates);
      sh.body.replaceChildren(h('div', { class: 'prompt-row' }, prompt, listen), belt);

      if (ctx.level === 3) {
        // timed: slow bar then auto-fail
        const bar = h('div', { class: 'timer' }, h('div', { class: 'timer-fill' }));
        sh.body.appendChild(bar);
        timer = window.setTimeout(() => {
          if (locked) return;
          locked = true;
          plates.find((p) => p.dataset.id === item.id)?.classList.add('right');
          recordAnswer(ctx, item, false, sh);
          lives--;
          sh.setLives(lives);
          void sleep(1200).then(() => {
            idx++;
            void next();
          });
        }, 7000);
      }
      sfx.tap();
    };
    sh.say('Pick the matching plate!', 'think');
    void next();
  },
};
