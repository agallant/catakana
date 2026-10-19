import { describe, expect, it } from 'vitest';
import { GAMES } from '../src/games';
import { currentSkill, filterBySkill, gameList } from '../src/ui/gamelist';
import { setPref } from '../src/core/prefs';

describe('game list skill tabs', () => {
  it('covers every skill and filters by it', () => {
    for (const skill of ['reading', 'writing', 'listening', 'speaking'] as const) {
      const games = filterBySkill(GAMES, skill);
      expect(games.length, skill).toBeGreaterThan(0);
      expect(games.every((g) => g.skill === skill)).toBe(true);
    }
    expect(filterBySkill(GAMES, 'all')).toHaveLength(GAMES.length);
  });
  it('falls back to all when the saved skill has no games here', () => {
    setPref('skill', 'speaking');
    expect(currentSkill(GAMES)).toBe('speaking');
    expect(currentSkill(GAMES.filter((g) => g.skill === 'reading'))).toBe('all');
    setPref('skill', 'nonsense');
    expect(currentSkill(GAMES)).toBe('all');
  });
  it('switches tabs and remembers the choice', () => {
    setPref('skill', 'all');
    const el = gameList(GAMES, (g) => {
      const b = document.createElement('button');
      b.textContent = g.name;
      return b;
    });
    expect(el.querySelectorAll('.game-list button')).toHaveLength(GAMES.length);
    const writing = [...el.querySelectorAll<HTMLButtonElement>('.skill-tabs button')].find((b) => b.textContent?.includes('Writing'))!;
    writing.click();
    expect(el.querySelectorAll('.game-list button')).toHaveLength(filterBySkill(GAMES, 'writing').length);
    expect(currentSkill(GAMES)).toBe('writing');
    const panel = el.querySelector('[role="tabpanel"]')!;
    expect(panel.getAttribute('aria-labelledby')).toBe('game-list-tab-writing');
    expect(writing.getAttribute('aria-controls')).toBe(panel.id);
  });
});
