import { describe, expect, it } from 'vitest';
import { catSvg, FUR_PRESETS } from '../src/ui/cat';
import { HATS } from '../src/core/cats';
import { DEFAULT_LOOK } from '../src/core/store';

describe('wardrobe', () => {
  it('has unique hat ids with a free “none” and positive prices otherwise', () => {
    expect(new Set(HATS.map((h) => h.id)).size).toBe(HATS.length);
    for (const h of HATS) expect(h.cost === 0, h.id).toBe(h.id === 'none');
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
});
