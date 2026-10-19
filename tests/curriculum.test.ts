import { describe, expect, it } from 'vitest';
import { kanaTokens, learnedKanaThrough, wordsThrough, isStopUnlocked } from '../src/core/curriculum';
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
  it('unlocks progressively', () => {
    expect(isStopUnlocked(0, { stops: {} })).toBe(true);
    expect(isStopUnlocked(1, { stops: {} })).toBe(false);
    expect(isStopUnlocked(1, { stops: { tokyo: 1 } })).toBe(true);
    expect(learnedKanaThrough(0).size).toBe(5);
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
