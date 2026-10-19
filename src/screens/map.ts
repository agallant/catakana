import type { App, Screen } from '../ui/app';
import { h, s } from '../ui/dom';
import { STOPS, TRANSPORT_EMOJI } from '../data/journey';
import { currentStopIndex, isStopUnlocked } from '../core/curriculum';
import { sfx } from '../core/audio';
import { catSvg } from '../ui/cat';
import { questsFor } from '../core/progress';
import { dayKey } from '../core/store';

const W = 520;
const H = 590;
const proj = ([lon, lat]: [number, number]): [number, number] => [(lon - 122.6) * 22, (46 - lat) * 26];

// Coarse island outlines (lon, lat) — a friendly cartoon of Japan.
const ISLANDS: [number, number][][] = [
  // Hokkaido
  [[141.94, 45.52], [142.6, 45.0], [143.3, 44.4], [144.3, 44.0], [145.2, 44.3], [145.0, 43.7], [145.6, 43.4], [145.0, 43.1], [144.0, 42.9], [143.3, 42.2], [142.5, 42.6], [141.7, 42.6], [141.0, 42.35], [140.6, 42.55], [140.55, 42.1], [140.95, 41.95], [140.72, 41.77], [140.1, 41.43], [139.85, 42.0], [140.0, 42.6], [140.4, 43.35], [141.0, 43.2], [141.4, 43.6], [141.65, 44.3], [141.75, 45.0]],
  // Honshu
  [[140.9, 41.5], [141.45, 41.4], [141.4, 40.6], [142.0, 39.6], [141.6, 38.9], [141.5, 38.3], [140.95, 38.25], [141.0, 37.5], [140.9, 36.9], [140.6, 36.4], [140.85, 35.75], [140.4, 35.15], [139.85, 34.9], [139.85, 35.3], [139.95, 35.65], [139.65, 35.45], [139.65, 35.15], [139.15, 35.25], [139.1, 34.75], [138.85, 34.6], [138.75, 34.95], [138.4, 34.65], [137.6, 34.65], [137.0, 34.6], [136.9, 35.05], [136.65, 34.6], [136.85, 34.3], [136.2, 34.1], [135.8, 33.45], [135.1, 33.9], [135.15, 34.3], [135.4, 34.65], [135.2, 34.7], [134.7, 34.75], [134.0, 34.6], [133.4, 34.4], [132.5, 34.35], [132.0, 34.0], [131.4, 34.0], [130.9, 33.95], [130.95, 34.35], [131.5, 34.6], [132.1, 35.05], [132.7, 35.45], [133.3, 35.55], [134.2, 35.55], [135.2, 35.75], [135.5, 35.55], [136.0, 35.75], [136.1, 36.25], [136.7, 36.85], [136.8, 37.35], [137.3, 37.5], [137.0, 37.1], [137.0, 36.75], [137.6, 36.95], [138.25, 37.2], [139.05, 37.95], [139.5, 38.5], [139.9, 39.2], [139.8, 39.95], [140.0, 40.5], [139.9, 40.6], [140.3, 41.2], [140.75, 40.85], [141.15, 41.15]],
  // Shikoku
  [[132.0, 33.35], [132.7, 33.85], [133.2, 34.0], [134.05, 34.35], [134.6, 34.2], [134.7, 33.8], [134.18, 33.25], [133.55, 33.5], [133.0, 32.75], [132.5, 32.9], [132.4, 33.3]],
  // Kyushu
  [[130.9, 33.9], [131.2, 33.6], [131.7, 33.6], [131.9, 33.1], [131.6, 32.6], [131.45, 31.6], [131.3, 31.4], [130.7, 31.0], [130.65, 31.4], [130.3, 31.25], [130.15, 31.5], [130.2, 32.1], [130.6, 32.7], [130.2, 32.8], [129.85, 32.75], [129.6, 33.1], [129.8, 33.4], [130.1, 33.55], [130.5, 33.85]],
  // Yakushima
  [[130.4, 30.35], [130.55, 30.45], [130.68, 30.35], [130.55, 30.25]],
  // Iriomote
  [[123.68, 24.3], [123.8, 24.42], [123.95, 24.35], [123.9, 24.22], [123.75, 24.22]],
  // Okinawa main island
  [[127.65, 26.08], [127.9, 26.4], [128.25, 26.85], [128.2, 26.9], [127.95, 26.6], [127.7, 26.4]],
];

