import { describe, expect, it } from 'vitest';
import { classify, conjugate } from '../src/core/conjugate';

describe('conjugation', () => {
  it('classifies verbs', () => {
    expect(classify('たべる')).toBe('ichidan');
    expect(classify('はいる')).toBe('godan');
    expect(classify('かえる')).toBe('godan');
    expect(classify('のむ')).toBe('godan');
    expect(classify('べんきょうする')).toBe('suru');
    expect(classify('くる')).toBe('kuru');
  });
  it('conjugates godan verbs', () => {
    expect(conjugate('のむ', 'masu')).toBe('のみます');
    expect(conjugate('のむ', 'te')).toBe('のんで');
    expect(conjugate('かく', 'te')).toBe('かいて');
    expect(conjugate('およぐ', 'ta')).toBe('およいだ');
    expect(conjugate('はなす', 'te')).toBe('はなして');
    expect(conjugate('まつ', 'te')).toBe('まって');
    expect(conjugate('かう', 'nai')).toBe('かわない');
    expect(conjugate('いく', 'te')).toBe('いって');
    expect(conjugate('かえる', 'masu')).toBe('かえります');
    expect(conjugate('よむ', 'potential')).toBe('よめる');
    expect(conjugate('いく', 'volitional')).toBe('いこう');
    expect(conjugate('ある', 'nai')).toBe('ない');
  });
  it('conjugates ichidan and irregular verbs', () => {
    expect(conjugate('たべる', 'te')).toBe('たべて');
    expect(conjugate('みる', 'potential')).toBe('みられる');
    expect(conjugate('する', 'ta')).toBe('した');
    expect(conjugate('べんきょうする', 'masu')).toBe('べんきょうします');
    expect(conjugate('くる', 'nai')).toBe('こない');
    expect(conjugate('くる', 'te')).toBe('きて');
  });
});

import { wrongForms } from '../src/core/conjugate';
import { formsAt } from '../src/games/kitchen';
import { STOPS } from '../src/data/journey';
import { ALL_WORDS } from '../src/data/vocab';
import { isVerbEntry, conjugate as conj } from '../src/core/conjugate';
describe('verb kitchen', () => {
  it('wrong forms never include the right answer', () => {
    for (const v of ['たべる', 'のむ', 'かえる', 'いく', 'する']) for (const f of ['te', 'ta', 'nai'] as const) expect(wrongForms(v, f)).not.toContain(conj(v, f));
  });
  it('unlocks forms along the journey', () => {
    expect(formsAt(STOPS.findIndex((s) => s.id === 'nikko'))).toEqual(['masu']);
    expect(formsAt(STOPS.length - 1)).toHaveLength(6);
  });
  it('every vocab verb conjugates to kana', () => {
    for (const w of ALL_WORDS.filter((w) => isVerbEntry(w.reading, w.en)))
      for (const f of ['masu', 'te', 'ta', 'nai', 'potential', 'volitional'] as const) expect(conj(w.reading, f), `${w.reading} ${f}`).toMatch(/^[\u3041-\u3096ー]+$/);
  });
});
