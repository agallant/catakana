import { describe, expect, it } from 'vitest';
import { KEIGO, keigoDistractors, keigoRounds } from '../src/data/keigo';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { readingOf } from '../src/screens/explore';
import { keigoThrough } from '../src/games/keigo';

describe('keigo', () => {
  it('is well formed', () => {
    expect(new Set(KEIGO.map((v) => v.id)).size).toBe(KEIGO.length);
    for (const v of KEIGO) {
      expect(STOP_BY_ID.has(v.from), v.id).toBe(true);
      expect(v.sonkei ?? v.kenjo, v.id).toBeTruthy();
      for (const use of [v.sonkei, v.kenjo]) {
        if (!use) continue;
        expect(use.ex.split('＿＿'), `${v.id}: one blank`).toHaveLength(2);
        for (const t of [use.form, use.ex]) expect(readingOf(t)).not.toMatch(/[{}|]/);
      }
    }
  });

  it('offers distinct distractors, starting with the other direction', () => {
    const rounds = keigoRounds();
    expect(rounds.length).toBeGreaterThan(20);
    for (const r of rounds) {
      const d = keigoDistractors(r, 3);
      expect(d).toHaveLength(3);
      expect(new Set(d).size).toBe(3);
      expect(d).not.toContain(r.use.form);
    }
    const iku = rounds.find((r) => r.id === 'keigo:iku:sonkei')!;
    expect(keigoDistractors(iku, 1)).toEqual(['{参|まい}ります']);
  });

  it('unlocks at the end of N4 and grows in N2', () => {
    const kawagoe = STOPS.findIndex((s) => s.id === 'kawagoe');
    expect(keigoThrough(kawagoe - 1)).toHaveLength(0);
    const basic = keigoThrough(kawagoe).length;
    expect(basic).toBeGreaterThan(4);
    expect(keigoThrough(STOPS.length - 1).length).toBeGreaterThan(basic);
  });

  it('adds formal business keigo in N1', () => {
    const ogasawara = STOPS.findIndex((s) => s.id === 'ogasawara');
    const n2 = keigoThrough(ogasawara - 1).length;
    const n1 = keigoThrough(ogasawara).map((v) => v.id);
    expect(n1.length).toBeGreaterThan(n2);
    expect(n1).toEqual(expect.arrayContaining(['yomu', 'kariru', 'hikiukeru', 'omou', 'miseru', 'kaeru', 'suwaru']));
    for (const v of KEIGO) expect(STOPS[STOPS.findIndex((s) => s.id === v.from)]!.tier, v.id).toMatch(/^N[421]$/);
  });
});
