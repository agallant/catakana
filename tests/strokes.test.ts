import { describe, expect, it } from 'vitest';
import { matchStroke, resample, pathLength } from '../src/core/strokes';
import strokes from '../src/data/strokes.json';
import { ALL_KANA } from '../src/data/kana';
import { KANJI } from '../src/data/kanji';

const line = (x0: number, y0: number, x1: number, y1: number) => Array.from({ length: 10 }, (_, i) => ({ x: x0 + ((x1 - x0) * i) / 9, y: y0 + ((y1 - y0) * i) / 9 }));

describe('stroke matching', () => {
  it('resamples evenly', () => {
    const r = resample(line(0, 0, 100, 0), 11);
    expect(r).toHaveLength(11);
    expect(r[5]!.x).toBeCloseTo(50, 0);
    expect(pathLength(r)).toBeCloseTo(100, 0);
  });
  it('accepts a close stroke and rejects a far one', () => {
    const exp = line(20, 50, 90, 50);
    expect(matchStroke(line(22, 54, 88, 52), exp).ok).toBe(true);
    expect(matchStroke(line(20, 90, 90, 90), exp).ok).toBe(false);
  });
  it('detects reversed direction', () => {
    const v = matchStroke(line(90, 50, 20, 50), line(20, 50, 90, 50));
    expect(v.ok).toBe(false);
    expect(v.reversed).toBe(true);
  });
});

describe('stroke data', () => {
  const data = strokes as Record<string, string[]>;
  it('covers every kana and kanji', () => {
    for (const k of ALL_KANA) for (const c of k.char) expect(data[c]?.length, c).toBeGreaterThan(0);
    for (const k of KANJI) expect(data[k.char]?.length, k.char).toBeGreaterThan(0);
  });
  it('has known stroke counts', () => {
    expect(data['人']).toHaveLength(2);
    expect(data['書']).toHaveLength(10);
    expect(data['あ']).toHaveLength(3);
  });
});
