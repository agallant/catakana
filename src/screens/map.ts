import type { App, Screen } from '../ui/app';
import { h, s } from '../ui/dom';
import { STOPS, TRANSPORT_EMOJI } from '../data/journey';
import { currentStopIndex, isStopUnlocked } from '../core/curriculum';
import { sfx } from '../core/audio';
import { catSvg } from '../ui/cat';

const W = 520;
const H = 560;
const proj = ([lon, lat]: [number, number]): [number, number] => [(lon - 126) * 22, (46 - lat) * 26];

// Coarse island outlines (lon, lat) — a friendly cartoon of Japan.
const ISLANDS: [number, number][][] = [
  // Honshu
  [[141.4, 41.5], [141.5, 40.5], [141.9, 39.5], [141.5, 38.3], [141.0, 37.0], [140.9, 36.0], [140.8, 35.7], [140.0, 35.1], [139.85, 34.9], [139.8, 35.3], [139.6, 35.3], [139.2, 35.2], [138.9, 34.7], [138.2, 34.6], [137.0, 34.6], [136.9, 35.0], [136.7, 34.3], [135.9, 33.5], [135.8, 33.45], [135.1, 34.0], [135.2, 34.7], [134.4, 34.7], [133.0, 34.4], [132.2, 34.1], [131.0, 33.95], [130.9, 34.4], [131.8, 34.6], [132.5, 35.4], [133.5, 35.5], [135.2, 35.7], [136.0, 36.1], [136.8, 37.4], [137.2, 37.5], [137.0, 36.8], [138.2, 37.2], [139.0, 38.0], [139.8, 39.5], [140.0, 40.5], [140.3, 41.2], [140.7, 41.3]],
  // Hokkaido
  [[140.0, 41.4], [140.7, 42.5], [141.5, 42.7], [143.2, 42.0], [145.5, 43.3], [144.5, 44.0], [143.5, 44.5], [141.7, 45.5], [141.5, 44.2], [140.3, 43.3], [139.8, 42.8]],
  // Kyushu
  [[130.9, 33.9], [131.7, 33.6], [131.9, 32.8], [131.6, 31.4], [131.0, 31.2], [130.7, 31.0], [130.2, 31.3], [130.2, 32.2], [129.9, 32.8], [129.7, 33.3], [130.1, 33.5]],
  // Shikoku
  [[132.5, 33.9], [133.0, 34.1], [134.0, 34.2], [134.7, 34.0], [134.3, 33.3], [133.3, 33.0], [132.5, 32.9], [132.1, 33.4]],
  // Okinawa main island
  [[127.6, 26.6], [128.0, 26.5], [127.9, 26.1], [127.7, 26.0], [127.6, 26.3]],
];

export function mapScreen(app: App): Screen {
  const d = app.store.data;
  const cur = currentStopIndex(d);
  const route = STOPS.map((st) => proj(st.lonlat));

  const islands = ISLANDS.map((poly) =>
    s('polygon', { points: poly.map((p) => proj(p).join(',')).join(' '), class: 'island' }),
  );
  const path = s('polyline', { points: route.map((p) => p.join(',')).join(' '), class: 'route' });
  const dots = STOPS.map((st, i) => {
    const [x, y] = route[i]!;
    const unlocked = isStopUnlocked(i, d);
    const stars = d.stops[st.id] ?? 0;
    const g = s(
      'g',
      { class: `stop ${unlocked ? 'open' : 'locked'} ${i === cur ? 'current' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${st.name}${unlocked ? '' : ' (locked)'}` },
      s('circle', { cx: x, cy: y, r: 11 }),
      s('text', { x, y: y + 4, 'text-anchor': 'middle', class: 'stop-emoji' }, unlocked ? st.emoji : '🔒'),
    );
    const act = (): void => {
      sfx.tap();
      if (unlocked) app.go(`stop/${st.id}`);
      else info.textContent = `Finish ${STOPS[i - 1]!.name} first to unlock ${st.name}.`;
    };
    g.addEventListener('click', act);
    g.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') act();
    });
    if (stars) g.appendChild(s('text', { x, y: y - 14, 'text-anchor': 'middle', class: 'stop-stars' }, '★'.repeat(stars)));
    return g;
  });
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'japan', role: 'group', 'aria-label': 'Map of Japan' }, ...islands, path, ...dots);

  const info = h('div', { class: 'map-info', 'aria-live': 'polite' });
  const next = STOPS[cur]!;
  const done = STOPS.every((st) => (d.stops[st.id] ?? 0) >= 1);

  const list = STOPS.map((st, i) => {
    const unlocked = isStopUnlocked(i, d);
    const stars = d.stops[st.id] ?? 0;
    const b = h(
      'button',
      { class: `stop-row ${unlocked ? '' : 'locked'} ${i === cur ? 'current' : ''}`, disabled: !unlocked, onClick: () => app.go(`stop/${st.id}`) },
      h('span', { class: 'stop-row-emoji' }, unlocked ? st.emoji : '🔒'),
      h('span', { class: 'stop-row-main' }, h('strong', null, st.name), h('span', { class: 'jp small' }, ` ${st.jp}`), h('small', null, `${TRANSPORT_EMOJI[st.transport]} ${st.region}`)),
      h('span', { class: 'stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
    );
    return b;
  });

  const el = h(
    'div',
    { class: 'screen map-screen' },
    h(
      'section',
      { class: 'next-card' },
      h('div', { class: 'next-cat' }, catSvg(d.look, 'happy', 72)),
      h(
        'div',
        { class: 'next-text' },
        h('div', { class: 'small' }, done ? 'Journey complete — keep practicing!' : 'Next destination'),
        h('h2', null, `${next.emoji} ${next.name}`, h('span', { class: 'jp small' }, ` ${next.jp}`)),
        h('button', { class: 'btn primary', onClick: () => app.go((d.stops[next.id] ?? -1) < 0 ? `travel/${next.id}` : `stop/${next.id}`) }, d.stops[next.id] === undefined ? `${TRANSPORT_EMOJI[next.transport]} Travel there` : '▶ Continue'),
      ),
    ),
    info,
    h('div', { class: 'map-wrap' }, svg),
    h('h3', null, 'All stops'),
    h('div', { class: 'stop-list' }, list),
  );
  return { el };
}
