import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { STOP_BY_ID, STOPS, TRANSPORT_EMOJI } from '../data/journey';
import { catSvg } from '../ui/cat';
import { sfx, speak } from '../core/audio';

const VERB: Record<string, string> = { plane: 'Flying', train: 'Riding the train', shinkansen: 'Zooming on the shinkansen', bus: 'Taking the bus', ferry: 'Sailing on the ferry' };

/** Animated journey between stops, with a fun fact about the destination. */
export function travelScreen(app: App, params: string[]): Screen {
  const stop = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  const idx = STOPS.indexOf(stop);
  const from = idx > 0 ? STOPS[idx - 1]!.name : 'Home';
  const fact = stop.facts[Math.floor(Math.random() * stop.facts.length)]!;

  const arrive = (): void => {
    app.store.update((d) => {
      if (d.stops[stop.id] === undefined) d.stops[stop.id] = 0;
      if (!d.stamps.includes(stop.id)) d.stamps.push(stop.id);
    });
    sfx.meow();
    app.go(`stop/${stop.id}`);
  };
  const el = h(
    'div',
    { class: `screen travel t-${stop.transport}` },
    h('div', { class: 'sky' }),
    h('div', { class: 'scenery' }, h('div', { class: 'hills' }), h('div', { class: 'ground' })),
    h('div', { class: 'vehicle' }, h('span', { class: 'veh-emoji' }, TRANSPORT_EMOJI[stop.transport]), h('span', { class: 'veh-cat' }, catSvg(app.store.data.look, 'happy', 56))),
    h(
      'div',
      { class: 'travel-card' },
      h('h2', null, `${VERB[stop.transport]}…`),
      h('p', null, `${from} → ${stop.name} ${stop.emoji}`),
      h('p', { class: 'jp lead' }, `${stop.jp}（${stop.reading}）`),
      h('div', { class: 'fact' }, h('strong', null, 'Did you know? '), fact),
      h('div', { class: 'announce jp' }, `まもなく、${stop.reading}です。`),
      h('p', { class: 'small' }, `“We will soon arrive at ${stop.name}.” — listen for “mamonaku” (soon) on real trains!`),
      h('div', { class: 'row' }, h('button', { class: 'btn ghost', onClick: () => void speak(`まもなく、${stop.reading}です。`) }, '🔊 Announcement'), h('button', { class: 'btn primary big', onClick: arrive }, `Arrive in ${stop.name} 🐾`)),
    ),
  );
  sfx.purr();
  window.setTimeout(() => void speak(`まもなく、${stop.reading}です。`), 1800);
  return { el };
}
