import type { App, Screen } from '../ui/app';
import { h, ruby } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { CULTURE } from '../data/culture';
import { sfx, speak } from '../core/audio';

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
    app.render();
  };
  const msg = h('p', { class: 'hint', 'aria-live': 'polite' });
  const best = d.trivia[stop.id];
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
      h('p', null, best !== undefined ? `Best: ${best}/${c.trivia.length + 3}` : 'Test what you learned about Japan!'),
      h('button', { class: 'btn primary big', onClick: () => app.go(`trivia/${stop.id}`) }, 'Start quiz'),
    ),
  );
  return { el };
}
