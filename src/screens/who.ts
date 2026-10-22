import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { sfx } from '../core/audio';

/** Shown when the app opens on a device with more than one player, so nobody plays on someone else's save. */
export function whoScreen(app: App): Screen {
  const store = app.store;
  const el = h(
    'div',
    { class: 'screen who' },
    h('h2', null, '🐱 Who’s playing?'),
    h(
      'div',
      { class: 'who-list' },
      ...store.players().map((p) =>
        h(
          'button',
          {
            class: `btn big ${p.active ? '' : 'ghost'}`,
            onClick: () => {
              sfx.meow();
              store.switchPlayer(p.id);
              const back = app.takeResume();
              app.go(store.data.started ? back || 'map' : 'welcome');
            },
          },
          `🐱 ${p.name}`,
        ),
      ),
    ),
  );
  return { el };
}
