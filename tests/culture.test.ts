import { describe, expect, it } from 'vitest';
import { CULTURE } from '../src/data/culture';
import { STOPS } from '../src/data/journey';
import { kanaToRomaji } from '../src/data/kana';
import { readableStations } from '../src/games/station';
import { triviaFor } from '../src/screens/trivia';
import { readingOf } from '../src/screens/explore';
import { romajiHints, ROMAJI_FADE_STOP } from '../src/core/romaji';
import { defaultSave } from '../src/core/store';

describe('culture data', () => {
  it('every stop has spots, trivia and a souvenir', () => {
    for (const s of STOPS) {
      const c = CULTURE[s.id];
      expect(c, s.id).toBeDefined();
      expect(c!.spots.length).toBeGreaterThanOrEqual(2);
      expect(c!.trivia.length).toBeGreaterThanOrEqual(2);
      for (const t of c!.trivia) expect(t.answer).toBeLessThan(t.options.length);
      expect(c!.souvenir.cost).toBeGreaterThan(0);
    }
  });
  it('furigana markup is well formed', () => {
    for (const c of Object.values(CULTURE)) for (const sp of c.spots) expect(readingOf(sp.jp)).not.toMatch(/[{}|]/);
  });
  it('trivia mixes in earlier stops', () => {
    expect(triviaFor('tokyo')).toHaveLength(2);
    expect(triviaFor('kyoto')).toHaveLength(5);
  });
});

describe('romaji', () => {
  it('converts kana to romaji', () => {
    expect(kanaToRomaji('とうきょう')).toBe('toukyou');
    expect(kanaToRomaji('さっぽろ')).toBe('sapporo');
    expect(kanaToRomaji('ラーメン')).toBe('raamen');
  });
  it('fades hints after the first stops', () => {
    const s = defaultSave();
    expect(romajiHints(s, 0)).toBe(true);
    expect(romajiHints(s, ROMAJI_FADE_STOP)).toBe(false);
    s.settings.romaji = false;
    expect(romajiHints(s, 0)).toBe(false);
  });
});

describe('station signs', () => {
  it('becomes available as kana are learned', () => {
    expect(readableStations(0)).toHaveLength(0);
    expect(readableStations(STOPS.length - 1)).toHaveLength(STOPS.length);
  });
});

import { lessonBatch, WORDS_PER_LESSON } from '../src/core/items';
describe('lesson batches', () => {
  it('caps new words per lesson and advances', () => {
    const osaka = STOPS.findIndex((s) => s.id === 'osaka');
    const first = lessonBatch(osaka, new Set());
    const words = first.items.filter((i) => i.kind === 'word');
    expect(words.length).toBeLessThanOrEqual(WORDS_PER_LESSON);
    const second = lessonBatch(osaka, new Set(first.items.map((i) => i.id)));
    const firstIds = new Set(first.items.map((i) => i.id));
    expect(second.items.length).toBeGreaterThan(0);
    expect(second.items.some((i) => firstIds.has(i.id))).toBe(false);
  });
});
