import { describe, expect, it } from 'vitest';
import { applyPlacement } from '../src/screens/placement';
import { placementPlan } from '../src/core/placement';
import { Store } from '../src/core/store';
import { STOPS } from '../src/data/journey';
import { KANA_BY_ID } from '../src/data/kana';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('placement', () => {
  it('counts lessons you know as done, sets your level, and leaves every place alone', () => {
    const s = new Store(mem());
    applyPlacement(s, placementPlan('kana'));
    expect(s.data.started).toBe(true);
    expect(s.data.level).toBe('N5');
    for (const st of STOPS.filter((x) => x.tier === 'Kana')) expect(s.data.stops[st.id], st.id).toBeGreaterThanOrEqual(1);
    expect(STOPS.filter((x) => x.tier === 'N5').every((x) => s.data.stops[x.id] === undefined)).toBe(true);
    // no place is marked as visited just because its lesson is behind you
    expect(s.data.stamps).toEqual([]);
    expect(s.data.introduced).toContain('h:あ');
    expect(s.data.introduced).toContain('k:ア');
    // known kana count as reviewed twice, so they show up as known rather than new
    expect(s.data.srs['h:あ']).toMatchObject({ seen: 2, correct: 2 });
    expect(s.data.srs['k:ア']).toMatchObject({ seen: 2, correct: 2 });
  });
  it('lets a higher level skip lessons, not places', () => {
    const s = new Store(mem());
    applyPlacement(s, placementPlan('N3'));
    expect(s.data.level).toBe('N2');
    for (const tier of ['Kana', 'N5', 'N4', 'N3']) for (const st of STOPS.filter((x) => x.tier === tier)) expect(s.data.stops[st.id], st.id).toBeGreaterThanOrEqual(1);
    for (const st of STOPS.filter((x) => x.tier === 'N2')) expect(s.data.stops[st.id]).toBeUndefined();
  });
  it('never takes progress away when taken again later', () => {
    const s = new Store(mem());
    s.update((d) => {
      d.stops.tokyo = 3;
      d.stops.yokohama = 2;
      d.level = 'N4';
      d.introduced = ['h:あ'];
      d.srs['h:あ'] = { box: 4, due: 123, seen: 9, correct: 9, wrong: 0, last: 100 };
    });
    const before = JSON.stringify(s.data.srs['h:あ']);
    applyPlacement(s, placementPlan('hiragana'));
    expect(s.data.stops.tokyo).toBe(3);
    expect(s.data.stops.yokohama).toBe(2);
    expect(s.data.level).toBe('N4');
    expect(JSON.stringify(s.data.srs['h:あ'])).toBe(before);
    const snapshot = JSON.stringify(s.data);
    applyPlacement(s, placementPlan('hiragana'));
    expect(JSON.stringify(s.data)).toBe(snapshot);
  });
  it('knows the kana ids it introduces', () => {
    expect(KANA_BY_ID.has('h:あ')).toBe(true);
    expect(KANA_BY_ID.has('k:ア')).toBe(true);
  });
});
