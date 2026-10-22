import { describe, expect, it } from 'vitest';
import { MAIN_PLAYER, MAX_PLAYERS, Store } from '../src/core/store';

const mem = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
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
  it('keeps the active player when an index lists too many players', () => {
    const ids = ['main', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const s = new Store(mem({ 'catakana.players.v1': JSON.stringify({ active: 'g', ids }) }));
    const players = s.players();
    expect(players).toHaveLength(MAX_PLAYERS);
    expect(players.find((p) => p.active)?.id).toBe('g');
    expect(new Set(players.map((p) => p.id)).size).toBe(players.length);
  });
  it('ignores an unreadable player index', () => {
    const s = new Store(mem({ 'catakana.players.v1': '{oops' }));
    expect(s.players().map((p) => p.id)).toEqual([MAIN_PLAYER]);
  });
  it('removes a player and their save, keeping the others', () => {
    const st = mem();
    const s = new Store(st);
    s.update((d) => (d.fish = 4));
    s.addPlayer();
    const other = s.players().find((p) => p.active)!.id;
    s.update((d) => (d.fish = 9));
    s.switchPlayer(MAIN_PLAYER);
    expect(s.removePlayer(other)).toBe(true);
    expect(s.players().map((p) => p.id)).toEqual([MAIN_PLAYER]);
    expect(st.m.has(`catakana.save.v1.${other}`)).toBe(false);
    expect(s.data.fish).toBe(4);
  });
  it('moves to another player when the active one is removed', () => {
    const s = new Store(mem());
    s.update((d) => (d.fish = 4));
    s.addPlayer();
    const other = s.players().find((p) => p.active)!.id;
    expect(s.removePlayer(other)).toBe(true);
    expect(s.players()).toHaveLength(1);
    expect(s.data.fish).toBe(4);
  });
  it('lets the first player be removed and never removes the last one', () => {
    const st = mem();
    const s = new Store(st);
    expect(s.removePlayer(MAIN_PLAYER)).toBe(false);
    s.addPlayer();
    expect(s.removePlayer(MAIN_PLAYER)).toBe(true);
    expect(st.m.has('catakana.save.v1')).toBe(false);
    expect(s.removePlayer(s.players()[0]!.id)).toBe(false);
    expect(JSON.parse(st.m.get('catakana.players.v1')!).ids).toHaveLength(1);
  });
  it('moves to the player who took the removed one’s place', () => {
    const s = new Store(mem());
    s.addPlayer();
    s.addPlayer();
    const [a, b, c] = s.players().map((p) => p.id) as [string, string, string];
    s.switchPlayer(b);
    s.removePlayer(b);
    expect(s.players().find((p) => p.active)?.id).toBe(c);
    s.removePlayer(c);
    expect(s.players().find((p) => p.active)?.id).toBe(a);
  });
  it('removes nobody when the device cannot forget their save', () => {
    const st = mem();
    const noDelete = { getItem: st.getItem, setItem: st.setItem };
    const s = new Store(noDelete);
    s.addPlayer();
    expect(s.removePlayer(MAIN_PLAYER)).toBe(false);
    expect(s.players()).toHaveLength(2);
    const throwing = { ...st, removeItem: () => { throw new Error('blocked'); } };
    const t = new Store(throwing);
    expect(t.removePlayer(MAIN_PLAYER)).toBe(false);
    expect(t.players()).toHaveLength(2);
    expect(JSON.parse(st.m.get('catakana.players.v1')!).ids).toHaveLength(2);
  });
  it('keeps the save when the index cannot be written', () => {
    const st = mem();
    const s = new Store(st);
    s.addPlayer();
    const other = s.players().find((p) => p.active)!.id;
    const failing = { ...st, setItem: (k: string, v: string) => { if (k === 'catakana.players.v1') throw new Error('full'); st.setItem(k, v); } };
    const t = new Store(failing);
    expect(t.removePlayer(other === t.players()[0]!.id ? MAIN_PLAYER : other)).toBe(false);
    expect(t.players()).toHaveLength(2);
    expect(st.m.has(`catakana.save.v1.${other}`)).toBe(true);
  });
  it('backs up everyone and restores them as new players on another device', () => {
    const a = new Store(mem());
    a.update((d) => {
      d.name = 'Mochi';
      d.fish = 4;
    });
    a.addPlayer();
    a.update((d) => {
      d.name = 'Tama';
      d.fish = 9;
    });
    a.switchPlayer(MAIN_PLAYER);
    const file = a.exportAllJson();
    expect(Store.isAllBackup(file)).toBe(true);
    expect(Store.isAllBackup(a.exportJson())).toBe(false);
    const b = new Store(mem());
    b.update((d) => {
      d.name = 'Kuro';
      d.fish = 1;
    });
    expect(b.importAllJson(file)).toBe(2);
    expect(b.data.name).toBe('Kuro');
    expect(b.players().map((p) => p.name)).toEqual(['Kuro', 'Mochi', 'Tama']);
    b.switchPlayer(b.players()[2]!.id);
    expect(b.data.fish).toBe(9);
  });
  it('adds only as many players as fit and never replaces anyone', () => {
    const a = new Store(mem());
    for (let i = 1; i < MAX_PLAYERS; i++) a.addPlayer();
    const file = a.exportAllJson();
    const b = new Store(mem());
    b.addPlayer();
    b.addPlayer();
    expect(b.importAllJson(file)).toBe(MAX_PLAYERS - 3);
    expect(b.players()).toHaveLength(MAX_PLAYERS);
    expect(b.importAllJson(file)).toBe(0);
  });
  it('ignores a file that is not an all-players backup', () => {
    const s = new Store(mem());
    expect(s.importAllJson('{oops')).toBe(0);
    expect(s.importAllJson(JSON.stringify({ app: 'other', saves: [] }))).toBe(0);
    expect(s.importAllJson(s.exportJson())).toBe(0);
    expect(s.importAllJson(JSON.stringify({ app: 'catakana', saves: [{ nope: 1 }] }))).toBe(0);
    expect(s.players()).toHaveLength(1);
  });
});
