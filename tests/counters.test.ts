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
  it('know the N3–N2 counters and their traps', () => {
    expect(c('kaidan').readings[2]).toContain('さんがい');
    expect(c('kai').readings[2]).toEqual(['さんかい']);
    expect(counterDistractors(c('kai'), 3)).toContain('さんがい');
    expect(c('soku').readings[2]![0]).toBe('さんぞく');
    expect(c('ken').readings[2]![0]).toBe('さんげん');
    expect(c('kai').readings[5]![0]).toBe('ろっかい');
    expect(counterDistractors(c('sai'), 6)).toContain('ろっさい');
    expect(c('tou').readings[0]![0]).toBe('いっとう');
    expect(written(c('kaidan'), 3)).toBe('三階');
    expect(written(c('sai'), 10)).toBe('十歳');
  });
  it('know the N2–N1 counters and their traps', () => {
    expect(c('seki').readings[0]![0]).toBe('いっせき');
    expect(counterDistractors(c('seki'), 3)).toContain('さんぜき');
    expect(c('zen').readings[0]).toEqual(['いちぜん']);
    expect(counterDistractors(c('zen'), 1)).toContain('いっぜん');
    expect(counterDistractors(c('zen'), 8)).toContain('はっぜん');
    expect(c('ki').readings[5]![0]).toBe('ろっき');
    expect(counterDistractors(c('ki'), 3)).toContain('さんぎ');
    expect(c('shu').readings[0]![0]).toBe('いっしゅ');
    expect(counterDistractors(c('shu'), 3)).toContain('さんじゅ');
    expect(c('mune').readings).toEqual(c('tou').readings);
    expect(written(c('ki'), 5)).toBe('五基');
    expect(written(c('shu'), 10)).toBe('十首');
  });
  it('are listed in route order, so the last unlocked one is the newest', () => {
    const at = COUNTERS.map((k) => STOPS.findIndex((s) => s.id === k.from));
    for (let i = 1; i < at.length; i++) expect(at[i]!, COUNTERS[i]!.id).toBeGreaterThanOrEqual(at[i - 1]!);
  });
});
