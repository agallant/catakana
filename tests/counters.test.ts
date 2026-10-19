import { describe, expect, it } from 'vitest';
import { COUNTERS, counterDistractors, written } from '../src/data/counters';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { countersThrough } from '../src/games/counting';

const c = (id: string) => COUNTERS.find((x) => x.id === id)!;

describe('counters', () => {
  it('have ten readings each and valid unlock stops', () => {
    for (const k of COUNTERS) {
      expect(k.readings, k.id).toHaveLength(10);
      expect(STOP_BY_ID.has(k.from), k.id).toBe(true);
      for (const r of k.readings) expect(r.length).toBeGreaterThan(0);
    }
  });
  it('know the sound changes', () => {
    expect(c('hiki').readings[0]![0]).toBe('いっぴき');
    expect(c('hiki').readings[2]![0]).toBe('さんびき');
    expect(c('hon').readings[5]![0]).toBe('ろっぽん');
    expect(c('hai').readings[2]![0]).toBe('さんばい');
    expect(c('nin').readings[1]![0]).toBe('ふたり');
    expect(c('tsu').readings[9]![0]).toBe('とお');
    expect(c('mai').readings[3]![0]).toBe('よんまい');
    expect(written(c('hiki'), 3)).toBe('三匹');
    expect(written(c('tsu'), 3)).toBe('三つ');
    expect(written(c('tsu'), 10)).toBe('十');
    expect(counterDistractors(c('tsu'), 3)).not.toContain('さんこ');
  });
  it('offer at least three teaching distractors, never a right answer', () => {
    for (const k of COUNTERS) {
      for (let n = 1; n <= 10; n++) {
        const d = counterDistractors(k, n);
        expect(d.length, `${k.id} ${n}`).toBeGreaterThanOrEqual(3);
        for (const x of d) expect(k.readings[n - 1]).not.toContain(x);
      }
    }
    expect(counterDistractors(c('hiki'), 1)).toContain('いちひき');
    expect(counterDistractors(c('hon'), 4)).toContain('よんぼん');
  });
  it('unlock along the N5 journey', () => {
    const aomori = STOPS.findIndex((s) => s.id === 'aomori');
    expect(countersThrough(aomori - 1)).toHaveLength(0);
    expect(countersThrough(aomori).map((k) => k.id)).toEqual(['tsu', 'nin']);
    expect(countersThrough(STOPS.length - 1)).toHaveLength(COUNTERS.length);
  });
});
