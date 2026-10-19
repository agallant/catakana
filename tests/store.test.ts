import { describe, expect, it } from 'vitest';
import { Store } from '../src/core/store';

const mem = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe('store', () => {
  it('backfills eki stamps for older saves', () => {
    const s = new Store(mem({ 'catakana.save.v1': JSON.stringify({ v: 1, stops: { tokyo: 2, yokohama: 0 } }) }));
    expect(s.data.stamps.sort()).toEqual(['tokyo', 'yokohama']);
    expect(s.data.owned).toEqual([]);
  });
  it('starts fresh on corrupt data', () => {
    const s = new Store(mem({ 'catakana.save.v1': '{not json' }));
    expect(s.data.fish).toBe(0);
  });
});
