import type { App, Screen } from '../ui/app';
import { getLevel, setPref } from '../core/prefs';
import { h } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { GAMES } from '../games';
import { catSvg } from '../ui/cat';
import { ruby } from '../ui/dom';
import { speak } from '../core/audio';
import { focusForStop, kanaItem } from '../core/items';
import { stopKana } from '../core/curriculum';
import { grammarAt } from '../core/sentences';
import { grammarId } from './lesson';

export function stopScreen(app: App, params: string[]): Screen {
  const stop = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  const idx = STOPS.indexOf(stop);
  const d = app.store.data;
  const stars = d.stops[stop.id] ?? 0;
  const focus = focusForStop(idx);
  const introduced = new Set(d.introduced);
  const grammar = grammarAt(stop.id);
  const needsLesson = (grammar !== undefined && !introduced.has(grammarId(grammar))) || stopKana(stop).map(kanaItem).some((k) => !introduced.has(k.id)) || (focus.length > 0 && !focus.some((f) => introduced.has(f.id)));
  const wordsLeft = focus.filter((f) => f.kind === 'word' && !introduced.has(f.id)).length;
  const level = getLevel();
  const levelBtns = ([1, 2, 3] as const).map((l) =>
    h('button', { class: `chip ${l === level ? 'on' : ''}`, onClick: () => { setPref('level', String(l)); app.go(`stop/${stop.id}`); } }, ['🐱 Easy', '😼 Medium', '🦁 Hard'][l - 1]!),
  );

  const games = GAMES.filter((g) => g.available?.(idx) ?? true).map((g) =>
    h(
      'button',
      { class: 'game-card', disabled: needsLesson, onClick: () => app.go(`play/${stop.id}/${g.id}/${level}`) },
      h('span', { class: 'game-emoji' }, g.emoji),
      h('span', { class: 'game-info' }, h('strong', null, g.name), h('small', null, g.blurb)),
      h('span', { class: `skill skill-${g.skill}` }, g.skill),
    ),
  );

  const el = h(
    'div',
    { class: 'screen stop' },
    h('button', { class: 'btn ghost small', onClick: () => app.go('map') }, '← Map'),
    h(
      'section',
      { class: 'stop-hero' },
      h('div', { class: 'stop-emoji' }, stop.emoji),
      h('h1', null, stop.name, h('span', { class: 'jp' }, ` ${stop.jp}`), h('span', { class: 'tier-chip' }, stop.tier)),
      h('div', { class: 'stars big' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('button', { class: 'btn ghost small', onClick: () => void speak(stop.reading) }, `🔊 ${stop.reading}`),
    ),
    h(
      'section',
      { class: 'npc' },
      h('div', { class: 'npc-cat' }, catSvg(stop.npc.look, 'happy', 84)),
      h('div', { class: 'speech' }, h('strong', null, `${stop.npc.name}`), h('div', { class: 'jp' }, ruby(stop.npc.hello[0], d.settings.furigana)), h('div', { class: 'small' }, stop.npc.hello[1])),
    ),
    h('section', { class: 'facts' }, h('h3', null, 'Travel notes 📒'), h('ul', null, stop.facts.map((f) => h('li', null, f)))),
    h('button', { class: 'btn big', onClick: () => app.go(`explore/${stop.id}`) }, `🧭 Explore ${stop.name} — sights, souvenirs & quiz`),
    needsLesson
      ? h('div', { class: 'callout' }, h('p', null, 'New things to learn here!'), h('button', { class: 'btn primary big', onClick: () => app.go(`lesson/${stop.id}`) }, '📖 Start lesson'))
      : h(
          'div',
          { class: 'row' },
          wordsLeft
            ? h('button', { class: 'btn primary', onClick: () => app.go(`lesson/${stop.id}`) }, `📖 Learn ${Math.min(wordsLeft, 8)} new words (${wordsLeft} left)`)
            : h('button', { class: 'btn ghost', onClick: () => app.go(`lesson/${stop.id}`) }, '📖 Review lesson'),
          grammar ? h('button', { class: 'btn ghost', onClick: () => app.go(`lesson/${stop.id}/grammar`) }, `📐 ${grammar.pattern}`) : null,
        ),
    h('h3', null, 'Play ', h('span', { class: 'chips' }, levelBtns)),
    h('div', { class: 'game-list' }, games),
    idx < STOPS.length - 1 && stars >= 1
      ? h('button', { class: 'btn primary big', onClick: () => app.go(`travel/${STOPS[idx + 1]!.id}`) }, `Next: ${STOPS[idx + 1]!.name} ${STOPS[idx + 1]!.emoji} →`)
      : h('p', { class: 'hint' }, stars >= 1 ? '' : 'Earn at least one ★ to unlock the next stop.'),
  );
  return { el };
}
