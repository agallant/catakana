import { describe, expect, it } from 'vitest';
import { kanaTokens, learnedKanaThrough, wordsThrough, isUnitOpen, levelDone, levelFromProgress, nextLevel, unitIndexFor, unitTitle, unitsOf } from '../src/core/curriculum';
import { LEVELS } from '../src/data/journey';
import { STOPS } from '../src/data/journey';
import { ALL_KANA, romajiToHiragana, toKatakana } from '../src/data/kana';
import { WORDS } from '../src/data/vocab';
import { review, MAX_BOX } from '../src/core/srs';

describe('kana data', () => {
  it('has complete sets', () => {
    expect(ALL_KANA.filter((k) => k.script === 'hiragana')).toHaveLength(46 + 25 + 33);
    expect(ALL_KANA.filter((k) => k.script === 'katakana')).toHaveLength(46 + 25 + 33);
  });
  it('converts to katakana', () => {
    expect(toKatakana('きゃっと')).toBe('キャット');
  });
  it('romaji to hiragana', () => {
    expect(romajiToHiragana('neko')).toBe('ねこ');
    expect(romajiToHiragana('kippu')).toBe('きっぷ');
    expect(romajiToHiragana('konnichiwa')).toBe('こんにちわ');
    expect(romajiToHiragana('ji')).toBe('じ');
  });
});

describe('curriculum', () => {
  it('every word is learnable by the end of the journey', () => {
    const all = new Set(wordsThrough(STOPS.length - 1).map((w) => w.id));
    const missing = WORDS.filter((w) => !all.has(w.id)).map((w) => w.jp);
    expect(missing).toEqual([]);
  });
  it('tokenises combos', () => {
    expect(kanaTokens('きょう')).toEqual(['h:きょ', 'h:う']);
    expect(kanaTokens('コーヒー')).toEqual(['k:コ', 'mark:ー', 'k:ヒ', 'mark:ー']);
  });
  it('learns kana progressively', () => {
    expect(learnedKanaThrough(0).size).toBe(5);
  });
  it('gives every level its own track of lessons, and the first lesson of each is open', () => {
    expect(unitsOf('Kana')[0]).toBe(0);
    for (const level of LEVELS) {
      const units = unitsOf(level);
      expect(units.length, level).toBeGreaterThan(0);
      expect(units.every((i) => STOPS[i]!.tier === level), level).toBe(true);
      expect(isUnitOpen(units[0]!, { stops: {} }), level).toBe(true);
      expect(isUnitOpen(units[1]!, { stops: {} }), level).toBe(false);
      expect(isUnitOpen(units[1]!, { stops: { [STOPS[units[0]!]!.id]: 1 } }), level).toBe(true);
      expect(unitIndexFor(level, { stops: {} }), level).toBe(units[0]);
    }
  });
  it('follows your own progress within a level, whatever your other levels look like', () => {
    const n4 = unitsOf('N4');
    const save = { stops: { [STOPS[n4[0]!]!.id]: 2, [STOPS[n4[1]!]!.id]: 1 } };
    expect(unitIndexFor('N4', save)).toBe(n4[2]);
    expect(unitIndexFor('N5', save)).toBe(unitsOf('N5')[0]);
    expect(levelDone('N4', save)).toBe(false);
    const all = { stops: Object.fromEntries(n4.map((i) => [STOPS[i]!.id, 1])) };
    expect(levelDone('N4', all)).toBe(true);
    expect(unitIndexFor('N4', all)).toBe(n4[n4.length - 1]);
    expect(nextLevel('N4')).toBe('N3');
    expect(nextLevel('N1')).toBeUndefined();
  });
  it('titles a lesson by its grammar or its kana', () => {
    expect(unitTitle(0)).toBe('あ い う え お');
    expect(unitTitle(STOPS.findIndex((s) => s.tier === 'N5'))).toBe('A は B です');
  });
  it('puts a save from before levels existed at the tier of its first lesson not yet cleared', () => {
    expect(levelFromProgress({ stops: {} })).toBe('Kana');
    expect(levelFromProgress({ stops: { tokyo: 1 } })).toBe('Kana');
    const lastKana = STOPS.findLastIndex((s) => s.tier === 'Kana');
    expect(levelFromProgress({ stops: { [STOPS[lastKana]!.id]: 1 } })).toBe('N5');
    const lastN5 = STOPS.findLastIndex((s) => s.tier === 'N5');
    expect(levelFromProgress({ stops: { [STOPS[lastN5]!.id]: 3 } })).toBe('N4');
    expect(levelFromProgress({ stops: { gotokuji: 1 } })).toBe('N1');
  });
  it('every stop teaches valid groups', () => {
    const groups = new Set(ALL_KANA.map((k) => k.group));
    const taught = STOPS.flatMap((s) => s.teaches);
    taught.forEach((g) => expect(groups.has(g)).toBe(true));
    expect(new Set(taught).size).toBe(groups.size);
  });
});

describe('srs', () => {
  it('promotes and demotes', () => {
    let r = review(undefined, true, 0);
    expect(r.box).toBe(1);
    for (let i = 0; i < 10; i++) r = review(r, true, 0);
    expect(r.box).toBe(MAX_BOX);
    r = review(r, false, 0);
    expect(r.box).toBe(MAX_BOX - 2);
  });
});
