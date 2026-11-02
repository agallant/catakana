import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameDef } from '../src/games/types';

// a game that is won at once, so the results screen can be checked without playing one
vi.mock('../src/games', async (orig) => {
  const m = await orig<typeof import('../src/games')>();
  const instantWin: GameDef = { id: 'instant', name: 'Instant', jp: '', emoji: '⚡', blurb: '', kinds: ['kana'], skill: 'reading', start: (ctx) => void setTimeout(() => ctx.finish({ correct: 10, total: 10 }), 0) };
  return { ...m, GAME_BY_ID: new Map([...m.GAME_BY_ID, ['instant', instantWin]]) };
});

import { stopScreen } from '../src/screens/stop';
import { mapScreen } from '../src/screens/map';
import { playScreen } from '../src/screens/play';
import { Store } from '../src/core/store';
import { STOPS } from '../src/data/journey';
import { unitsOf } from '../src/core/curriculum';
import type { App } from '../src/ui/app';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

const fakeApp = (store: Store, place = ''): App & { go: ReturnType<typeof vi.fn> } => ({ store, go: vi.fn(), place, render: vi.fn() }) as unknown as App & { go: ReturnType<typeof vi.fn> };

/** Show the game on the page (a game that ends after the player left gets no results), then let it end. */
async function played(app: App, params: string[]): Promise<HTMLElement> {
  const el = playScreen(app, params).el;
  document.body.replaceChildren(el);
  await new Promise((r) => setTimeout(r, 5));
  return el;
}

const text = (el: HTMLElement): string => (el.textContent ?? '').replace(/\s+/g, ' ');

