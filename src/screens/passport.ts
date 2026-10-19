import type { App, Screen } from '../ui/app';
import { h, ruby } from '../ui/dom';
import { STOPS } from '../data/journey';
import { CULTURE, type SpotTag } from '../data/culture';
import { SHOP, type ShopKind } from '../data/shop';
import { EVENTS } from '../data/seasons';
import { PREFECTURES, STOP_PREFECTURE, visitedPrefectures } from '../data/prefectures';
import { stampSvg } from '../ui/stamp';
import { ACHIEVEMENTS } from '../core/progress';

interface Badge {
  emoji: string;
  label: string;
  sub: string;
  got: boolean;
}

function shelf(title: string, badges: Badge[], empty: string): HTMLElement[] {
  const got = badges.filter((b) => b.got).length;
  return [
    h('h3', null, `${title} (${got}/${badges.length})`),
    badges.length
      ? h(
          'div',
          { class: 'trophy-grid' },
          badges.map((b) => h('div', { class: `trophy ${b.got ? '' : 'missing'}`, title: b.got ? b.label : empty }, h('span', { class: 'trophy-emoji' }, b.got ? b.emoji : '❔'), h('strong', null, b.got ? b.label : '???'), h('small', null, b.sub))),
        )
      : h('p', { class: 'hint' }, empty),
  ];
}

/** Travel passport: eki stamps, photographed castles & World Heritage sites, souvenirs and market trophies. */
export function passportScreen(app: App): Screen {
  const d = app.store.data;
  const stamps = STOPS.map((st) => {
    const got = d.stamps.includes(st.id);
    return h('button', { class: 'stamp-cell', disabled: !got, onClick: () => app.go(`stop/${st.id}`), 'aria-label': got ? st.name : 'Not visited' }, stampSvg(st, 84, got), h('small', null, got ? st.name : '—'));
  });
  const photos = new Set(d.photos);
  const sights = (tag: SpotTag): Badge[] =>
    STOPS.flatMap((st) =>
      (CULTURE[st.id]?.spots ?? [])
        .filter((sp) => sp.tags?.includes(tag))
        .map((sp) => ({ emoji: sp.emoji, label: sp.name, sub: st.name, got: photos.has(`${st.id}:${sp.name}`) })),
    );
  const owned = new Set(d.owned);
  const market = (kind: ShopKind): Badge[] => SHOP.filter((it) => it.kind === kind).map((it) => ({ emoji: it.emoji, label: it.name, sub: kind === 'food' ? 'tasted' : 'treasure', got: owned.has(it.id) }));
  const seasonal: Badge[] = EVENTS.map((e) => ({ emoji: e.treat.emoji, label: e.treat.name, sub: e.name, got: owned.has(e.treat.id) }));
  const souvenirs: Badge[] = STOPS.filter((st) => CULTURE[st.id]).map((st) => {
    const sv = CULTURE[st.id]!.souvenir;
    return { emoji: sv.emoji, label: sv.name, sub: st.name, got: d.souvenirs.includes(st.id) };
  });

  const visited = visitedPrefectures(d.stamps);
  const onRoute = new Set(Object.values(STOP_PREFECTURE));
  const prefGrid = h(
    'div',
    { class: 'trophy-grid' },
    PREFECTURES.map((p) => {
      const got = visited.has(p.id);
      return h(
        'div',
        { class: `trophy pref ${got ? '' : 'missing'}`, title: got ? p.meibutsu : onRoute.has(p.id) ? 'Travel there to collect it' : 'Not on the route yet' },
        h('span', { class: 'trophy-emoji' }, got ? p.emoji : '🗾'),
        h('strong', null, p.name),
        h('small', { class: 'jp' }, ruby(p.jp, d.settings.furigana)),
        got ? h('small', null, p.meibutsu) : null,
      );
    }),
  );

  const el = h(
    'div',
    { class: 'screen passport' },
    h('h2', null, '📕 Travel passport'),
    h('p', { class: 'hint' }, 'Japanese train stations have rubber “eki stamps” for travelers to collect. Fill your book — and your trophy shelves!'),
    h('h3', null, `Eki stamps (${d.stamps.length}/${STOPS.length})`),
    h('div', { class: 'stamp-grid' }, stamps),
    h('h3', null, `🗾 Prefectures (${visited.size}/${PREFECTURES.length})`),
    h('p', { class: 'hint' }, 'Japan has 47 prefectures. Each one you visit shows off its famous local food or specialty (meibutsu).'),
    prefGrid,
    ...shelf('🏯 Castles', sights('castle'), 'Photograph castles in Explore.'),
    ...shelf('🌏 World Heritage sites', sights('heritage'), 'Photograph UNESCO sites in Explore.'),
    ...shelf('🍙 Foods tasted', market('food'), 'Buy food at the Neko Market.'),
    ...shelf('🎎 Treasures', market('treasure'), 'Buy treasures at the Neko Market.'),
    ...shelf('🎐 Seasonal treats', seasonal, 'Buy limited treats at the Neko Market during Japanese festivals.'),
    ...shelf('🎁 Omiyage', souvenirs, 'Buy souvenirs in Explore.'),
    h('h3', null, `🏅 Achievements (${d.achievements.length}/${ACHIEVEMENTS.length})`),
    h(
      'div',
      { class: 'ach-grid' },
      ACHIEVEMENTS.map((a) => {
        const got = d.achievements.includes(a.id);
        return h('div', { class: `ach ${got ? '' : 'locked'}` }, h('span', { class: 'ach-emoji' }, a.emoji), h('span', null, h('strong', null, a.name), h('br'), h('small', null, a.desc)));
      }),
    ),
    h('button', { class: 'btn primary big', onClick: () => app.go('shop') }, '🏮 Go to the Neko Market'),
  );
  return { el };
}
