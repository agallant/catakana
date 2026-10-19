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
