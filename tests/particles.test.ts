import { describe, expect, it } from 'vitest';
import { BLANK, PARTICLES, particleDistractors } from '../src/data/particles';
import { STOP_BY_ID, STOPS } from '../src/data/journey';
import { particleRounds, particlesThrough, splitByTier } from '../src/games/particles';

const at = (id: string) => STOPS.findIndex((s) => s.id === id);

describe('particles', () => {
  it('have one blank, unique ids, valid stops and three clean wrong choices', () => {
    const ids = new Set<string>();
    for (const p of PARTICLES) {
      expect(ids.has(p.id), p.id).toBe(false);
      ids.add(p.id);
      expect(p.text.split(BLANK).length - 1, p.id).toBe(1);
      expect(STOP_BY_ID.has(p.from), p.id).toBe(true);
      const ok = [p.answer, ...(p.also ?? [])];
      expect(p.wrong.length, p.id).toBeGreaterThanOrEqual(3);
      expect(new Set(p.wrong).size, p.id).toBe(p.wrong.length);
      for (const w of p.wrong) expect(ok, p.id).not.toContain(w);
    }
  });
  it('never offer an accepted particle as a distractor', () => {
    for (const p of PARTICLES) {
      const d = particleDistractors(p, 3);
      expect(d).toHaveLength(3);
      for (const x of d) expect([p.answer, ...(p.also ?? [])]).not.toContain(x);
    }
  });
  it('unlock from the first N5 stop and grow along the route', () => {
    expect(particlesThrough(at('hakodate') - 1)).toHaveLength(0);
    expect(particlesThrough(at('hakodate')).length).toBeGreaterThan(0);
    expect(particlesThrough(at('kawagoe')).length).toBeGreaterThan(particlesThrough(at('yakushima')).length);
    expect(particlesThrough(STOPS.length - 1)).toHaveLength(PARTICLES.length);
  });
  it('split into the current level and earlier review', () => {
    const last = STOPS.length - 1;
    const { fresh, review } = splitByTier(particlesThrough(last), last);
    expect(fresh.length).toBeGreaterThanOrEqual(3);
    expect(fresh.length + review.length).toBe(PARTICLES.length);
    for (const p of fresh) expect(STOPS.find((s) => s.id === p.from)!.tier).toBe(STOPS[last]!.tier);
  });
  it('always fill a round of eight once enough sentences are unlocked, without repeats', () => {
    for (const stop of ['beppu', 'kawagoe', 'iriomote', 'asakusa', 'gotokuji']) {
      const rounds = particleRounds(at(stop), {});
      expect(rounds, stop).toHaveLength(8);
      expect(new Set(rounds.map((r) => r.id)).size, stop).toBe(8);
    }
    // early on, a round is just everything there is
    expect(particleRounds(at('hakodate'), {})).toHaveLength(particlesThrough(at('hakodate')).length);
  });
});
