import type { App, Screen } from '../ui/app';
import { h, ruby } from '../ui/dom';
import { SHOP, type ShopItem, type ShopKind } from '../data/shop';
import { STOP_BY_ID } from '../data/journey';
import { catSvg } from '../ui/cat';
import { sfx, speak } from '../core/audio';
import { getPref, setPref } from '../core/prefs';
import { readingOf } from './explore';
import { track } from '../core/progress';
import { SEASONAL_TREATS, eventDates, eventEnd, eventFor, eventOfTreat } from '../data/seasons';

type Tab = ShopKind | 'seasonal';

/** Neko Market: spend fish on traditional foods and treasures (each is a trophy). */
export function shopScreen(app: App): Screen {
  const d = app.store.data;
  const tab = (getPref('shop') as Tab | null) ?? 'food';
  const now = eventFor(new Date());
  const owned = new Set(d.owned);
  const reaction = h('div', { class: 'shop-reaction', 'aria-live': 'polite' });

  const buy = (it: ShopItem): void => {
    if (owned.has(it.id)) return;
    if (d.fish < it.cost) {
      sfx.wrong();
      reaction.replaceChildren(h('p', null, `You need 🐟${it.cost - d.fish} more fish — play some games!`));
      return;
    }
    app.store.update((s) => {
      s.fish -= it.cost;
      s.owned.push(it.id);
    });
    sfx.coin();
    track(app.store, { type: 'buy', kind: it.kind });
    if (it.kind === 'food') {
      sfx.purr();
      void speak('いただきます！ おいしい！');
    }
    app.render();
    const r = document.querySelector('.shop-reaction');
    r?.replaceChildren(
      h(
        'div',
        { class: 'callout' },
        h('div', { class: 'result-cat' }, catSvg(d.look, 'wow', 90)),
        h('div', { class: 'big-emoji' }, it.emoji),
        h('p', null, it.kind === 'food' ? `いただきます！ “${it.name}” — おいしい! (delicious!)` : `${it.name} added to your trophy shelf!`),
      ),
    );
  };

  const items = tab === 'seasonal' ? SEASONAL_TREATS : SHOP.filter((it) => it.kind === tab);
  const cards = items.map((it) => {
    const have = owned.has(it.id);
    const region = it.from ? STOP_BY_ID.get(it.from) : undefined;
    const event = eventOfTreat(it.id);
    const outOfSeason = event !== undefined && event !== now && !have;
    const locked = (region !== undefined && d.stops[region.id] === undefined) || outOfSeason;
    return h(
      'article',
      { class: `shop-card ${have ? 'owned' : ''} ${locked ? 'locked' : ''}` },
      h('div', { class: 'spot-emoji' }, locked ? '🔒' : it.emoji),
      h(
        'div',
        { class: 'spot-body' },
        h('h3', null, it.name, region ? h('span', { class: 'tier-chip' }, region.name) : null, event ? h('span', { class: 'tier-chip' }, `${event.emoji} ${event.name}`) : null),
        h('div', { class: 'spot-jp' }, ruby(it.jp, d.settings.furigana), h('button', { class: 'btn small ghost', onClick: () => void speak(readingOf(it.jp)), 'aria-label': `Hear ${it.name}` }, '🔊')),
        h('p', null, outOfSeason ? `Only sold during ${event.name} (${eventDates(event)}).` : locked ? `A specialty of ${region!.name} — travel there to buy it.` : it.about),
      ),
      h('button', { class: `btn ${have ? 'ghost' : 'primary'}`, disabled: have || locked, onClick: () => buy(it) }, have ? (it.kind === 'food' ? 'Tasted ✓' : 'Owned ✓') : `🐟 ${it.cost}`),
    );
  });
  const listFor = (k: Tab): ShopItem[] => (k === 'seasonal' ? SEASONAL_TREATS : SHOP.filter((it) => it.kind === k));
  const chip = (k: Tab, label: string) =>
    h('button', { class: `chip ${tab === k ? 'on' : ''}`, onClick: () => { setPref('shop', k); app.render(); } }, `${label} (${listFor(k).filter((it) => owned.has(it.id)).length}/${listFor(k).length})`);

  const el = h(
    'div',
    { class: 'screen shop-screen' },
    h('h2', null, '🏮 Neko Market'),
    h('p', { class: 'hint' }, 'Spend the fish you earn in games. Every food you taste and treasure you buy becomes a trophy in your passport!'),
    h('div', { class: 'chips' }, chip('food', '🍙 Food'), chip('treasure', '🎎 Treasures'), chip('seasonal', `${now?.emoji ?? '🎐'} Seasonal`)),
    tab === 'seasonal' ? h('p', { class: 'hint' }, now ? `${now.emoji} ${now.name} is on now — its treat is for sale until ${eventEnd(now)}!` : 'No festival right now. Seasonal treats appear during Japanese holidays and festivals — check back!') : null,
    reaction,
    h('div', { class: 'spots' }, cards),
  );
  return { el };
}
