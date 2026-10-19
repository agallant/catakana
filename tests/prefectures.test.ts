import { describe, expect, it } from 'vitest';
import { PREFECTURES, PREF_BY_ID, STOP_PREFECTURE, visitedPrefectures } from '../src/data/prefectures';
import { STOPS } from '../src/data/journey';

describe('prefectures', () => {
  it('lists all 47 once', () => {
    expect(PREFECTURES).toHaveLength(47);
    expect(new Set(PREFECTURES.map((p) => p.id)).size).toBe(47);
  });
  it('maps every stop to a real prefecture', () => {
    for (const s of STOPS) expect(PREF_BY_ID.has(STOP_PREFECTURE[s.id] ?? ''), s.id).toBe(true);
    expect(Object.keys(STOP_PREFECTURE).sort()).toEqual(STOPS.map((s) => s.id).sort());
  });
  it('counts visited prefectures from stamps', () => {
    expect(visitedPrefectures(['tokyo', 'asakusa', 'kyoto', 'nowhere']).size).toBe(2);
  });
});

import { DAY_TRIPS } from '../src/data/daytrips';
import { STOP_BY_ID } from '../src/data/journey';
describe('day trips', () => {
  it('make every prefecture reachable', () => {
    const reachable = new Set([...Object.values(STOP_PREFECTURE), ...DAY_TRIPS.map((t) => t.pref)]);
    expect(reachable.size).toBe(47);
    for (const t of DAY_TRIPS) {
      expect(STOP_BY_ID.has(t.from), t.id).toBe(true);
      expect(PREF_BY_ID.has(t.pref), t.id).toBe(true);
    }
  });
  it('count toward visited prefectures', () => {
    expect(visitedPrefectures([], ['mito']).has('ibaraki')).toBe(true);
  });
});
