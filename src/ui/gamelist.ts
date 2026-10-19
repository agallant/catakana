import { h } from './dom';
import { getPref, setPref } from '../core/prefs';
import type { GameDef } from '../games/types';

export type Skill = GameDef['skill'];
export type SkillFilter = Skill | 'all';

export const SKILLS: { id: SkillFilter; label: string }[] = [
  { id: 'all', label: '✨ All' },
  { id: 'reading', label: '📖 Reading' },
  { id: 'writing', label: '✍️ Writing' },
  { id: 'listening', label: '👂 Listening' },
  { id: 'speaking', label: '🗣️ Speaking' },
];

/** The remembered skill filter, falling back to "all" when that skill has no games here. */
export function currentSkill(games: GameDef[]): SkillFilter {
  const saved = getPref('skill') as SkillFilter | null;
  if (!saved || !SKILLS.some((s) => s.id === saved)) return 'all';
  return saved === 'all' || games.some((g) => g.skill === saved) ? saved : 'all';
}

export function filterBySkill(games: GameDef[], skill: SkillFilter): GameDef[] {
  return skill === 'all' ? games : games.filter((g) => g.skill === skill);
}

/** Game cards with skill tabs on top, so a long list stays easy to scan on a phone. */
export function gameList(games: GameDef[], card: (g: GameDef) => HTMLElement): HTMLElement {
  let skill = currentSkill(games);
  const list = h('div', { class: 'game-list' });
  const tabs = h('div', { class: 'chips skill-tabs', role: 'tablist' });
  const draw = (): void => {
    tabs.replaceChildren(
      ...SKILLS.filter((s) => s.id === 'all' || games.some((g) => g.skill === s.id)).map((s) => {
        const n = filterBySkill(games, s.id).length;
        return h(
          'button',
          {
            class: `chip ${s.id === skill ? 'on' : ''}`,
            role: 'tab',
            'aria-selected': String(s.id === skill),
            onClick: () => {
              skill = s.id;
              setPref('skill', s.id);
              draw();
            },
          },
          `${s.label} ${n}`,
        );
      }),
    );
    list.replaceChildren(...filterBySkill(games, skill).map(card));
  };
  draw();
  return h('div', { class: 'game-picker' }, tabs, list);
}
