import { describe, expect, it } from 'vitest';
import { N5_CONTENT } from '../src/data/n5';
import { STOPS } from '../src/data/journey';
import { N5_WORDS, ALL_WORDS, TOUR_WORDS } from '../src/data/vocab';
import { N4_CONTENT } from '../src/data/n4';
import { TOUR_CONTENT } from '../src/data/tour';
import { kanaTokens, wordsThrough, firstStopOfTier, newWordsAt } from '../src/core/curriculum';
import { decoyChunk, sentencesThrough } from '../src/core/sentences';

describe('N5 content', () => {
  const n5Stops = STOPS.filter((s) => s.tier === 'N5');
  it('every N5 stop has grammar, words and sentences', () => {
    for (const s of n5Stops) {
      const c = N5_CONTENT[s.id];
      expect(c, s.id).toBeDefined();
      expect(c!.sentences.length).toBeGreaterThanOrEqual(4);
      expect(N5_WORDS.filter((w) => w.stop === s.id).length, s.id).toBeGreaterThanOrEqual(12);
    }
    expect(Object.keys(N5_CONTENT).sort()).toEqual(n5Stops.map((s) => s.id).sort());
  });
  it('readings are pure kana', () => {
    for (const w of N5_WORDS) expect(kanaTokens(w.reading), w.reading).not.toBeNull();
    for (const c of Object.values(N5_CONTENT))
      for (const sen of c.sentences) for (const ch of sen.chunks) expect(kanaTokens(ch.replace(/[。、？！]/g, '')), ch).not.toBeNull();
  });
  it('ids are unique', () => {
    const ids = ALL_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('N5 words unlock at their stop', () => {
    const i = firstStopOfTier('N5');
    expect(newWordsAt(i).every((w) => w.stop === STOPS[i]!.id)).toBe(true);
    expect(wordsThrough(i - 1).some((w) => w.stop)).toBe(false);
  });
  it('sentences accumulate and decoys differ', () => {
    const i = firstStopOfTier('N5');
    expect(sentencesThrough(i - 1)).toHaveLength(0);
    expect(sentencesThrough(i).length).toBeGreaterThan(0);
    const d = decoyChunk(['ねこは', 'さかなを', 'たべます。'], () => 0);
    expect(d).not.toBeNull();
    expect(['ねこは', 'さかなを']).not.toContain(d);
  });
});

describe('N4 content', () => {
  const n4Stops = STOPS.filter((s) => s.tier === 'N4');
  it('every N4 stop has grammar, words and sentences', () => {
    expect(Object.keys(N4_CONTENT).sort()).toEqual(n4Stops.map((s) => s.id).sort());
    for (const s of n4Stops) {
      expect(N4_CONTENT[s.id]!.sentences.length).toBeGreaterThanOrEqual(4);
      expect(TOUR_WORDS.filter((w) => w.stop === s.id).length, s.id).toBeGreaterThanOrEqual(8);
    }
  });
  it('tour readings and sentence chunks are pure kana', () => {
    for (const w of TOUR_WORDS) expect(kanaTokens(w.reading), w.reading).not.toBeNull();
    for (const c of Object.values(TOUR_CONTENT))
      for (const sen of c.sentences) for (const ch of sen.chunks) expect(kanaTokens(ch.replace(/[。、？！]/g, '')), ch).not.toBeNull();
  });
  it('N4 comes after N5 in the journey', () => {
    expect(STOPS.findIndex((s) => s.tier === 'N4')).toBeGreaterThan(STOPS.findLastIndex((s) => s.tier === 'N5'));
  });
});
