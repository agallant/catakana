import type { App, Screen } from '../ui/app';
import { h, ruby } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { CULTURE } from '../data/culture';
import { sfx, speak } from '../core/audio';
import { triviaFor } from './trivia';
import { checkAchievements, track } from '../core/progress';
import { DAY_TRIPS, DAY_TRIP_FISH } from '../data/daytrips';

/** Strip {kanji|kana} markup down to kana for speech. */
export function readingOf(markup: string): string {
  return markup.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2');
}

/** Sightseeing at a stop: landmarks with Japanese names, a souvenir shop, and a trivia challenge. */
export function exploreScreen(app: App, params: string[]): Screen {
  const stop = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  const c = CULTURE[stop.id];
  const d = app.store.data;
  if (!c) return { el: h('div', { class: 'screen' }, 'Nothing to explore here yet.') };
  const owned = d.souvenirs.includes(stop.id);
  const buy = (): void => {
    if (owned) return;
    if (d.fish < c.souvenir.cost) {
      sfx.wrong();
      msg.textContent = `You need 🐟${c.souvenir.cost - d.fish} more fish. Play some games!`;
      return;
    }
    app.store.update((s) => {
      s.fish -= c.souvenir.cost;
      s.souvenirs.push(stop.id);
    });
    sfx.coin();
    track(app.store, { type: 'buy', kind: 'souvenir' });
    app.render();
  };
  const msg = h('p', { class: 'hint', 'aria-live': 'polite' });
  const best = d.trivia[stop.id];
  const trips = DAY_TRIPS.filter((t) => t.from === stop.id).map((t) => {
    const done = d.daytrips.includes(t.id);
    return h(
      'section',
      { class: 'callout daytrip' },
      h('h3', null, `🚃 Day trip: ${t.emoji} ${t.name}`),
      h('div', { class: 'spot-jp' }, ruby(t.jp, d.settings.furigana), h('button', { class: 'btn small ghost', onClick: () => void speak(readingOf(t.jp)), 'aria-label': `Hear ${t.name}` }, '🔊')),
      done ? h('ul', null, t.facts.map((f) => h('li', null, f))) : h('p', { class: 'small' }, `A side trip from ${stop.name} — and a new prefecture for your passport.`),
      done ? h('p', { class: 'jp' }, t.phrase[0], ' ', h('button', { class: 'btn small ghost', onClick: () => void speak(t.phrase[0]), 'aria-label': 'Hear phrase' }, '🔊'), h('br'), h('small', null, t.phrase[1])) : null,
      h(
        'button',
        {
          class: `btn ${done ? 'ghost' : 'primary'}`,
          disabled: done,
          onClick: () => {
            app.store.update((s) => {
              if (!s.daytrips.includes(t.id)) {
                s.daytrips.push(t.id);
                s.fish += DAY_TRIP_FISH;
              }
            });
            sfx.coin();
            void speak(t.phrase[0]);
            // a new prefecture can unlock Prefecture Hopper / Nationwide Cat
            checkAchievements(app.store);
            app.render();
          },
        },
        done ? 'Visited ✓' : `Go! (+🐟${DAY_TRIP_FISH})`,
      ),
    );
  });
  const el = h(
    'div',
    { class: 'screen explore' },
    h('button', { class: 'btn ghost small', onClick: () => app.go(`stop/${stop.id}`) }, `← ${stop.name}`),
    h('h2', null, `🧭 Explore ${stop.name}`),
    h(
      'div',
      { class: 'spots' },
      c.spots.map((sp) => {
        const key = `${stop.id}:${sp.name}`;
        const snapped = d.photos.includes(key);
        const photo = h(
          'button',
          {
            class: `btn small ${snapped ? 'ghost' : 'primary'}`,
            disabled: snapped,
            onClick: () => {
              app.store.update((s) => {
                if (!s.photos.includes(key)) {
                  s.photos.push(key);
                  s.fish += 3;
                }
              });
              sfx.coin();
              track(app.store, { type: 'photo' });
              app.render();
            },
          },
          snapped ? '📸 In your passport' : '📸 Take a photo (+🐟3)',
        );
        return h(
          'article',
          { class: `spot ${snapped ? 'snapped' : ''}` },
          h('div', { class: 'spot-emoji' }, sp.emoji),
          h(
            'div',
            { class: 'spot-body' },
            h('h3', null, sp.name),
            h('div', { class: 'spot-jp' }, ruby(sp.jp, d.settings.furigana), h('button', { class: 'btn small ghost', onClick: () => void speak(readingOf(sp.jp)), 'aria-label': `Hear ${sp.name}` }, '🔊')),
            sp.tags?.length ? h('div', { class: 'tags' }, sp.tags.map((t) => h('span', { class: `tag tag-${t}` }, t === 'castle' ? '🏯 Castle' : '🌏 World Heritage'))) : null,
            h('p', null, sp.about),
            photo,
          ),
        );
      }),
    ),
    ...trips,
    h(
      'section',
      { class: 'shop' },
      h('h3', null, '🎁 Omiyage (souvenir) shop'),
      h('p', { class: 'small' }, 'In Japan, travelers bring local treats called omiyage home for friends and coworkers.'),
      h(
        'div',
        { class: 'souvenir' },
        h('span', { class: 'spot-emoji' }, c.souvenir.emoji),
        h('span', { class: 'spot-body' }, h('strong', null, c.souvenir.name), h('span', { class: 'jp' }, ` ${c.souvenir.jp}`)),
        h('button', { class: `btn ${owned ? 'ghost' : 'primary'}`, onClick: buy, disabled: owned }, owned ? 'Owned ✓' : `🐟 ${c.souvenir.cost}`),
      ),
      msg,
    ),
    h(
      'section',
      { class: 'callout' },
      h('h3', null, '🎤 Tour-guide quiz'),
      h('p', null, best !== undefined ? `Best: ${best}/${triviaFor(stop.id).length}` : 'Test what you learned about Japan!'),
      h('button', { class: 'btn primary big', onClick: () => app.go(`trivia/${stop.id}`) }, 'Start quiz'),
    ),
  );
  return { el };
}
