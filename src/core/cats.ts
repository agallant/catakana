import { STOPS } from '../data/journey';
import type { CatLook, Store } from './store';

export interface CollectibleCat {
  id: string;
  name: string;
  look: CatLook;
  from: string;
}

export function npcCats(): CollectibleCat[] {
  return STOPS.map((s) => ({ id: `npc:${s.id}`, name: s.npc.name, look: s.npc.look, from: s.name }));
}

/** Add the stop's local cat to the collection (once). Returns the cat if newly added. */
export function collectCat(store: Store, stopId: string, _bonus: boolean): CollectibleCat | null {
  const cat = npcCats().find((c) => c.id === `npc:${stopId}`);
  if (!cat || store.data.cats.includes(cat.id)) return null;
  store.update((d) => {
    d.cats.push(cat.id);
  });
  return cat;
}

export const HATS: { id: CatLook['hat']; name: string; cost: number }[] = [
  { id: 'none', name: 'No hat', cost: 0 },
  { id: 'bow', name: 'Bow', cost: 20 },
  { id: 'scarf', name: 'Scarf', cost: 30 },
  { id: 'headband', name: 'Headband', cost: 40 },
  { id: 'beret', name: 'Beret', cost: 50 },
  { id: 'straw', name: 'Straw hat', cost: 60 },
  { id: 'sakura', name: 'Sakura crown', cost: 80 },
  { id: 'kitsune', name: 'Fox mask', cost: 120 },
  { id: 'crown', name: 'Crown', cost: 150 },
  { id: 'kabuto', name: 'Samurai kabuto', cost: 200 },
];
