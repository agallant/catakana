import { describe, expect, it, vi } from 'vitest';
import { whoScreen } from '../src/screens/who';
import { Store } from '../src/core/store';
import type { App } from '../src/ui/app';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('who is playing', () => {
  it('lists every player and switches to the one tapped', () => {
    const store = new Store(mem());
    store.update((d) => {
      d.name = 'Mochi';
      d.started = true;
    });
    store.addPlayer();
    store.update((d) => (d.name = 'Tama'));
    const go = vi.fn();
    const { el } = whoScreen({ store, go } as unknown as App);
    const buttons = [...el.querySelectorAll('button')];
    expect(buttons.map((b) => b.textContent)).toEqual(['🐱 Mochi', '🐱 Tama']);
    buttons[0]!.click();
    expect(store.data.name).toBe('Mochi');
    expect(go).toHaveBeenCalledWith('map');
  });
  it('sends a player who has not started to the welcome screen', () => {
    const store = new Store(mem());
    store.addPlayer();
    const go = vi.fn();
    const { el } = whoScreen({ store, go } as unknown as App);
    const [first] = [...el.querySelectorAll('button')];
    first!.click();
    expect(go).toHaveBeenCalledWith('welcome');
  });
});
