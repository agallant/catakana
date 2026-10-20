import { describe, expect, it } from 'vitest';
import { levelFirst } from '../src/games/common';
import { STOPS } from '../src/data/journey';
import { CONVERSATIONS } from '../src/data/conversations';
import { conversationsThrough } from '../src/games/cafe';

const tierOf = (i: number) => STOPS[i]!.tier;

describe('levelFirst', () => {
  it('leads with the current level, then reviews, without repeats', () => {
    const last = STOPS.length - 1;
    for (let run = 0; run < 20; run++) {
      const picked = levelFirst(conversationsThrough(last), (c) => c.from, last, {}, 3, 2);
      expect(picked).toHaveLength(3);
      expect(new Set(picked.map((c) => c.id)).size).toBe(3);
      expect(picked.filter((c) => tierOf(c.from) === tierOf(last)).length).toBeGreaterThanOrEqual(2);
    }
  });
  it('fills from the current level when there is nothing earlier to review', () => {
    const items = CONVERSATIONS.filter((c) => c.from === 0);
    expect(levelFirst(items, (c) => c.from, 0, {}, 3, 2)).toHaveLength(Math.min(3, items.length));
  });
  it('returns everything when fewer items than the round size exist', () => {
    const two = CONVERSATIONS.slice(0, 2);
    expect(levelFirst(two, (c) => c.from, STOPS.length - 1, {}, 5, 3)).toHaveLength(2);
  });
});
