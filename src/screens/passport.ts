import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { STOPS } from '../data/journey';
import { CULTURE } from '../data/culture';
import { stampSvg } from '../ui/stamp';

/** Travel passport: eki stamps from each station and the omiyage you bought. */
export function passportScreen(app: App): Screen {
  const d = app.store.data;
  const stamps = STOPS.map((st) => {
    const got = d.stamps.includes(st.id);
    return h('button', { class: 'stamp-cell', disabled: !got, onClick: () => app.go(`stop/${st.id}`), 'aria-label': got ? st.name : 'Not visited' }, stampSvg(st, 84, got), h('small', null, got ? st.name : '—'));
  });
  const souvenirs = STOPS.filter((st) => d.souvenirs.includes(st.id)).map((st) => {
    const sv = CULTURE[st.id]!.souvenir;
    return h('div', { class: 'souvenir-cell' }, h('span', { class: 'spot-emoji' }, sv.emoji), h('strong', null, sv.name), h('small', null, st.name));
  });
  const el = h(
    'div',
    { class: 'screen passport' },
    h('h2', null, '📕 Travel passport'),
    h('p', { class: 'hint' }, 'Japanese train stations have rubber “eki stamps” for travelers to collect. Visit every stop to fill your book!'),
    h('h3', null, `Eki stamps (${d.stamps.length}/${STOPS.length})`),
    h('div', { class: 'stamp-grid' }, stamps),
    h('h3', null, `Omiyage (${d.souvenirs.length}/${STOPS.length})`),
    souvenirs.length ? h('div', { class: 'cat-grid' }, souvenirs) : h('p', { class: 'hint' }, 'Buy souvenirs in the Explore section of each stop.'),
  );
  return { el };
}
