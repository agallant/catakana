import { h, sleep } from '../ui/dom';
import { hasJapaneseVoice, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { chime, levelFirst, shell, startingLives } from './common';
import { shuffle } from '../core/srs';
import { recognitionSupported, recognizeOnce, speechScore } from '../core/speech';
import { SCENES, type Reply, type Scene } from '../data/roleplay';
import { STOPS } from '../data/journey';
import { catSvg } from '../ui/cat';

export function scenesThrough(stopIndex: number): Scene[] {
  return SCENES.filter((s) => {
    const at = STOPS.findIndex((st) => st.id === s.from);
    return at >= 0 && at <= stopIndex;
  });
}

/** Stage directions like （えしゃくする） are acted, not spoken. */
export const isSpoken = (jp: string): boolean => !jp.startsWith('（');

/** Best-matching reply for what the microphone heard, if it is a clear enough match. */
export function matchSpoken(heard: string[], replies: Reply[], threshold = 0.6): Reply | undefined {
  let best: Reply | undefined;
  let bestScore = 0;
  for (const r of replies) {
    if (!isSpoken(r.jp)) continue;
    const score = Math.max(0, ...heard.map((t) => speechScore(t, [r.jp])));
    if (score > bestScore) {
      best = r;
      bestScore = score;
    }
  }
  return bestScore >= threshold ? best : undefined;
}

/** Role Play: real situations (konbini, ramen shop, ryokan, phone booking) — choose or say the natural reply. */
export const roleplayGame: GameDef = {
  id: 'roleplay',
  name: 'Role Play',
  jp: 'なりきり',
  emoji: '🎭',
  blurb: 'Konbini, ramen shop, ryokan… say the right thing at the right time.',
  kinds: ['word'],
  skill: 'speaking',
  available: (stopIndex) => stopIndex === undefined || scenesThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Role Play 🎭');
    const scenes = scenesThrough(ctx.stopIndex);
    // the least-practised scene (judged by its first turn), usually from the current level:
    // two current-tier candidates and one review, so about two plays in three stay on level
    const stopOf = (s: Scene): number => STOPS.findIndex((st) => st.id === s.from);
    const scene = levelFirst(scenes.map((s) => ({ ...s, id: `rp:${s.id}:0` })), stopOf, ctx.stopIndex, ctx.store.data.srs, 3, 2, 1)[0];
    if (!scene) return ctx.quit();
    const sceneId = scene.id.split(':')[1]!;
    const canSpeak = ctx.level >= 2 && recognitionSupported();
    const npcLook = ctx.stop.npc.look;
    let idx = 0;
    let correct = 0;
    let lives = startingLives(ctx.store.data.settings);
    sh.setLives(lives);
    const log = h('div', { class: 'convo' });
    const header = h('div', { class: 'rp-head' }, `${scene.emoji} ${scene.title}`, h('small', null, ` · talking to: ${scene.role}`));

    const next = async (): Promise<void> => {
      if (idx >= scene.turns.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: scene.turns.length });
      }
      sh.setProgress(idx, scene.turns.length);
      const turn = scene.turns[idx]!;
      // level 3: hear the other cat first, the text appears after you answer
      const npcText = h('div', { class: 'jp' }, ctx.level === 3 && isSpoken(turn.npc) && hasJapaneseVoice() ? '🔊 …' : turn.npc);
      log.appendChild(
        h('div', { class: 'convo-line npc' }, h('div', { class: 'convo-cat' }, catSvg(npcLook, 'happy', 40)), h('div', { class: 'convo-bubble' }, npcText, ctx.level === 1 ? h('small', null, turn.en) : null)),
      );
      // no Japanese voice on this device: show the line so the turn stays answerable
      if (isSpoken(turn.npc)) void speak(turn.npc, { pitch: 1.3, rate: ctx.level === 3 ? 0.95 : 0.8 }).then((spoke) => !spoke && (npcText.textContent = turn.npc));
      const why = h('div', { class: 'rp-why' }, ' ');
      const order = shuffle(turn.replies);
      let locked = false;
      const answer = async (r: Reply, button?: HTMLElement): Promise<void> => {
        if (locked) return;
        locked = true;
        const ok = r.ok;
        const right = order.find((x) => x.ok)!;
        button?.classList.add(ok ? 'right' : 'wrong');
        buttons[order.indexOf(right)]?.classList.add('right');
        chime(ok);
        ctx.store.recordAnswer(`rp:${sceneId}:${idx}`, ok);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        npcText.textContent = turn.npc;
        why.replaceChildren(h('strong', null, ok ? '⭕ ' : '❌ '), r.why, ok ? '' : ` → ${right.jp}`);
        sh.say(ok ? 'Smooth, nya!' : 'Hmm, not quite…', ok ? 'happy' : 'think');
        log.appendChild(h('div', { class: 'convo-line me' }, h('div', { class: 'convo-cat' }, catSvg(ctx.store.data.look, ok ? 'happy' : 'sad', 40)), h('div', { class: 'convo-bubble' }, h('div', { class: 'jp' }, right.jp))));
        if (isSpoken(right.jp)) await speak(right.jp, { pitch: 0.95, rate: 0.85 });
        await sleep(ok ? 900 : 2200);
        idx++;
        void next();
      };
      const buttons = order.map((r) => {
        const b = h('button', { class: 'choice text' }, h('div', { class: 'jp' }, r.jp), ctx.level === 1 ? h('small', null, r.en) : null);
        b.addEventListener('click', () => void answer(r, b));
        return b;
      });
      const mic = canSpeak
        ? h('button', {
            class: 'btn ghost',
            onClick: async (e: Event) => {
              if (locked) return;
              const btn = e.currentTarget as HTMLButtonElement;
              btn.textContent = '🎤 Listening…';
              const heard = await recognizeOnce();
              const said = matchSpoken(heard, order);
              if (said) void answer(said, buttons[order.indexOf(said)]);
              else btn.textContent = '🎤 Didn’t catch that — try again or tap';
            },
          }, '🎤 Say your reply')
        : null;
      const choices = h('div', { class: 'choices one-col' }, buttons);
      sh.body.replaceChildren(header, log, choices, ...(mic ? [mic] : []), why);
      choices.scrollIntoView({ block: 'nearest' });
    };
    sh.say(`${scene.title}! What would you say?`, 'think');
    void next();
  },
};
