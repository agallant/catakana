import { describe, expect, it } from 'vitest';
import { STORIES } from '../src/data/stories';
import { STOP_BY_ID } from '../src/data/journey';
import { readingOf } from '../src/screens/explore';
import { nextStory, storiesThrough } from '../src/games/story';

describe('stories', () => {
  it('are well formed', () => {
    expect(new Set(STORIES.map((s) => s.id)).size).toBe(STORIES.length);
    for (const s of STORIES) {
      expect(STOP_BY_ID.has(s.from), s.id).toBe(true);
      for (const p of s.text) expect(readingOf(p)).not.toMatch(/[{}|]/);
      for (const q of s.questions) expect(q.answer).toBeLessThan(q.options.length);
    }
  });
  it('unlock along the journey', () => {
    expect(storiesThrough(0)).toHaveLength(0);
    expect(storiesThrough(999)).toHaveLength(STORIES.length);
  });
  it('end the journey with the maneki-neko legend at Gōtoku-ji', () => {
    expect(STORIES.find((s) => s.from === 'gotokuji')?.id).toBe('gotokuji-maneki');
    const n1 = STORIES.filter((s) => STOP_BY_ID.get(s.from)?.tier === 'N1');
    expect(n1.length).toBeGreaterThanOrEqual(6);
  });
  it('offer the newest unread story on the route first', () => {
    const all = storiesThrough(999);
    // nothing read yet: the finale, whatever its position in the list
    expect(nextStory(all, {})?.id).toBe('gotokuji-maneki');
    // once it is read, the next-latest unread one
    expect(nextStory(all, { 'story:gotokuji-maneki': { seen: 1 } })?.from).toBe('amami');
    // and it doesn't depend on the list's order: reversed, the route still decides
    expect(nextStory([...all].reverse(), {})?.id).toBe('gotokuji-maneki');
    expect(nextStory([...all].reverse(), { 'story:gotokuji-maneki': { seen: 1 } })?.from).toBe('amami');
  });
});

import { compoundsThrough } from '../src/games/bento';
import { STOPS } from '../src/data/journey';
describe('kanji bento', () => {
  it('finds compounds once their kanji are taught', () => {
    expect(compoundsThrough(0)).toHaveLength(0);
    const all = compoundsThrough(STOPS.length - 1);
    expect(all.length).toBeGreaterThan(10);
    expect(all.map((w) => w.kanji)).toContain('電車');
  });
});
