import { describe, expect, it } from 'vitest';
import {
  KANA_PASS,
  KANA_QUESTIONS,
  TIERS,
  TIER_PASS,
  TIER_QUESTIONS,
  blockVerdict,
  kanaQuestions,
  placedLevel,
  startIndexFor,
  tierQuestions,
  type Question,
} from '../src/core/placement';
import { ALL_KANA } from '../src/data/kana';
import { ALL_WORDS } from '../src/data/vocab';
import { STOPS } from '../src/data/journey';
import { BLANK } from '../src/data/particles';

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sound = (q: Question): void => {
  expect(q.choices, q.prompt).toHaveLength(4);
  expect(new Set(q.choices).size, q.prompt).toBe(4);
  expect(q.answer).toBeGreaterThanOrEqual(0);
  expect(q.answer).toBeLessThan(4);
  expect(q.prompt.length).toBeGreaterThan(0);
};

describe('placement questions', () => {
  it('ask five kana from one script, each with a single correct romaji', () => {
    for (const script of ['hiragana', 'katakana'] as const) {
      for (let seed = 1; seed <= 40; seed++) {
        const qs = kanaQuestions(script, seeded(seed));
        expect(qs).toHaveLength(KANA_QUESTIONS);
        for (const q of qs) {
          sound(q);
          const k = ALL_KANA.find((x) => x.char === q.prompt && x.script === script)!;
          expect(q.choices[q.answer]).toBe(k.romaji);
          expect(q.choices.filter((c) => c === k.romaji)).toHaveLength(1);
        }
      }
    }
  });
  it('mix vocabulary, grammar, particle and kanji questions at every level', () => {
    for (const tier of TIERS) {
      for (let seed = 1; seed <= 60; seed++) {
        const qs = tierQuestions(tier, seeded(seed));
        expect(qs, `${tier} ${seed}`).toHaveLength(TIER_QUESTIONS);
        qs.forEach(sound);
        const count = (kind: string): number => qs.filter((q) => q.kind === kind).length;
        expect(count('vocab'), tier).toBe(2);
        expect(count('grammar'), tier).toBe(1);
        expect(count('particle'), tier).toBe(1);
        expect(count('kanji'), tier).toBe(1);
        for (const q of qs) expect(q.area).toBe(tier);
      }
    }
  });
  it('put the blank in particle sentences and keep the right answer out of the wrong ones', () => {
    for (const tier of TIERS) {
      for (let seed = 1; seed <= 40; seed++) {
        for (const q of tierQuestions(tier, seeded(seed))) {
          if (q.kind === 'particle') {
            expect(q.prompt.split(BLANK).length - 1, q.prompt).toBe(1);
            expect(q.note, q.prompt).toBeTruthy();
          }
          if (q.kind === 'vocab') expect(q.choices.filter((c) => c === q.choices[q.answer])).toHaveLength(1);
        }
      }
    }
  });
  it('never ask about a spelling that two different words share', () => {
    const meaning = (en: string): string => en.replace(/\(.*?\)/g, '').trim().toLowerCase();
    for (const tier of TIERS) {
      for (let seed = 1; seed <= 80; seed++) {
        for (const q of tierQuestions(tier, seeded(seed))) {
          if (q.kind !== 'vocab') continue;
          const meanings = new Set(ALL_WORDS.filter((w) => w.reading === q.prompt || w.kanji === q.prompt).map((w) => meaning(w.en)));
          expect(meanings.size, q.prompt).toBe(1);
        }
      }
    }
  });
  it('show kana up to N4 and the usual written form from N3', () => {
    const kana = /^[぀-ゟ゠-ヿー]+$/;
    for (let seed = 1; seed <= 40; seed++) {
      for (const tier of ['N5', 'N4'] as const) for (const q of tierQuestions(tier, seeded(seed))) if (q.kind === 'vocab') expect(q.prompt, q.prompt).toMatch(kana);
    }
    let withKanji = 0;
    for (let seed = 1; seed <= 40; seed++) for (const q of tierQuestions('N2', seeded(seed))) if (q.kind === 'vocab' && !kana.test(q.prompt)) withKanji++;
    expect(withKanji).toBeGreaterThan(40);
  });
});

describe('placement result', () => {
  it('decides a block as soon as the outcome cannot change', () => {
    expect(blockVerdict(KANA_PASS, 0, KANA_QUESTIONS, KANA_PASS)).toBe('pass');
    expect(blockVerdict(0, KANA_QUESTIONS - KANA_PASS + 1, KANA_QUESTIONS, KANA_PASS)).toBe('fail');
    expect(blockVerdict(2, 2, TIER_QUESTIONS, TIER_PASS)).toBeNull();
    expect(blockVerdict(TIER_PASS, 1, TIER_QUESTIONS, TIER_PASS)).toBe('pass');
    expect(blockVerdict(1, 3, TIER_QUESTIONS, TIER_PASS)).toBe('fail');
  });
  it('names the highest level shown, and starts later the more you know', () => {
    const none = placedLevel({ hiragana: false, katakana: false, tiers: [] });
    const hira = placedLevel({ hiragana: true, katakana: false, tiers: [] });
    const kana = placedLevel({ hiragana: true, katakana: true, tiers: [] });
    expect([none, hira, kana]).toEqual(['none', 'hiragana', 'kana']);
    const starts = [none, hira, kana, 'N5', 'N4', 'N3', 'N2', 'N1'].map((l) => startIndexFor(l as never));
    expect(starts[0]).toBe(0);
    for (let i = 1; i < 7; i++) expect(starts[i]!, `step ${i}`).toBeGreaterThan(starts[i - 1]!);
    expect(STOPS[starts[3]!]!.tier).toBe('N4');
    // N1 is the last level, so passing it keeps you at the start of the N1 stops
    expect(STOPS[starts[6]!]!.tier).toBe('N1');
    expect(starts[7]).toBe(starts[6]);
    expect(placedLevel({ hiragana: true, katakana: true, tiers: ['N5', 'N4', 'N3'] })).toBe('N3');
  });
});