export function mapScreen(app: App): Screen {
  const d = app.store.data;
  const cur = currentStopIndex(d);
  const route = STOPS.map((st) => proj(st.lonlat));

  const islands = ISLANDS.map((poly) =>
    s('polygon', { points: poly.map((p) => proj(p).join(',')).join(' '), class: 'island' }),
  );
  // only the part of the route travelled so far, plus the leg to the next stop
  const path = s('polyline', { points: route.slice(0, cur + 2).map((p) => p.join(',')).join(' '), class: 'route' });
  const dots = STOPS.map((st, i) => {
    const [x, y] = route[i]!;
    const unlocked = isStopUnlocked(i, d);
    const stars = d.stops[st.id] ?? 0;
    const g = s(
      'g',
      { class: `stop ${unlocked ? 'open' : 'locked'} ${i === cur ? 'current' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${st.name}${unlocked ? '' : ' (locked)'}` },
      s('circle', { cx: x, cy: y, r: 11 }),
      s('text', { x, y: y + 4, 'text-anchor': 'middle', class: 'map-emoji' }, unlocked ? st.emoji : '🔒'),
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
    if (stars) g.appendChild(s('text', { x, y: y - 14, 'text-anchor': 'middle', class: 'map-stars' }, '★'.repeat(stars)));
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
      h('span', { class: 'stop-row-main' }, h('strong', null, st.name), h('span', { class: 'jp small' }, ` ${st.jp}`), h('small', null, `${TRANSPORT_EMOJI[st.transport]} ${st.region}`, h('span', { class: 'tier-chip' }, st.tier))),
      h('span', { class: 'stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
    );
    return b;
  });

  const today = dayKey();
  const progress = d.daily.day === today ? d.daily.progress : {};
  const quests = h(
    'section',
    { class: 'quests' },
    h('h3', null, '📜 Today’s quests'),
    questsFor(today).map((q) => {
      const p = Math.min(q.goal, progress[q.id] ?? 0);
      return h(
        'div',
        { class: `quest ${p >= q.goal ? 'done' : ''}` },
        h('span', { class: 'quest-emoji' }, p >= q.goal ? '✅' : q.emoji),
        h('div', { class: 'quest-main' }, `${q.label} · ${p}/${q.goal}`, h('div', { class: 'quest-bar' }, h('div', { class: 'quest-fill', style: `width:${(p / q.goal) * 100}%` }))),
        h('small', null, `🐟${q.fish}`),
      );
    }),
  );

  const el = h(
    'div',
    { class: 'screen map-screen' },
    h(
      'section',
      { class: 'next-card' },
      h('div', { class: 'next-cat' }, catSvg(d.look, 'smile', 72)),
      h(
        'div',
        { class: 'next-text' },
        h('div', { class: 'small' }, done ? 'Journey complete — keep practicing!' : 'Next destination'),
        h('h2', null, `${next.emoji} ${next.name}`, h('span', { class: 'jp small' }, ` ${next.jp}`)),
        h('button', { class: 'btn primary', onClick: () => app.go((d.stops[next.id] ?? -1) < 0 ? `travel/${next.id}` : `stop/${next.id}`) }, d.stops[next.id] === undefined ? `${TRANSPORT_EMOJI[next.transport]} Travel there` : '▶ Continue'),
      ),
    ),
    quests,
    info,
    h('div', { class: 'map-wrap' }, svg),
    h('h3', null, 'All stops'),
    h('div', { class: 'stop-list' }, list),
  );
  return { el };
}