describe('places and levels', () => {
  let store: Store;
  beforeEach(() => {
    store = new Store(mem());
    store.update((d) => {
      d.started = true;
    });
  });

  it('offers the lessons of your level at every place, whichever place it is', () => {
    store.update((d) => (d.level = 'N3'));
    const n3 = STOPS[unitsOf('N3')[0]!]!;
    for (const place of ['tokyo', 'hakodate', 'gotokuji', 'okinawa']) {
      const app = fakeApp(store);
      const card = stopScreen(app, [place]).el.querySelector<HTMLElement>('.unit-card')!;
      expect(text(card), place).toContain('N3 · lesson 1 of 12');
      expect(text(card), place).toContain(n3.name);
      expect(app.place).toBe(place);
    }
  });
  it('lets you change level at a place, and shows that level’s lesson instead', () => {
    const app = fakeApp(store);
    const el = stopScreen(app, ['kyoto']).el;
    expect(text(el.querySelector<HTMLElement>('.unit-card')!)).toContain('Kana · lesson 1');
    [...el.querySelectorAll<HTMLButtonElement>('.level-card .chip')].find((b) => b.textContent === 'N4')!.click();
    expect(store.data.level).toBe('N4');
    expect(app.go).toHaveBeenCalledWith('stop/kyoto');
    expect(text(stopScreen(app, ['kyoto']).el.querySelector<HTMLElement>('.unit-card')!)).toContain('N4 · lesson 1 of 12');
  });
  it('sends the games of a place to the lesson, not to the place', () => {
    store.update((d) => (d.level = 'N5'));
    store.introduce(['x']);
    const app = fakeApp(store);
    const el = stopScreen(app, ['tokyo']).el;
    const go = el.querySelector<HTMLButtonElement>('.btn.primary.big')!;
    go.click();
    expect(app.go).toHaveBeenCalledWith('lesson/hakodate');
  });
  it('opens lessons one after another within a level, never across levels', () => {
    store.update((d) => (d.level = 'N4'));
    const n4 = unitsOf('N4');
    const chips = (): string[] => [...stopScreen(fakeApp(store), ['tokyo']).el.querySelectorAll('.lesson-chips .chip')].map((c) => c.textContent ?? '');
    expect(chips()).toEqual(['1', '🔒']);
    store.update((d) => (d.stops[STOPS[n4[0]!]!.id] = 2));
    expect(chips()).toEqual(['1 ★★', '2', '🔒']);
    // lessons of other levels are untouched by this
    store.update((d) => (d.level = 'N5'));
    expect(chips()).toEqual(['1', '🔒']);
  });
  it('shows a lesson you ask for, but only one of your level that is open', () => {
    store.update((d) => {
      d.level = 'N4';
      d.stops[STOPS[unitsOf('N4')[0]!]!.id] = 1;
    });
    const [first, second, third] = unitsOf('N4').map((i) => STOPS[i]!);
    const title = (id: string): string => text(stopScreen(fakeApp(store), ['tokyo', id]).el.querySelector<HTMLElement>('.unit-card')!);
    expect(title(first!.id)).toContain('lesson 1 of 12');
    expect(title(second!.id)).toContain('lesson 2 of 12');
    expect(title(third!.id)).toContain('lesson 2 of 12'); // locked: you stay on the lesson you are up to
    expect(title(STOPS[unitsOf('N5')[0]!]!.id)).toContain('N4 · lesson 2'); // another level's lesson is ignored
  });
  it('keeps every place open on the map, whatever your level and progress', () => {
    for (const level of ['Kana', 'N1'] as const) {
      store.update((d) => (d.level = level));
      const el = mapScreen(fakeApp(store)).el;
      expect(el.querySelectorAll('.stop.open')).toHaveLength(STOPS.length);
      expect(el.querySelectorAll('.stop.locked')).toHaveLength(0);
      expect(text(el)).not.toContain('🔒');
      expect([...el.querySelectorAll<HTMLButtonElement>('.stop-row')].every((b) => !b.disabled)).toBe(true);
    }
  });
  it('travels to a place the first time and goes straight there after that', () => {
    const app = fakeApp(store);
    const el = mapScreen(app).el;
    const row = (name: string): HTMLButtonElement => [...el.querySelectorAll<HTMLButtonElement>('.stop-row')].find((b) => b.textContent?.includes(name))!;
    row('Osaka').click();
    expect(app.go).toHaveBeenLastCalledWith('travel/osaka');
    store.update((d) => d.stamps.push('osaka'));
    const again = fakeApp(store);
    [...mapScreen(again).el.querySelectorAll<HTMLButtonElement>('.stop-row')].find((b) => b.textContent?.includes('Osaka'))!.click();
    expect(again.go).toHaveBeenLastCalledWith('stop/osaka');
  });
  it('gives stars and the next lesson to the lesson, and the local cat to the place', async () => {
    store.update((d) => (d.level = 'N3'));
    const lessons = unitsOf('N3').map((i) => STOPS[i]!);
    const app = fakeApp(store, 'kyoto');
    const el = await played(app, [lessons[0]!.id, 'instant', '1']);
    expect(store.data.stops[lessons[0]!.id]).toBe(3);
    expect(store.data.stops.kyoto).toBeUndefined();
    expect(store.data.cats).toContain('npc:kyoto');
    expect(text(el)).toContain('Lesson 2 of N3 unlocked');
    expect(text(el)).toContain('Back to Kyoto');
    [...el.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.startsWith('Back to'))!.click();
    expect(app.go).toHaveBeenLastCalledWith(`stop/kyoto/${lessons[0]!.id}`);
  });
  it('celebrates finishing the last lesson of a level', async () => {
    store.update((d) => (d.level = 'N2'));
    const lessons = unitsOf('N2').map((i) => STOPS[i]!);
    store.update((d) => lessons.slice(0, -1).forEach((s) => (d.stops[s.id] = 1)));
    const el = await played(fakeApp(store, 'tokyo'), [lessons[lessons.length - 1]!.id, 'instant', '1']);
    expect(text(el)).toContain('You finished every N2 lesson');
  });
});
