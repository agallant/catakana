import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { chime, levelFirst, shell } from './common';
import { shuffle } from '../core/srs';
import { CONVERSATIONS, type Conversation } from '../data/conversations';
import { catSvg } from '../ui/cat';

export function conversationsThrough(index: number): Conversation[] {
  return CONVERSATIONS.filter((c) => c.from <= index);
}

/** Café Chat: listen to a short conversation, then answer a question about it. */
export const cafeGame: GameDef = {
  id: 'cafe',
  name: 'Café Chat',
  jp: 'かいわ',
  emoji: '☕',
  blurb: 'Listen to cats chatting, then answer a question.',
  kinds: ['word'],
  skill: 'listening',
  available: (stopIndex) => stopIndex === undefined || conversationsThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Café Chat ☕');
    const all = conversationsThrough(ctx.stopIndex).map((c) => ({ ...c, id: `c:${c.id}` }));
    // two from this stop's level when there are enough, plus one for review
    const rounds = levelFirst(all, (c) => c.from, ctx.stopIndex, ctx.store.data.srs, 3, 2);
    let idx = 0;
    let correct = 0;
    sh.setLives(3);
    const npcLook = ctx.stop.npc.look;
    const me = ctx.store.data.look;

    const next = async (): Promise<void> => {
      if (idx >= rounds.length) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const conv = rounds[idx]!;
      // level 1: read along + English; level 2: Japanese text only; level 3: audio only
      const showJa = ctx.level <= 2;
      const showEn = ctx.level === 1;
      const chat = h('div', { class: 'convo' });
      const qBox = h('div', { class: 'choices one-col' });
      let playing = false;
      // set once the round is answered so an in-flight playback loop stops speaking
      let ended = false;
      const play = async (): Promise<void> => {
        if (playing || ended) return;
        playing = true;
        chat.replaceChildren();
        for (const line of conv.lines) {
          if (ended) break;
          const bubble = h(
            'div',
            { class: `convo-line ${line.who}` },
            h('div', { class: 'convo-cat' }, catSvg(line.who === 'me' ? me : npcLook, 'happy', 40)),
            h('div', { class: 'convo-bubble' }, showJa ? h('div', { class: 'jp' }, line.jp) : h('div', null, '🔊 …'), showEn ? h('small', null, line.en) : null),
          );
          chat.appendChild(bubble);
          const spoke = await speak(line.jp, { pitch: line.who === 'npc' ? 1.35 : 0.95, rate: ctx.level === 3 ? 0.95 : 0.8 });
          // no voice available: show the line so the round is still answerable
          if (!spoke && !showJa) bubble.querySelector('.convo-bubble')?.replaceChildren(h('div', { class: 'jp' }, line.jp));
          if (ended) break;
          await sleep(250);
        }
        playing = false;
      };
      const order = shuffle(conv.options.map((text, k) => ({ text, k })));
      let locked = false;
      const buttons = order.map((o) => {
        const b = h('button', { class: 'choice text' }, o.text);
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          ended = true;
          const ok = o.k === conv.answer;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons[order.findIndex((x) => x.k === conv.answer)]!.classList.add('right');
          ctx.store.recordAnswer(conv.id, ok);
          if (ok) correct++;
          chime(ok);
          sh.flash(ok);
          sh.say(ok ? 'You understood!' : 'Listen again next time!', ok ? 'happy' : 'sad');
          // reveal the transcript after answering
          chat.replaceChildren(...conv.lines.map((l) => h('div', { class: `convo-line ${l.who}` }, h('div', { class: 'convo-bubble' }, h('div', { class: 'jp' }, l.jp), h('small', null, l.en)))));
          await sleep(ok ? 1400 : 2600);
          idx++;
          void next();
        });
        return b;
      });
      qBox.replaceChildren(...buttons);
      sh.body.replaceChildren(
        h('div', { class: 'prompt' }, h('div', { class: 'prompt-romaji' }, `☕ ${conv.title}`)),
        chat,
        h('button', { class: 'btn ghost small', onClick: () => void play() }, '🔊 Replay'),
        h('div', { class: 'big-en' }, conv.q),
        qBox,
      );
      await play();
    };
    sh.say('Listen to the conversation!', 'think');
    void next();
  },
};
