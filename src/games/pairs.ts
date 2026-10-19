import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { meaning, shell, sessionItems } from './common';
import { shuffle } from '../core/srs';

interface Card {
  pairId: string;
  face: 'jp' | 'rom';
  text: string;
}

/** Memory match: flip cards to pair characters with their sounds. */
export const pairsGame: GameDef = {
  id: 'pairs',
  name: 'Neko Pairs',
  jp: 'ペア',
  emoji: '🃏',
  blurb: 'Flip the cards and match symbols with sounds.',
  kinds: ['kana', 'word'],
  skill: 'reading',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Neko Pairs 🃏');
    const nPairs = ctx.level === 1 ? 4 : ctx.level === 2 ? 6 : 8;
    const picked = sessionItems(ctx, nPairs * 2).filter((it, i, a) => a.findIndex((x) => x.id === it.id) === i).slice(0, nPairs);
    const items = picked.length >= 2 ? picked : ctx.pool.slice(0, nPairs);
    const cards: Card[] = shuffle(
      items.flatMap((it): Card[] => [
        { pairId: it.id, face: 'jp', text: it.text },
        { pairId: it.id, face: 'rom', text: meaning(it) },
      ]),
    );
    let first: { el: HTMLElement; card: Card } | null = null;
    let busy = false;
    let matched = 0;
    let mistakes = 0;
    const cols = 4;
    const grid = h('div', { class: 'pairs-grid', style: `grid-template-columns: repeat(${cols}, 1fr)` });
    cards.forEach((card) => {
      const el = h('button', { class: 'pcard' }, h('span', { class: 'pcard-back' }, '🐾'), h('span', { class: `pcard-front ${card.face === 'jp' ? 'jp' : ''}` }, card.text));
      el.addEventListener('click', async () => {
        if (busy || el.classList.contains('open') || el.classList.contains('done')) return;
        el.classList.add('open');
        sfx.tap();
        if (card.face === 'jp') {
          const it = items.find((i) => i.id === card.pairId);
          if (it) void speak(it.reading);
        }
        if (!first) {
          first = { el, card };
          return;
        }
        busy = true;
        const a = first;
        first = null;
        const ok = a.card.pairId === card.pairId && a.card.face !== card.face;
        const item = items.find((i) => i.id === card.pairId)!;
        if (ok) {
          ctx.store.recordAnswer(item.id, true);
          sfx.correct();
          sh.say('A match!', 'happy');
          a.el.classList.add('done');
          el.classList.add('done');
          matched++;
          sh.setProgress(matched, items.length);
        } else {
          mistakes++;
          const wrongItem = items.find((i) => i.id === a.card.pairId)!;
          ctx.store.recordAnswer(wrongItem.id, false);
          ctx.store.recordAnswer(item.id, false);
          sfx.wrong();
          sh.say('Remember where those are!', 'think');
          await sleep(900);
          a.el.classList.remove('open');
          el.classList.remove('open');
        }
        busy = false;
        if (matched === items.length) {
          await sleep(500);
          sh.destroy();
          const total = items.length;
          const correct = Math.max(0, Math.round(total * Math.max(0, 1 - mistakes / (total * 1.5))));
          ctx.finish({ correct, total });
        }
      });
      grid.appendChild(el);
    });
    sh.body.replaceChildren(h('p', { class: 'hint' }, 'Match each word or symbol with its meaning or sound.'), grid);
    sh.setProgress(0, items.length);
    sh.setLives(3);
  },
};
