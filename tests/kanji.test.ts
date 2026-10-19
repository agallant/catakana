import { describe, expect, it } from 'vitest';
import { KANJI, primaryReading, KANJI_BY_CHAR } from '../src/data/kanji';
import { kanjiItem, kanjiThrough, withKnownKanji, wordItem, lessonBatch } from '../src/core/items';
import { N5_WORDS } from '../src/data/vocab';
import { STOPS } from '../src/data/journey';
import { firstStopOfTier } from '../src/core/curriculum';

describe('kanji', () => {
  it('every kanji belongs to an N5 stop', () => {
    const n5 = new Set(STOPS.filter((s) => s.tier === 'N5').map((s) => s.id));
    for (const k of KANJI) expect(n5.has(k.stop), k.char).toBe(true);
  });
  it('primary readings are hiragana', () => {
    expect(primaryReading(KANJI_BY_CHAR.get('食')!)).toBe('た');
    expect(primaryReading(KANJI_BY_CHAR.get('駅')!)).toBe('えき');
    for (const k of KANJI) expect(primaryReading(k), k.char).toMatch(/^[ぁ-ゖ]+$/);
  });
  it('kanji items accept alternate readings', () => {
    const it = kanjiItem(KANJI_BY_CHAR.get('日')!);
    expect(it.reading).toBe('ひ');
    expect(it.alts).toContain('にち');
  });
  it('words switch to kanji only when all their kanji are known', () => {
    const w = wordItem(N5_WORDS.find((x) => x.kanji === '学生')!);
    expect(withKnownKanji(w, new Set(['kj:学'])).text).toBe('がくせい');
    expect(withKnownKanji(w, new Set(['kj:学', 'kj:生'])).text).toBe('学生');
  });
  it('kanji appear in lessons and pools from the N5 tour', () => {
    const i = firstStopOfTier('N5');
    expect(kanjiThrough(i - 1)).toHaveLength(0);
    expect(lessonBatch(i, new Set()).items.some((x) => x.kind === 'kanji')).toBe(true);
  });
});
