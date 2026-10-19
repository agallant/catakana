import { Store, level } from '../core/store';
import { configureAudio, sfx } from '../core/audio';
import { h } from './dom';
import { catSvg } from './cat';

export type Route = { name: string; params: string[] };

export interface Screen {
  el: HTMLElement;
  /** called when navigating away */
  dispose?(): void;
}

export type ScreenFactory = (app: App, params: string[]) => Screen;

export class App {
  readonly store = new Store();
  readonly main = h('main', { class: 'main', id: 'main' });
  readonly hud = h('header', { class: 'hud' });
  readonly nav = h('nav', { class: 'nav', 'aria-label': 'Main' });
  private current: Screen | null = null;
  private routes = new Map<string, ScreenFactory>();
  private chrome = new Set<string>(['map', 'dojo', 'cats', 'settings', 'stop']);

  constructor(readonly root: HTMLElement) {
    this.applySettings();
    this.store.subscribe(() => {
      this.applySettings();
      this.renderHud();
    });
    root.replaceChildren(this.hud, this.main, this.nav);
    window.addEventListener('hashchange', () => this.render());
  }

  private applySettings(): void {
    const s = this.store.data.settings;
    configureAudio({ sound: s.sound, speech: s.speech, rate: s.speechRate });
    document.documentElement.classList.toggle('reduce-motion', s.reduceMotion);
  }

  register(name: string, f: ScreenFactory): void {
    this.routes.set(name, f);
  }

  go(path: string): void {
    if (location.hash === `#/${path}`) this.render();
    else location.hash = `#/${path}`;
  }

  route(): Route {
    const raw = location.hash.replace(/^#\/?/, '');
    const [name = '', ...params] = raw.split('/').map(decodeURIComponent);
    return { name: name || (this.store.data.started ? 'map' : 'welcome'), params };
  }

  render(): void {
    const { name, params } = this.route();
    const f = this.routes.get(name) ?? this.routes.get('map')!;
    this.current?.dispose?.();
    window.speechSynthesis?.cancel?.();
    this.current = f(this, params);
    this.main.replaceChildren(this.current.el);
    const chrome = this.chrome.has(name);
    this.hud.hidden = !chrome;
    this.nav.hidden = !chrome;
    document.body.dataset.screen = name;
    if (chrome) {
      this.renderHud();
      this.renderNav(name);
    }
    window.scrollTo(0, 0);
  }

  renderHud(): void {
    const d = this.store.data;
    const lv = level(d.xp);
    this.hud.replaceChildren(
      h('button', { class: 'hud-cat', onClick: () => this.go('cats'), 'aria-label': 'My cat' }, catSvg(d.look, 'happy', 44)),
      h(
        'div',
        { class: 'hud-lvl' },
        h('div', { class: 'hud-name' }, `${d.name} · Lv ${lv.level}`),
        h('div', { class: 'xpbar', role: 'progressbar', 'aria-valuenow': lv.into, 'aria-valuemax': lv.need }, h('div', { class: 'xpfill', style: `width:${Math.round((lv.into / lv.need) * 100)}%` })),
      ),
      h('div', { class: 'hud-stat', title: 'Day streak' }, `🔥 ${d.streak}`),
      h('div', { class: 'hud-stat', title: 'Fish' }, `🐟 ${d.fish}`),
    );
  }

  renderNav(active: string): void {
    const items: [string, string, string][] = [
      ['map', '🗾', 'Journey'],
      ['dojo', '🐾', 'Practice'],
      ['cats', '😺', 'Cats'],
      ['settings', '⚙️', 'Settings'],
    ];
    this.nav.replaceChildren(
      ...items.map(([r, icon, label]) =>
        h(
          'button',
          {
            class: `nav-btn ${active === r || (r === 'map' && active === 'stop') ? 'active' : ''}`,
            onClick: () => {
              sfx.tap();
              this.go(r);
            },
            'aria-current': active === r ? 'page' : undefined,
          },
          h('span', { class: 'nav-ico', 'aria-hidden': 'true' }, icon),
          h('span', null, label),
        ),
      ),
    );
  }
}
