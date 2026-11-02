import { describe, expect, it } from 'vitest';
import { applyPlacement, placementStart } from '../src/screens/placement';
import { Store } from '../src/core/store';
import { STOPS } from '../src/data/journey';
import { KANA_BY_ID } from '../src/data/kana';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('placement', () => {
  it('marks earlier stops done and their kana as known', () => {
    const s = new Store(mem());
    const start = placementStart(8, 8);
    applyPlacement(s, start);
    expect(s.data.started).toBe(true);
    for (const st of STOPS.slice(0, start)) {
      expect(s.data.stops[st.id], st.id).toBeGreaterThanOrEqual(1);
      expect(s.data.stamps).toContain(st.id);
    }
    expect(s.data.stops[STOPS[start]!.id]).toBeUndefined();
    expect(s.data.introduced).toContain('h:あ');
    expect(s.data.introduced).toContain('k:ア');
    // known kana count as reviewed twice, so they show up as known rather than new
    expect(s.data.srs['h:あ']).toMatchObject({ seen: 2, correct: 2 });
    expect(s.data.srs['k:ア']).toMatchObject({ seen: 2, correct: 2 });
  });
  it('never takes progress away when taken again later', () => {
    const s = new Store(mem());
    s.update((d) => {
      d.stops.tokyo = 3;
      d.stops.yokohama = 2;
      d.introduced = ['h:あ'];
      d.srs['h:あ'] = { box: 4, due: 123, seen: 9, correct: 9, wrong: 0, last: 100 };
    });
    const before = JSON.stringify(s.data.srs['h:あ']);
    applyPlacement(s, placementStart(8, 2));
    expect(s.data.stops.tokyo).toBe(3);
    expect(s.data.stops.yokohama).toBe(2);
    expect(JSON.stringify(s.data.srs['h:あ'])).toBe(before);
    const snapshot = JSON.stringify(s.data);
    applyPlacement(s, placementStart(8, 2));
    expect(JSON.stringify(s.data)).toBe(snapshot);
  });
  it('knows the kana ids it introduces', () => {
    expect(KANA_BY_ID.has('h:あ')).toBe(true);
    expect(KANA_BY_ID.has('k:ア')).toBe(true);
  });
});
