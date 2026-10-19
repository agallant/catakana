import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { catSvg, FUR_PRESETS } from '../ui/cat';
import { HATS, npcCats } from '../core/cats';
import { sfx } from '../core/audio';

export function catsScreen(app: App): Screen {
  const d = app.store.data;
  const owned = new Set(d.unlockedHats);
  const preview = h('div', { class: 'welcome-cat' }, catSvg(d.look, 'smile', 170));
  const hats = HATS.map((hat) => {
    const have = owned.has(hat.id) || hat.cost === 0;
    return h(
      'button',
      {
        class: `chip ${d.look.hat === hat.id ? 'on' : ''}`,
        onClick: () => {
          if (!have) {
            if (d.fish < hat.cost) return void sfx.wrong();
            app.store.update((s) => {
              s.fish -= hat.cost;
              s.unlockedHats.push(hat.id);
            });
          }
          app.store.update((s) => {
            s.look.hat = hat.id;
          });
          sfx.coin();
          app.render();
        },
      },
      have ? hat.name : `${hat.name} 🐟${hat.cost}`,
    );
  });
  const furs = FUR_PRESETS.map((p) =>
    h('button', {
      class: 'swatch',
      style: `background:${p.fur};border-color:${p.accent}`,
      'aria-label': `Fur ${p.fur}`,
      onClick: () => {
        app.store.update((s) => Object.assign(s.look, { fur: p.fur, accent: p.accent, pattern: p.pattern }));
        sfx.tap();
        app.render();
      },
    }),
  );
  const all = npcCats();
  const grid = all.map((c) => {
    const got = d.cats.includes(c.id);
    return h('div', { class: `cat-card ${got ? '' : 'unseen'}` }, h('div', null, catSvg(c.look, 'smile', 72)), h('strong', null, got ? c.name : '???'), h('small', null, got ? c.from : 'Not met yet'));
  });
  const el = h(
    'div',
    { class: 'screen cats' },
    h('h2', null, `😺 ${d.name}`),
    preview,
    h('div', { class: 'swatches' }, furs),
    h('h3', null, 'Wardrobe'),
    h('div', { class: 'chips' }, hats),
    h('h3', null, `Cat collection (${d.cats.length}/${all.length})`),
    h('div', { class: 'cat-grid' }, grid),
  );
  return { el };
}
