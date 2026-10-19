import { fill, h, sleep } from '../ui/dom';
import { speak, hasJapaneseVoice, speechSupported } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { distractors, recordAnswer, sessionItems, shell } from './common';
import { shuffle } from '../core/srs';

/** Listening: hear a sound (text-to-speech), pick what was said. */
export const listenGame: GameDef = {
  id: 'listen',
  name: 'Whisker Ears',
  jp: 'ききとり',
  emoji: '👂',
  blurb: 'Listen closely and pick what you heard.',
  kinds: ['kana', 'word'],
  skill: 'listening',
  available: () => speechSupported(),
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Whisker Ears 👂');
    const items = sessionItems(ctx);
    const options = ctx.level === 1 ? 3 : 4;
    let idx = 0;
    let correct = 0;
    let lives = 3;
    sh.setLives(lives);

    const warn = !hasJapaneseVoice()
      ? h('p', { class: 'note' }, '⚠️ No Japanese voice detected on this device. Install a Japanese text-to-speech voice in your system settings for audio.')
      : null;

    const next = async (): Promise<void> => {
      if (idx >= items.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: items.length });
      }
      sh.setProgress(idx, items.length);
      const item = items[idx]!;
      const choices = shuffle([item, ...distractors(ctx, item, options - 1)]);
      let locked = false;
      const play = (slow = false): void => void speak(item.reading, { rate: slow ? 0.55 : 0.85 });
      const buttons = choices.map((c: Item) => {
        const b = h('button', { class: 'choice jp' }, c.text);
        b.addEventListener('click', () => {
          if (locked) return;
          locked = true;
          const ok = c.id === item.id;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons.find((x) => x.textContent === item.text)?.classList.add('right');
          recordAnswer(ctx, item, ok, sh);
          if (ok) correct++;
          else {
            lives--;
            sh.setLives(lives);
          }
          void sleep(ok ? 700 : 1500).then(() => {
            idx++;
            void next();
          });
        });
        return b;
      });
      fill(
        sh.body,
        warn,
        h(
          'div',
          { class: 'listen-row' },
          h('button', { class: 'btn big primary', onClick: () => play(), 'aria-label': 'Play sound' }, '🔊 Play'),
          h('button', { class: 'btn ghost', onClick: () => play(true), 'aria-label': 'Play slowly' }, '🐢 Slow'),
        ),
        h('div', { class: 'choices' }, ...buttons),
      );
      await sleep(250);
      play();
    };
    sh.say('What did you hear?', 'think');
    void next();
  },
};
