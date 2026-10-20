import { describe, expect, it } from 'vitest';
import { shell } from '../src/games/common';
import { DEFAULT_LOOK } from '../src/core/store';
import type { GameContext } from '../src/games/types';

const ctx = (): GameContext => ({ root: document.createElement('div'), store: { data: { look: { ...DEFAULT_LOOK } } }, quit: () => undefined }) as unknown as GameContext;

describe('game shell accessibility', () => {
  it('announces lives as a count, not as emoji', () => {
    const c = ctx();
    const sh = shell(c, 'Test');
    sh.setLives(2);
    const lives = c.root.querySelector('.lives')!;
    expect(lives.getAttribute('role')).toBe('img');
    expect(lives.getAttribute('aria-label')).toBe('2 of 3 lives left');
    sh.setLives(-1);
    expect(lives.getAttribute('aria-label')).toBe('0 of 3 lives left');
    expect(lives.textContent).toBe('🤍🤍🤍');
  });
  it('exposes progress as a progressbar', () => {
    const c = ctx();
    const sh = shell(c, 'Test');
    const bar = c.root.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    sh.setProgress(3, 8);
    expect(bar.getAttribute('aria-valuenow')).toBe('38');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 8');
    sh.setProgress(0, 0);
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });
});
