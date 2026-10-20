import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { chime, levelFirst, shell } from './common';
import { pickItems, shuffle } from '../core/srs';
import { PHRASES, type Phrase } from '../data/phrases';
import { recognitionSupported, recognizeOnce, recordClip, speechScore } from '../core/speech';

export function phrasesThrough(index: number): Phrase[] {
  return PHRASES.filter((p) => p.from <= index);
}

/** Shadow Cat: hear a phrase, say it back. Scored by speech recognition when available, else self-rated. */
export const shadowGame: GameDef = {
  id: 'shadow',
  name: 'Shadow Cat',
  jp: 'シャドーイング',
  emoji: '🎙️',
  blurb: 'Hear it, say it! Practice speaking useful phrases.',
  kinds: ['word'],
  skill: 'speaking',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Shadow Cat 🎙️');
    const phrases = phrasesThrough(ctx.stopIndex);
    // phrases first, topped up with words from the pool
    const words = ctx.pool.filter((i) => i.kind === 'word').map((w) => ({ id: w.id, jp: w.text, kana: w.reading, en: w.en ?? '', emoji: w.emoji ?? '', from: 0 }) as Phrase);
    // up to three phrases from this stop's level, one for review, and one word
    const picked = levelFirst(phrases, (p) => p.from, ctx.stopIndex, ctx.store.data.srs, 4, 3);
    const rounds = shuffle([...picked, ...pickItems(words, ctx.store.data.srs, 1)]).slice(0, 5);
    const canRecognize = recognitionSupported();
    let idx = 0;
    let correct = 0;
    sh.setLives(3);

    const next = async (): Promise<void> => {
      if (idx >= rounds.length) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const p = rounds[idx]!;
      let myClip: string | null = null;
      let decided = false;
      const status = h('div', { class: 'hint', 'aria-live': 'polite' }, canRecognize ? 'Tap 🎙️ and say it out loud.' : 'Tap 🎙️ to record yourself, then compare.');
      const mine = h('div', { class: 'row' });
      const decide = async (ok: boolean): Promise<void> => {
        if (decided) return;
        decided = true;
        ctx.store.recordAnswer(p.id, ok);
        if (ok) correct++;
        chime(ok);
        sh.flash(ok);
        sh.say(ok ? 'じょうず！ (Great!)' : 'Keep practicing — you’ll get it!', ok ? 'happy' : 'sad');
        if (myClip) URL.revokeObjectURL(myClip);
        await sleep(1200);
        idx++;
        void next();
      };
      const selfRate = h(
        'div',
        { class: 'row' },
        h('button', { class: 'btn primary', onClick: () => void decide(true) }, '😺 Sounded right'),
        h('button', { class: 'btn ghost', onClick: () => void decide(false) }, '😿 Not yet'),
      );
      let busy = false;
      const record = async (): Promise<void> => {
        if (decided || busy) return;
        busy = true;
        try {
          await listenOnce();
        } finally {
          busy = false;
        }
      };
      const listenOnce = async (): Promise<void> => {
        status.textContent = '🔴 Listening… speak now!';
        if (canRecognize) {
          const heard = await recognizeOnce();
          const score = Math.max(0, ...heard.map((t) => speechScore(t, [p.jp, p.kana, ...(p.alts ?? [])])));
          if (heard.length) {
            status.textContent = `I heard: “${heard[0]}” — ${Math.round(score * 100)}% match`;
            if (score >= (ctx.level === 3 ? 0.8 : 0.6)) return void decide(true);
            status.textContent += '. Try again, or rate yourself.';
          } else {
            status.textContent = 'I couldn’t hear that (speech recognition may need a connection). Rate yourself below.';
          }
          mine.replaceChildren(selfRate);
          return;
        }
        const clip = await recordClip(Math.max(2500, p.kana.length * 350));
        if (decided) {
          if (clip) URL.revokeObjectURL(clip);
          return;
        }
        if (myClip) URL.revokeObjectURL(myClip);
        myClip = clip;
        if (!myClip) {
          status.textContent = 'Microphone unavailable — say it out loud, then rate yourself.';
          mine.replaceChildren(selfRate);
          return;
        }
        status.textContent = 'Compare your voice with the cat’s:';
        const audio = h('audio', { src: myClip });
        mine.replaceChildren(
          h('button', { class: 'btn ghost', onClick: () => void audio.play() }, '▶️ Me'),
          h('button', { class: 'btn ghost', onClick: () => void speak(p.kana) }, '🔊 Model'),
        );
        mine.after(selfRate);
      };
      sh.body.replaceChildren(
        h('div', { class: 'prompt' }, h('div', { class: 'prompt-emoji' }, p.emoji), h('div', { class: 'phrase-jp jp' }, p.jp), h('div', { class: 'prompt-romaji' }, p.en)),
        h(
          'div',
          { class: 'row' },
          h('button', { class: 'btn ghost', onClick: () => void speak(p.kana) }, '🔊 Listen'),
          h('button', { class: 'btn ghost', onClick: () => void speak(p.kana, { rate: 0.55 }) }, '🐢 Slow'),
          h('button', { class: 'btn primary big-mic', onClick: () => void record(), 'aria-label': 'Record' }, '🎙️'),
        ),
        status,
        mine,
      );
      await speak(p.kana);
    };
    sh.say('Listen, then repeat like a shadow!', 'think');
    void next();
  },
};
