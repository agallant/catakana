import { describe, expect, it } from 'vitest';
import { ADJECTIVES, ADJ_FORM_UNLOCK, conjugateAdj, wrongAdjForms, type AdjForm } from '../src/core/adjectives';
import { adjFormsAt } from '../src/games/kitchen';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { readingOf } from '../src/screens/explore';

const adj = (r: string) => ADJECTIVES.find((a) => a.reading === r)!;

describe('adjective conjugation', () => {
  it('conjugates い-adjectives', () => {
    expect(conjugateAdj(adj('たかい'), 'neg')).toBe('たかくない');
    expect(conjugateAdj(adj('たかい'), 'past')).toBe('たかかった');
    expect(conjugateAdj(adj('たかい'), 'pastneg')).toBe('たかくなかった');
    expect(conjugateAdj(adj('たかい'), 'te')).toBe('たかくて');
    expect(conjugateAdj(adj('はやい'), 'adv')).toBe('はやく');
  });
  it('conjugates いい from よい', () => {
    expect(conjugateAdj(adj('いい'), 'neg')).toBe('よくない');
    expect(conjugateAdj(adj('いい'), 'past')).toBe('よかった');
    expect(wrongAdjForms(adj('いい'), 'neg')).toContain('いくない');
  });
  it('conjugates な-adjectives, including ones ending in い', () => {
    expect(conjugateAdj(adj('しずか'), 'neg')).toBe('しずかじゃない');
    expect(conjugateAdj(adj('しずか'), 'past')).toBe('しずかだった');
    expect(conjugateAdj(adj('きれい'), 'te')).toBe('きれいで');
    expect(conjugateAdj(adj('ゆうめい'), 'adv')).toBe('ゆうめいに');
    expect(wrongAdjForms(adj('きれい'), 'neg')).toContain('きれくない');
  });
  it('always offers enough distinct wrong answers', () => {
    for (const a of ADJECTIVES) {
      expect(readingOf(a.jp), a.reading).toBe(a.reading);
      for (const f of Object.keys(ADJ_FORM_UNLOCK) as AdjForm[]) {
        const w = wrongAdjForms(a, f);
        expect(w.length).toBeGreaterThanOrEqual(3);
        expect(w).not.toContain(conjugateAdj(a, f));
      }
    }
  });
  it('unlocks after adjectives are taught at Akita', () => {
    for (const id of Object.values(ADJ_FORM_UNLOCK)) expect(STOP_BY_ID.has(id)).toBe(true);
    const akita = STOPS.findIndex((s) => s.id === 'akita');
    expect(adjFormsAt(akita)).toHaveLength(0);
    const at = (id: string) => STOPS.findIndex((s) => s.id === id);
    expect(adjFormsAt(at('kobe'))).toEqual(['neg', 'past']);
    expect(adjFormsAt(at('beppu'))).toEqual(['neg', 'past', 'pastneg']);
    expect(adjFormsAt(at('yakushima'))).toEqual(['neg', 'past', 'pastneg', 'te']);
    expect(adjFormsAt(at('hikone'))).toEqual(['neg', 'past', 'pastneg', 'te', 'adv']);
    expect(adjFormsAt(STOPS.length - 1)).toHaveLength(5);
  });
});
