import type { App, Screen } from '../ui/app';
import { getLevel, setPref } from '../core/prefs';
import { h } from '../ui/dom';
import { LEVELS, LEVEL_BLURB, STOP_BY_ID, STOPS } from '../data/journey';
import { GAMES } from '../games';
import { gameList } from '../ui/gamelist';
import { catSvg } from '../ui/cat';
import { ruby } from '../ui/dom';
import { speak } from '../core/audio';
import { focusForStop, lessonBatch } from '../core/items';
import { grammarsAt } from '../core/sentences';
import { isUnitOpen, levelDone, nextLevel, unitIndexFor, unitTitle, unitsOf } from '../core/curriculum';
import { grammarId } from './lesson';

/**
 * A place you can visit. Every place is open and every place offers lessons and games at your study level:
 * the lesson is the one you are up to on that level's track, wherever you happen to be.
 * params: place id, then optionally a lesson (stop id) of your level to look at instead of the current one.
 */
export function stopScreen(app: App, params: string[]): Screen {
  const place = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  app.place = place.id;
  const d = app.store.data;
  if (!d.stamps.includes(place.id)) app.store.update((s) => { s.stamps.push(place.id); });
  const level = d.level;
  const units = unitsOf(level);
  const asked = params[1] ? STOP_BY_ID.get(params[1]) : undefined;
  const askedIdx = asked && asked.tier === level ? STOPS.indexOf(asked) : -1;
  const idx = askedIdx >= 0 && isUnitOpen(askedIdx, d) ? askedIdx : unitIndexFor(level, d);
  const unit = STOPS[idx]!;
  const stars = d.stops[unit.id] ?? 0;
  const focus = focusForStop(idx);
  const introduced = new Set(d.introduced);
  const grammars = grammarsAt(unit.id);
  const grammar = grammars[0];
  const needsLesson = grammars.some((g) => !introduced.has(grammarId(g))) || lessonBatch(idx, introduced).items.some((k) => k.kind !== 'word' && !introduced.has(k.id)) || (focus.length > 0 && !focus.some((f) => introduced.has(f.id)));
  const wordsLeft = focus.filter((f) => f.kind === 'word' && !introduced.has(f.id)).length;
  const difficulty = getLevel();
  const here = (unitId?: string): string => `stop/${place.id}${unitId ? `/${unitId}` : ''}`;

  const levelChips = LEVELS.map((l) =>
    h('button', { class: `chip ${l === level ? 'on' : ''}`, 'aria-pressed': String(l === level), onClick: () => { app.store.update((s) => { s.level = l; }); app.go(here()); } }, l),
  );
  const difficultyBtns = ([1, 2, 3] as const).map((l) =>
    h('button', { class: `chip ${l === difficulty ? 'on' : ''}`, onClick: () => { setPref('level', String(l)); app.go(here(unit.id)); } }, ['🐱 Easy', '😼 Medium', '🦁 Hard'][l - 1]!),
  );
  // the lessons you can open, then one locked lesson to aim for; the rest are only counted
  const openCount = units.filter((u) => isUnitOpen(u, d)).length;
  const lessonChips = units.slice(0, openCount + 1).map((u, n) => {
    const st = STOPS[u]!;
    const open = n < openCount;
    const got = d.stops[st.id] ?? 0;
    return h('button', { class: `chip ${u === idx ? 'on' : ''}`, disabled: !open, 'aria-label': `Lesson ${n + 1}${open ? '' : ' (locked)'}`, onClick: () => app.go(here(st.id)) }, open ? `${n + 1}${got ? ` ${'★'.repeat(got)}` : ''}` : '🔒');
  });
  const lockedMore = units.length - openCount - 1;

  const games = gameList(GAMES.filter((g) => g.available?.(idx) ?? true), (g) =>
    h(
      'button',
      { class: 'game-card', disabled: needsLesson, onClick: () => app.go(`play/${unit.id}/${g.id}/${difficulty}`) },
      h('span', { class: 'game-emoji' }, g.emoji),
      h('span', { class: 'game-info' }, h('strong', null, g.name), h('small', null, g.blurb)),
      h('span', { class: `skill skill-${g.skill}` }, g.skill),
    ),
  );

  const up = nextLevel(level);
  const el = h(
    'div',
    { class: 'screen stop' },
    h('button', { class: 'btn ghost small', onClick: () => app.go('map') }, '← Map'),
    h(
      'section',
      { class: 'stop-hero' },
      h('div', { class: 'stop-emoji' }, place.emoji),
      h('h1', null, place.name, ' ', ruby(`{${place.jp}|${place.reading}}`, d.settings.furigana)),
      h('button', { class: 'btn ghost small', onClick: () => void speak(place.reading) }, `🔊 ${place.reading}`),
    ),
    h(
      'section',
      { class: 'npc' },
      h('div', { class: 'npc-cat' }, catSvg(place.npc.look, 'smile', 84)),
      h('div', { class: 'speech' }, h('strong', null, `${place.npc.name}`), h('div', { class: 'jp' }, ruby(place.npc.hello[0], d.settings.furigana)), h('div', { class: 'small' }, place.npc.hello[1])),
    ),
    h('section', { class: 'facts' }, h('h3', null, 'Travel notes 📒'), h('ul', null, place.facts.map((f) => h('li', null, f)))),
    h('button', { class: 'btn big', onClick: () => app.go(`explore/${place.id}`) }, `🧭 Explore ${place.name} — sights, souvenirs & quiz`),
    h(
      'section',
      { class: 'level-card' },
      h('h3', null, 'Your level ', h('span', { class: 'chips' }, levelChips)),
      h('p', { class: 'small' }, `${level}: ${LEVEL_BLURB[level]}. Every place has lessons and games at every level — pick the one that suits you.`),
      h('button', { class: 'btn ghost small', onClick: () => app.go('placement') }, '🧭 Not sure? Take the placement test'),
    ),
    h(
      'section',
      { class: 'unit-card' },
      h('div', { class: 'small' }, `${level} · lesson ${units.indexOf(idx) + 1} of ${units.length}${unit.id === place.id ? '' : ` · from ${unit.name} ${unit.emoji}`}`),
      h('h3', { class: 'jp' }, unitTitle(idx)),
      h('div', { class: 'stars big' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('div', { class: 'chips lesson-chips' }, lessonChips, lockedMore > 0 ? h('small', { class: 'hint' }, `+${lockedMore} more to unlock`) : null),
    ),
    levelDone(level, d) && up
      ? h('div', { class: 'callout' }, h('p', null, `🎉 You have finished every ${level} lesson!`), h('button', { class: 'btn primary', onClick: () => { app.store.update((s) => { s.level = up; }); app.go(here()); } }, `Move up to ${up}`))
      : null,
    needsLesson
      ? h('div', { class: 'callout' }, h('p', null, 'New things to learn in this lesson!'), h('button', { class: 'btn primary big', onClick: () => app.go(`lesson/${unit.id}`) }, '📖 Start lesson'))
      : h(
          'div',
          { class: 'row' },
          wordsLeft
            ? h('button', { class: 'btn primary', onClick: () => app.go(`lesson/${unit.id}`) }, `📖 Learn ${Math.min(wordsLeft, 8)} new words (${wordsLeft} left)`)
            : h('button', { class: 'btn ghost', onClick: () => app.go(`lesson/${unit.id}`) }, '📖 Review lesson'),
          grammar ? h('button', { class: 'btn ghost', onClick: () => app.go(`lesson/${unit.id}/grammar`) }, `📐 ${grammar.pattern}${grammars.length > 1 ? ` +${grammars.length - 1}` : ''}`) : null,
        ),
    h('h3', null, 'Play ', h('span', { class: 'chips' }, difficultyBtns)),
    games,
    stars >= 1 ? null : h('p', { class: 'hint' }, 'Earn at least one ★ to open the next lesson.'),
  );
  return { el };
}
