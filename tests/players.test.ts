import { describe, expect, it } from 'vitest';
import { MAIN_PLAYER, MAX_PLAYERS, Store } from '../src/core/store';

const mem = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('players on one device', () => {
  it('starts with one player and keeps the original save key', () => {
    const st = mem({ 'catakana.save.v1': JSON.stringify({ v: 1, name: 'Mochi', fish: 7 }) });
    const s = new Store(st);
    expect(s.players()).toEqual([{ id: MAIN_PLAYER, name: 'Mochi', active: true }]);
    expect(s.data.fish).toBe(7);
  });
  it('gives each new player a fresh save and keeps the others untouched', () => {
    const st = mem();
    const s = new Store(st);
    s.update((d) => {
      d.name = 'Mochi';
      d.fish = 5;
    });
    expect(s.addPlayer()).toBe(true);
    expect(s.data.fish).toBe(0);
    s.update((d) => {
      d.name = 'Tama';
      d.fish = 2;
    });
    expect(s.players().map((p) => p.name)).toEqual(['Mochi', 'Tama']);
    const other = s.players().find((p) => !p.active)!;
    s.switchPlayer(other.id);
    expect(s.data.name).toBe('Mochi');
    expect(s.data.fish).toBe(5);
    s.switchPlayer(s.players().find((p) => !p.active)!.id);
    expect(s.data.fish).toBe(2);
  });
  it('remembers who was playing next time', () => {
    const st = mem();
    const s = new Store(st);
    s.addPlayer();
    s.update((d) => (d.fish = 9));
    const again = new Store(st);
    expect(again.players()).toHaveLength(2);
    expect(again.data.fish).toBe(9);
  });
  it('lets one player erase progress without touching the others', () => {
    const s = new Store(mem());
    s.update((d) => (d.fish = 4));
    s.addPlayer();
    s.update((d) => (d.fish = 8));
    s.reset();
    expect(s.data.fish).toBe(0);
    s.switchPlayer(MAIN_PLAYER);
    expect(s.data.fish).toBe(4);
  });
  it('stops adding players at the limit', () => {
    const s = new Store(mem());
    for (let i = 1; i < MAX_PLAYERS; i++) expect(s.addPlayer()).toBe(true);
    expect(s.addPlayer()).toBe(false);
    expect(s.players()).toHaveLength(MAX_PLAYERS);
  });
  it('ignores an unreadable player index', () => {
    const s = new Store(mem({ 'catakana.players.v1': '{oops' }));
    expect(s.players().map((p) => p.id)).toEqual([MAIN_PLAYER]);
  });
});
