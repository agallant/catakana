import { allowRecognition } from '../core/speech';
import { breakDue } from '../core/kid';
import { Store, level } from '../core/store';
import { configureAudio, sfx } from '../core/audio';
import { h } from './dom';
import { catSvg } from './cat';
import { checkAchievements, onUnlock, type Unlock } from '../core/progress';

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
  readonly toasts = h('div', { class: 'toasts', 'aria-live': 'polite' });
  private current: Screen | null = null;
  /** ask "Who's playing?" once per visit when the device has more than one player */
  private askWho = false;
  private routes = new Map<string, ScreenFactory>();
  private chrome = new Set<string>(['map', 'dojo', 'cats', 'settings', 'stop', 'explore', 'passport', 'shop']);

  constructor(readonly root: HTMLElement) {
    this.askWho = this.store.players().length > 1;
    this.applySettings();
    this.store.subscribe(() => {
      this.applySettings();
      this.renderHud();
    });
    root.replaceChildren(this.hud, this.main, this.nav, this.toasts);
    onUnlock((u) => this.toast(u));
    queueMicrotask(() => checkAchievements(this.store));
    window.addEventListener('hashchange', () => this.render());
  }

  private applySettings(): void {
    const s = this.store.data.settings;
    configureAudio({ sound: s.sound, speech: s.speech, rate: s.speechRate });
    document.documentElement.classList.toggle('reduce-motion', s.reduceMotion);
    document.documentElement.classList.toggle('kid', s.kid);
    document.documentElement.classList.toggle('big-text', s.bigText);
    allowRecognition(!s.kid);
    this.watchBreaks(s.kid);
  }

  private breakTimer: number | undefined;
  private breakSince = Date.now();

  /** Young learners get a gentle "time for a break?" nudge after every 20 minutes of play. */
  private watchBreaks(on: boolean): void {
    if (!on) {
      window.clearInterval(this.breakTimer);
      this.breakTimer = undefined;
      return;
    }
    if (this.breakTimer !== undefined) return;
    this.breakSince = Date.now();
    this.breakTimer = window.setInterval(() => {
      if (!breakDue(this.breakSince, Date.now())) return;
      this.breakSince = Date.now();
      this.toast({ kind: 'quest', emoji: '😴', label: `${this.store.data.name} is sleepy. Time for a stretch and a drink of water?` });
    }, 30_000);
  }

  /** Slide-in notification for quest completions and achievements. */
  toast(u: Unlock): void {
    const t = h('div', { class: `toast toast-${u.kind}` }, h('span', { class: 'toast-emoji' }, u.emoji), h('span', null, u.label));
    this.toasts.appendChild(t);
    sfx.fanfare();
    window.setTimeout(() => t.classList.add('out'), 3200);
    window.setTimeout(() => t.remove(), 3700);
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
    if (this.askWho) {
      this.askWho = false;
      if (this.route().name !== 'who') return this.go('who');
    }
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
      h('button', { class: 'hud-stat', title: 'Fish — spend them at the market', onClick: () => this.go('shop') }, `🐟 ${d.fish}`),
      h('button', { class: 'hud-gear', onClick: () => this.go('settings'), 'aria-label': 'Settings' }, '⚙️'),
    );
  }

  renderNav(active: string): void {
    const items: [string, string, string][] = [
      ['map', '🗾', 'Journey'],
      ['dojo', '🐾', 'Practice'],
      ['shop', '🏮', 'Market'],
      ['passport', '📕', 'Passport'],
      ['cats', '😺', 'Cats'],
    ];
    this.nav.replaceChildren(
      ...items.map(([r, icon, label]) =>
        h(
          'button',
          {
            class: `nav-btn ${active === r || (r === 'map' && (active === 'stop' || active === 'explore')) ? 'active' : ''}`,
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
