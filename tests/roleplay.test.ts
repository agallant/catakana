import { describe, expect, it } from 'vitest';
import { SCENES } from '../src/data/roleplay';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { isSpoken, matchSpoken, scenesThrough } from '../src/games/roleplay';

describe('role-play scenes', () => {
  it('are well formed: one natural reply per turn', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
    for (const s of SCENES) {
      expect(STOP_BY_ID.has(s.from), s.id).toBe(true);
      expect(s.turns.length).toBeGreaterThanOrEqual(3);
      for (const t of s.turns) {
        expect(t.replies.filter((r) => r.ok), `${s.id}: ${t.npc}`).toHaveLength(1);
        expect(t.replies.length).toBeGreaterThanOrEqual(3);
        expect(new Set(t.replies.map((r) => r.jp)).size).toBe(t.replies.length);
        for (const r of t.replies) expect(r.why.length).toBeGreaterThan(0);
      }
    }
  });
  it('unlock from the start of the N5 tour', () => {
    expect(scenesThrough(0)).toHaveLength(0);
    expect(scenesThrough(STOPS.length - 1)).toHaveLength(SCENES.length);
  });
  it('matches what was said to the closest reply', () => {
    const turn = SCENES.find((s) => s.id === 'konbini')!.turns[1]!;
    expect(matchSpoken(['はい、お願いします'], turn.replies)?.ok).toBe(true);
    expect(matchSpoken(['はいごちそうさまでした'], turn.replies)?.ok).toBe(false);
    expect(matchSpoken(['ねこ'], turn.replies)).toBeUndefined();
    expect(isSpoken('（えしゃくする）')).toBe(false);
  });
});
