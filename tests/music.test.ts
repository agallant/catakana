import { describe, expect, it } from 'vitest';
import { BEATS_PER_BAR, MENU_THEMES, composeBar, hash, midiFreq, music, rng, scaleNote, themeFor, type Theme } from '../src/core/music';
import { STOPS } from '../src/data/journey';
import { defaultSave } from '../src/core/store';

const SCALE_STEPS: Record<string, number[]> = {
  yo: [0, 2, 5, 7, 9],
  in: [0, 1, 5, 7, 8],
  hirajoshi: [0, 2, 3, 7, 8],
  ryukyu: [0, 4, 5, 7, 11],
  penta: [0, 2, 4, 7, 9],
};

describe('theme music: which tune plays where', () => {
  it('gives every menu a tune and every place its own', () => {
    for (const route of ['welcome', 'who', 'map', 'dojo', 'shop', 'passport', 'cats']) expect(themeFor(route)?.id, route).toBeTruthy();
    for (const s of STOPS) {
      expect(themeFor('stop', [s.id])?.id).toBe(`place:${s.id}`);
      expect(themeFor('explore', [s.id])?.id).toBe(`place:${s.id}`);
    }
  });
  it('keeps lessons, games and tests silent so listening practice stays clear', () => {
    for (const route of ['lesson', 'play', 'placement', 'trivia', 'travel', 'nowhere']) expect(themeFor(route, ['x']), route).toBeNull();
  });
  it('plays the journey tune in Settings, so the volume can be heard as it moves', () => {
    expect(themeFor('settings')).toBe(MENU_THEMES.map);
  });
  it('falls back to the journey tune for an unknown place', () => {
    expect(themeFor('stop', ['atlantis'])).toBe(MENU_THEMES.map);
  });
  it('uses the same theme every time for the same place', () => {
    expect(themeFor('stop', ['kyoto'])).toBe(themeFor('stop', ['kyoto']));
  });
  it('makes places sound different: their region sets the scale, and each place has its own key, tempo and melody', () => {
    const themes = STOPS.map((s) => ({ stop: s, theme: themeFor('stop', [s.id])! }));
    expect(new Set(themes.map((t) => t.theme.seed)).size).toBe(STOPS.length);
    expect(new Set(themes.map((t) => `${t.theme.root}/${t.theme.bpm}`)).size).toBeGreaterThan(20);
    const scaleOf = (region: string): Set<string> => new Set(themes.filter((t) => t.stop.region === region).map((t) => t.theme.scale));
    expect([...scaleOf('Okinawa')]).toEqual(['ryukyu']);
    expect([...scaleOf('Kansai')]).toEqual(['in']);
    expect([...scaleOf('Hokkaido')]).toEqual(['yo']);
    // the far north is slower than Okinawa
    const bpm = (region: string): number => Math.max(...themes.filter((t) => t.stop.region === region).map((t) => t.theme.bpm));
    expect(bpm('Hokkaido')).toBeLessThan(Math.min(...themes.filter((t) => t.stop.region === 'Okinawa').map((t) => t.theme.bpm)));
  });
  it('keeps every tempo gentle', () => {
    for (const t of [...Object.values(MENU_THEMES), ...STOPS.map((s) => themeFor('stop', [s.id])!)]) {
      expect(t.bpm).toBeGreaterThanOrEqual(58);
      expect(t.bpm).toBeLessThanOrEqual(115);
    }
  });
});

