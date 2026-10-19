import { describe, expect, it } from 'vitest';
import { EVENTS, eventFor, isDuring, seasonFor, SEASONAL_TREATS } from '../src/data/seasons';
import { SHOP } from '../src/data/shop';

describe('seasonal events', () => {
  it('finds the event for a date', () => {
    expect(eventFor(new Date(2026, 0, 1))?.id).toBe('shogatsu');
    expect(eventFor(new Date(2026, 6, 7))?.id).toBe('tanabata');
    expect(eventFor(new Date(2026, 9, 19))?.id).toBe('momiji');
    expect(eventFor(new Date(2026, 1, 20))).toBeUndefined();
  });
  it('maps months to seasons', () => {
    expect(seasonFor(new Date(2026, 3, 10)).id).toBe('spring');
    expect(seasonFor(new Date(2026, 7, 10)).id).toBe('summer');
    expect(seasonFor(new Date(2026, 9, 10)).id).toBe('autumn');
    expect(seasonFor(new Date(2026, 0, 10)).id).toBe('winter');
  });
  it('events do not overlap and treats have unique ids', () => {
    const owner = new Map<string, string>();
    for (let t = new Date(2028, 0, 1); t.getFullYear() === 2028; t.setDate(t.getDate() + 1)) {
      const hits = EVENTS.filter((e) => isDuring(t, e));
      expect(hits.length).toBeLessThanOrEqual(1);
      if (hits[0]) owner.set(hits[0].id, 'seen');
    }
    expect(owner.size).toBe(EVENTS.length);
    const ids = [...SEASONAL_TREATS, ...SHOP].map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
