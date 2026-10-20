import { describe, expect, it } from 'vitest';
import { levenshtein, normalizeJa, speechScore } from '../src/core/speech';
import { CONVERSATIONS } from '../src/data/conversations';
import { PHRASES } from '../src/data/phrases';
import { toHiragana } from '../src/data/kana';
import { STOPS } from '../src/data/journey';

describe('speech scoring', () => {
  it('normalises kana', () => {
    expect(normalizeJa('トイレは、どこですか？')).toBe('といれはどこですか');
    expect(normalizeJa('カード')).toBe('かど');
  });
  it('levenshtein', () => {
    expect(levenshtein('ねこ', 'ねこ')).toBe(0);
    expect(levenshtein('ねこ', 'いぬ')).toBe(2);
  });
  it('accepts kanji renderings via alternates', () => {
    const p = PHRASES.find((x) => x.id === 'p:eki')!;
    expect(speechScore('駅はどこですか', [p.jp, p.kana, ...(p.alts ?? [])])).toBe(1);
    expect(speechScore('すしをください', [p.jp, p.kana])).toBeLessThan(0.6);
  });
});

describe('listening & speaking data', () => {
  it('conversations are well formed', () => {
    for (const c of CONVERSATIONS) {
      expect(c.lines.length).toBeGreaterThanOrEqual(2);
      expect(c.answer).toBeLessThan(c.options.length);
      expect(c.from).toBeLessThan(STOPS.length);
    }
    expect(new Set(CONVERSATIONS.map((c) => c.id)).size).toBe(CONVERSATIONS.length);
  });
  it('phrases have a spaceless hiragana reading and cover every level', () => {
    for (const p of PHRASES) {
      expect(p.kana, p.id).toMatch(/^[\u3041-\u3096ー]+$/);
      expect(p.kana, p.id).toBe(toHiragana(p.jp).replace(/\s/g, ''));
      expect(p.from, p.id).toBeLessThan(STOPS.length);
    }
    // every level has a phrase from its very first stop
    for (const t of ['N5', 'N4', 'N3', 'N2', 'N1']) {
      const first = STOPS.findIndex((s) => s.tier === t);
      expect(PHRASES.some((p) => p.from === first), t).toBe(true);
    }
  });
  it('phrases are unique and available from the start', () => {
    expect(new Set(PHRASES.map((p) => p.id)).size).toBe(PHRASES.length);
    expect(PHRASES.filter((p) => p.from === 0).length).toBeGreaterThanOrEqual(3);
  });
});
