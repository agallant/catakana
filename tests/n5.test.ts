import { describe, expect, it } from 'vitest';
import { N5_CONTENT } from '../src/data/n5';
import { STOPS } from '../src/data/journey';
import { N5_WORDS, ALL_WORDS, TOUR_WORDS } from '../src/data/vocab';
import { N4_CONTENT } from '../src/data/n4';
import { N3_CONTENT } from '../src/data/n3';
import { N2_CONTENT } from '../src/data/n2';
import { N1_CONTENT } from '../src/data/n1';
import { TOUR_CONTENT } from '../src/data/tour';
import { kanaTokens, wordsThrough, firstStopOfTier, newWordsAt } from '../src/core/curriculum';
import { decoyChunk, grammarsAt, sentencesThrough } from '../src/core/sentences';

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

describe('extra grammar', () => {
  it('adds extra points after the main one at eight N5 stops', () => {
    expect(grammarsAt('takayama').map((g) => g.id)).toEqual(['ikura', 'kara-made']);
    expect(grammarsAt('beppu').map((g) => g.id)).toEqual(['tai', 'mashou']);
    expect(grammarsAt('akita').map((g) => g.id)).toEqual(['i-adj', 'adj-forms']);
    expect(grammarsAt('aomori').map((g) => g.id)).toEqual(['kore-no', 'question-words']);
    expect(grammarsAt('yakushima').map((g) => g.id)).toEqual(['te-kudasai', 'naide']);
    expect(grammarsAt('ise').map((g) => g.id)).toEqual(['de', 'to-mo']);
    expect(grammarsAt('kochi').map((g) => g.id)).toEqual(['past-neg', 'mae-ato']);
    expect(grammarsAt('kobe').map((g) => g.id)).toEqual(['aru-iru', 'ga-demo']);
    expect(grammarsAt('hakodate').map((g) => g.id)).toEqual(['wa-desu']);
    expect(grammarsAt('nowhere')).toEqual([]);
  });
  it('gives every grammar point a unique id and examples', () => {
    const all = Object.keys(TOUR_CONTENT).flatMap((s) => grammarsAt(s));
    expect(new Set(all.map((g) => g.id)).size).toBe(all.length);
    for (const g of all) expect(g.examples.length, g.id).toBeGreaterThanOrEqual(2);
  });
});

describe('tour dedup', () => {
  it('lists each kanji word once across the whole tour', () => {
    const seen = new Map<string, string>();
    const dups: string[] = [];
    for (const [stop, c] of Object.entries(TOUR_CONTENT))
      for (const [written, reading] of c.words) {
        if (written === reading) continue;
        const key = `${written}|${reading}`;
        if (seen.has(key)) dups.push(`${key} at ${seen.get(key)} and ${stop}`);
        else seen.set(key, stop);
      }
    expect(dups).toEqual([]);
  });
  it('keeps homophones with different meanings', () => {
    const tomaru = TOUR_WORDS.filter((w) => w.reading === 'とまる').map((w) => w.kanji);
    expect(tomaru).toContain('止まる');
    expect(tomaru).toContain('泊まる');
  });
});

describe('N3 content', () => {
  it('every N3 stop has grammar, words and sentences', () => {
    const n3Stops = STOPS.filter((s) => s.tier === 'N3');
    expect(Object.keys(N3_CONTENT).sort()).toEqual(n3Stops.map((s) => s.id).sort());
    for (const s of n3Stops) expect(TOUR_WORDS.filter((w) => w.stop === s.id).length, s.id).toBeGreaterThanOrEqual(8);
  });
});

describe('N2 content', () => {
  it('every N2 stop has grammar, words and sentences', () => {
    const n2Stops = STOPS.filter((s) => s.tier === 'N2');
    expect(n2Stops).toHaveLength(12);
    expect(Object.keys(N2_CONTENT).sort()).toEqual(n2Stops.map((s) => s.id).sort());
    for (const s of n2Stops) {
      expect(TOUR_WORDS.filter((w) => w.stop === s.id).length, s.id).toBeGreaterThanOrEqual(8);
      expect(N2_CONTENT[s.id]!.sentences.length, s.id).toBeGreaterThanOrEqual(4);
    }
  });
  it('N2 comes after N3 in the journey', () => {
    expect(STOPS.findIndex((s) => s.tier === 'N2')).toBeGreaterThan(STOPS.findLastIndex((s) => s.tier === 'N3'));
  });
});

describe('N1 content', () => {
  it('every N1 stop has grammar, words and sentences', () => {
    const n1Stops = STOPS.filter((s) => s.tier === 'N1');
    expect(n1Stops).toHaveLength(12);
    expect(Object.keys(N1_CONTENT).sort()).toEqual(n1Stops.map((s) => s.id).sort());
    for (const s of n1Stops) {
      expect(TOUR_WORDS.filter((w) => w.stop === s.id).length, s.id).toBeGreaterThanOrEqual(8);
      expect(N1_CONTENT[s.id]!.sentences.length, s.id).toBeGreaterThanOrEqual(4);
    }
  });
  it('the journey ends at Gōtoku-ji', () => {
    expect(STOPS.at(-1)!.id).toBe('gotokuji');
  });
});
