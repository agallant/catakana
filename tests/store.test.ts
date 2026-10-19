import { describe, expect, it } from 'vitest';
import { Store } from '../src/core/store';

const mem = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('store', () => {
  it('backfills eki stamps for older saves', () => {
    const s = new Store(mem({ 'catakana.save.v1': JSON.stringify({ v: 1, stops: { tokyo: 2, yokohama: 0 } }) }));
    expect(s.data.stamps.sort()).toEqual(['tokyo', 'yokohama']);
    expect(s.data.owned).toEqual([]);
  });
  it('starts fresh on corrupt data', () => {
    const s = new Store(mem({ 'catakana.save.v1': '{not json' }));
    expect(s.data.fish).toBe(0);
  });
});

import { questsFor, track, ACHIEVEMENTS } from '../src/core/progress';
import { placementStart } from '../src/screens/placement';
import { STOPS } from '../src/data/journey';

describe('quests & achievements', () => {
  it('picks three distinct quests per day, deterministically', () => {
    const a = questsFor('2026-10-19');
    expect(a).toHaveLength(3);
    expect(new Set(a.map((q) => q.id)).size).toBe(3);
    expect(questsFor('2026-10-19').map((q) => q.id)).toEqual(a.map((q) => q.id));
  });
  it('completes the play-games quest and unlocks achievements', () => {
    const s = new Store(mem());
    for (let i = 0; i < 3; i++) track(s, { type: 'game', game: 'sushi', skill: 'reading', correct: 5, total: 10, stars: 1 });
    expect(s.data.daily.claimed).toContain('games3');
    s.update((d) => (d.stops.tokyo = 1));
    const unlocks = track(s, { type: 'photo' });
    expect(unlocks.some((u) => u.label.includes('First Paw-step'))).toBe(true);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
  });
  it('placement skips what you already know', () => {
    expect(placementStart(3, 2)).toBe(0);
    expect(STOPS[placementStart(8, 2)]!.id).toBe('fukuoka');
    expect(STOPS[placementStart(8, 8)]!.tier).toBe('N5');
  });
});

describe('backup', () => {
  it('round-trips progress and rejects foreign files', () => {
    const a = new Store(mem());
    a.update((d) => {
      d.fish = 42;
      d.stops.tokyo = 3;
    });
    const b = new Store(mem());
    expect(b.importJson(a.exportJson())).toBe(true);
    expect(b.data.fish).toBe(42);
    expect(b.data.stamps).toContain('tokyo');
    expect(b.importJson('{"hello":1}')).toBe(false);
    expect(b.importJson('not json')).toBe(false);
    expect(b.data.fish).toBe(42);
  });
});

describe('backup validation', () => {
  it('rejects malformed saves without touching progress', () => {
    const s = new Store(mem());
    s.update((d) => (d.fish = 7));
    expect(s.importJson('{"app":"catakana","save":[]}')).toBe(false);
    expect(s.importJson('{"app":"catakana","save":{"stops":"x","srs":{},"fish":1,"xp":1}}')).toBe(false);
    expect(s.data.fish).toBe(7);
  });
  it('repairs bad nested fields when loading', () => {
    const s = new Store(mem({ 'catakana.save.v1': JSON.stringify({ v: 1, stops: {}, srs: {}, fish: 3, xp: 0, daily: null, stamps: 'nope' }) }));
    expect(s.data.daily).toEqual({ day: '', progress: {}, claimed: [] });
    expect(s.data.stamps).toEqual([]);
    expect(s.data.fish).toBe(3);
  });
});
