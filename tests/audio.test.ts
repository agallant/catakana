import { describe, expect, it } from 'vitest';
import { sfx, type TransportSound } from '../src/core/audio';

describe('sound effects', () => {
  it('are safe to call without WebAudio (e.g. tests, old browsers)', () => {
    const kinds: TransportSound[] = ['plane', 'train', 'shinkansen', 'bus', 'ferry'];
    expect(() => {
      for (const k of kinds) sfx.depart(k);
      sfx.stamp();
      sfx.fanfare();
      for (let i = 0; i < 10; i++) sfx.correct(i);
    }).not.toThrow();
  });
});

import { vi } from 'vitest';
import { chime } from '../src/games/common';
describe('answer chime', () => {
  it('climbs with a streak and resets on a miss', () => {
    const correct = vi.spyOn(sfx, 'correct').mockImplementation(() => {});
    const wrong = vi.spyOn(sfx, 'wrong').mockImplementation(() => {});
    chime(false);
    chime(true);
    chime(true);
    chime(true);
    chime(false);
    chime(true);
    expect(correct.mock.calls.map((c) => c[0])).toEqual([0, 1, 2, 0]);
    expect(wrong).toHaveBeenCalledTimes(2);
    correct.mockRestore();
    wrong.mockRestore();
  });
});
