import { describe, expect, it } from 'vitest';
import { ONO_BLANK, ONOMATOPOEIA } from '../src/data/onomatopoeia';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { meaningChoices, onoThrough } from '../src/games/onomatopoeia';

const words = new Set(ONOMATOPOEIA.map((o) => o.word));

describe('onomatopoeia', () => {
  it('have unique ids and words, one blank, valid stops and three wrong words from the list', () => {
    expect(new Set(ONOMATOPOEIA.map((o) => o.id)).size).toBe(ONOMATOPOEIA.length);
    expect(words.size).toBe(ONOMATOPOEIA.length);
    expect(new Set(ONOMATOPOEIA.map((o) => o.en)).size).toBe(ONOMATOPOEIA.length);
    for (const o of ONOMATOPOEIA) {
      expect(o.ex.split(ONO_BLANK).length - 1, o.id).toBe(1);
      expect(STOP_BY_ID.has(o.from), o.id).toBe(true);
      expect(o.wrong.length, o.id).toBeGreaterThanOrEqual(3);
      expect(new Set(o.wrong).size, o.id).toBe(o.wrong.length);
      expect(o.wrong, o.id).not.toContain(o.word);
      for (const w of o.wrong) expect(words.has(w), `${o.id}: ${w}`).toBe(true);
    }
  });
  it('offer distinct meaning choices including the answer, even early on', () => {
    const early = onoThrough(STOPS.findIndex((s) => s.id === 'aomori'));
    expect(early.length).toBeGreaterThan(0);
    for (const n of [2, 3]) {
      const c = meaningChoices(early[0]!, early, n);
      expect(c).toHaveLength(n + 1);
      expect(c).toContain(early[0]);
      expect(new Set(c.map((x) => x.id)).size).toBe(n + 1);
    }
  });
  it('unlock along the route', () => {
    expect(onoThrough(STOPS.findIndex((s) => s.id === 'hakodate'))).toHaveLength(0);
    expect(onoThrough(STOPS.length - 1)).toHaveLength(ONOMATOPOEIA.length);
  });
});
