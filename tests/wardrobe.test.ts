import { describe, expect, it } from 'vitest';
import { catSvg, FUR_PRESETS } from '../src/ui/cat';
import { HATS } from '../src/core/cats';
import { DEFAULT_LOOK, HAT_IDS, sanitizeLook } from '../src/core/store';

describe('wardrobe', () => {
  it('has unique hat ids with a free “none” and positive prices otherwise', () => {
    expect(new Set(HATS.map((h) => h.id)).size).toBe(HATS.length);
    for (const h of HATS) {
      if (h.id === 'none') expect(h.cost, h.id).toBe(0);
      else expect(h.cost, h.id).toBeGreaterThan(0);
    }
    // every accessory the save format accepts is on sale, and vice versa
    expect([...HATS.map((h) => h.id)].sort()).toEqual([...HAT_IDS].sort());
    // listed cheapest first in the wardrobe
    expect(HATS.map((h) => h.cost)).toEqual([...HATS.map((h) => h.cost)].sort((a, b) => a - b));
  });
  it('draws something for every accessory', () => {
    const bare = catSvg({ ...DEFAULT_LOOK, hat: 'none' }).outerHTML;
    const drawn = new Set<string>();
    for (const h of HATS.filter((x) => x.id !== 'none')) {
      const svg = catSvg({ ...DEFAULT_LOOK, hat: h.id }).outerHTML;
      expect(svg, h.id).not.toBe(bare);
      drawn.add(svg);
    }
    expect(drawn.size).toBe(HATS.length - 1);
  });
  it('has distinct fur presets', () => {
    expect(new Set(FUR_PRESETS.map((p) => `${p.fur}|${p.pattern}`)).size).toBe(FUR_PRESETS.length);
  });
  it('keeps a valid look from a backup and replaces unknown or malformed fields', () => {
    const good = { fur: '#2b2b2b', accent: '#111', pattern: 'tuxedo', eyes: '#6aa84f', hat: 'yukata' };
    expect(sanitizeLook(good)).toEqual(good);
    const bad = sanitizeLook({ fur: 'red', accent: '#12345', pattern: 'stripes', eyes: 'url(x)', hat: 'top-hat', extra: 1 });
    expect(bad).toEqual(DEFAULT_LOOK);
  });
});