describe('theme music: composing', () => {
  const themes: Theme[] = [...Object.values(MENU_THEMES), ...STOPS.map((s) => themeFor('stop', [s.id])!)];

  it('is repeatable: the same theme and bar are always the same notes', () => {
    for (const t of themes.slice(0, 12)) for (let bar = 0; bar < 20; bar++) expect(composeBar(t, bar)).toEqual(composeBar(t, bar));
  });
  it('only plays notes of the theme’s scale, in a range that is never shrill', () => {
    for (const t of themes) {
      const steps = SCALE_STEPS[t.scale]!;
      for (let bar = 0; bar < 32; bar++) {
        for (const n of composeBar(t, bar)) {
          if (n.part === 'tick') continue;
          const pitchClass = (((n.midi - t.root) % 12) + 12) % 12;
          expect(steps, `${t.id} bar ${bar}`).toContain(pitchClass);
          expect(midiFreq(n.midi)).toBeLessThan(1000);
          expect(midiFreq(n.midi)).toBeGreaterThan(90);
        }
      }
    }
  });
  it('keeps every note inside its bar, and its volume in range', () => {
    for (const t of themes) {
      for (let bar = 0; bar < 16; bar++) {
        for (const n of composeBar(t, bar)) {
          expect(n.at).toBeGreaterThanOrEqual(0);
          expect(n.at).toBeLessThan(BEATS_PER_BAR);
          expect(n.dur).toBeGreaterThan(0);
          expect(n.vel).toBeGreaterThan(0);
          expect(n.vel).toBeLessThanOrEqual(1);
        }
      }
    }
  });
  it('has a bass note on the first beat of every bar', () => {
    for (const t of themes.slice(0, 20)) for (let bar = 0; bar < 8; bar++) expect(composeBar(t, bar).some((n) => n.part === 'bass' && n.at === 0 && n.midi === t.root)).toBe(true);
  });
  it('shapes phrases A B A C: the third bar repeats the first, the fourth comes to rest on the root', () => {
    const melody = (t: Theme, bar: number): Array<[number, number]> => composeBar(t, bar).filter((n) => n.part === 'melody').map((n) => [n.at, n.midi]);
    for (const t of themes.slice(0, 20)) {
      for (let phrase = 0; phrase < 4; phrase++) {
        const b = phrase * 4;
        expect(melody(t, b + 2)).toEqual(melody(t, b));
        const last = composeBar(t, b + 3).filter((n) => n.part === 'melody');
        expect(last.at(-1)?.midi).toBe(scaleNote(t, 0));
      }
    }
  });
  it('does not loop forever: later phrases differ from earlier ones', () => {
    const t = themeFor('stop', ['kyoto'])!;
    const phrase = (p: number): string => JSON.stringify([0, 1, 2, 3].map((i) => composeBar(t, p * 4 + i)));
    expect(new Set([0, 1, 2, 3].map(phrase)).size).toBe(4);
  });
  it('is not silent: some melody in every phrase', () => {
    for (const t of themes) for (let p = 0; p < 4; p++) expect([0, 1, 2, 3].some((i) => composeBar(t, p * 4 + i).some((n) => n.part === 'melody'))).toBe(true);
  });
});

describe('theme music: helpers', () => {
  it('hashes and random numbers are stable', () => {
    expect(hash('kyoto')).toBe(hash('kyoto'));
    expect(hash('kyoto')).not.toBe(hash('osaka'));
    const a = rng(7);
    const b = rng(7);
    for (let i = 0; i < 5; i++) expect(a()).toBe(b());
    const v = rng(1)();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });
  it('A440 is 440 Hz', () => {
    expect(midiFreq(69)).toBeCloseTo(440);
    expect(midiFreq(81)).toBeCloseTo(880);
  });
});

describe('theme music: settings and playback', () => {
  it('is on by default at a moderate volume', () => {
    const s = defaultSave().settings;
    expect(s.music).toBe(true);
    expect(s.musicVolume).toBeGreaterThan(0);
    expect(s.musicVolume).toBeLessThan(1);
  });
  it('is safe without WebAudio (tests, old browsers) and with odd settings', () => {
    expect(() => {
      music.configure({ on: true, volume: 0.5 });
      music.play(MENU_THEMES.map!);
      music.play(MENU_THEMES.map!);
      music.duck(true);
      music.duck(false);
      music.configure({ on: true, volume: Number.NaN });
      music.configure({ on: false, volume: 7 });
      music.play(null);
      music.sync();
    }).not.toThrow();
  });
});
