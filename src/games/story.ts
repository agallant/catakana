import { h, ruby, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { chime, shell } from './common';
import { shuffle } from '../core/srs';
import { STORIES, type Story } from '../data/stories';
import { STOPS } from '../data/journey';
import { readingOf } from '../screens/explore';

const stopOf = (s: Story): number => STOPS.findIndex((st) => st.id === s.from);

/** Stories unlocked by stop `stopIndex` (every story whose stop is on the route up to there). */
export function storiesThrough(stopIndex: number): Story[] {
  return STORIES.filter((s) => {
    const at = stopOf(s);
    return at >= 0 && at <= stopIndex;
  });
}

/**
 * The story to read next: the least-read one, and among those the one from the latest stop on the route.
 * Expects stories from `storiesThrough`, so every story's stop is on the route.
 */
export function nextStory(stories: Story[], srs: Record<string, { seen?: number } | undefined>): Story | undefined {
  const seen = (s: Story): number => srs[`story:${s.id}`]?.seen ?? 0;
  return [...stories].sort((a, b) => seen(a) - seen(b) || stopOf(b) - stopOf(a))[0];
}

/** Story Time: read a short passage (with furigana), then answer questions about it. */
export const storyGame: GameDef = {
  id: 'story',
  name: 'Story Time',
  jp: 'よみもの',
  emoji: '📖',
  blurb: 'Read a short cat story and answer questions.',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || storiesThrough(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Story Time 📖');
    const all = storiesThrough(ctx.stopIndex);
    // newest unread story first, else the least-practised one
    const story = nextStory(all, ctx.store.data.srs);
    if (!story) return ctx.quit();
    // level 1: furigana on everything; 2: learner's setting; 3: no furigana
    const mode = ctx.level === 1 ? 'always' : ctx.level === 3 ? 'off' : ctx.store.data.settings.furigana;
    let correct = 0;
    const passage = h(
      'article',
      { class: 'story' },
      h('h2', null, `${story.emoji} ${story.title}`),
      story.text.map((p) => h('p', { class: 'story-p' }, ruby(p, mode))),
      h('button', { class: 'btn ghost small', onClick: () => void speak(story.text.map(readingOf).join('。')) }, '🔊 Read aloud'),
    );
    const qs = story.questions;
    const ask = (i: number): void => {
      sh.setProgress(i, qs.length);
      if (i >= qs.length) {
        ctx.store.recordAnswer(`story:${story.id}`, correct === qs.length);
        sh.destroy();
        return ctx.finish({ correct, total: qs.length });
      }
      const q = qs[i]!;
      const order = shuffle(q.options.map((text, k) => ({ text, k })));
      let locked = false;
      const buttons = order.map((o) => {
        const b = h('button', { class: 'choice text' }, o.text);
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          const ok = o.k === q.answer;
          if (ok) correct++;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons[order.findIndex((x) => x.k === q.answer)]!.classList.add('right');
          chime(ok);
          sh.say(ok ? 'Good reading!' : 'Check the story again!', ok ? 'happy' : 'think');
          await sleep(ok ? 700 : 1500);
          ask(i + 1);
        });
        return b;
      });
      qBox.replaceChildren(h('div', { class: 'big-en' }, q.q), h('div', { class: 'choices one-col' }, buttons));
    };
    const qBox = h('div', { class: 'story-q' });
    sh.body.replaceChildren(passage, qBox);
    sh.setLives(3);
    sh.say('Read the story, then answer!', 'think');
    ask(0);
  },
};
