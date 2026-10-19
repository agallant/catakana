import { describe, expect, it } from 'vitest';
import { STORIES } from '../src/data/stories';
import { STOP_BY_ID } from '../src/data/journey';
import { readingOf } from '../src/screens/explore';
import { storiesThrough } from '../src/games/story';

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
});
