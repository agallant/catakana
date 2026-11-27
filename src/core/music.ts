/**
 * Theme music, composed on the fly with WebAudio (no audio files to download or cache).
 *
 * Every screen with a mood gets a theme: the menus have their own, and each place on the map plays its own
 * tune, built from its region's scale and a tempo, key and melody seed taken from the place's id. Lessons and
 * games are silent, so listening and speaking practice is never competing with a tune.
 *
 * The composing is pure (`composeBar`, `themeFor`), so it is tested without a browser. `music` plays it:
 * a soft koto-like pluck over a slow bass, quiet beside the sound effects, ducked under the Japanese voice,
 * paused when the tab is hidden, and started by the first tap (browsers, iOS especially, refuse sound before one).
 */
import { audioContext, onSpeaking } from './audio';
import { STOP_BY_ID } from '../data/journey';

/** Semitone steps of the five-note scales used. They never clash, so a random walk over them stays pleasant. */
const SCALES = {
  /** bright, open: the folk-song scale (D E G A B) */
  yo: [0, 2, 5, 7, 9],
  /** wistful: the old koto scale (E F A B C) */
  in: [0, 1, 5, 7, 8],
  /** koto tuning heard in much traditional music (D E♭ G A B♭) */
  hirajoshi: [0, 2, 3, 7, 8],
  /** sunny, island: the Ryukyu scale (C E F G B) */
  ryukyu: [0, 4, 5, 7, 11],
  /** plain major pentatonic, for the cheerful menus and the big cities */
  penta: [0, 2, 4, 7, 9],
} as const;

export type ScaleName = keyof typeof SCALES;

export interface Theme {
  id: string;
  scale: ScaleName;
  /** MIDI note of the bass; the melody lives about an octave above it */
  root: number;
  bpm: number;
  /** 0..1: how often a free slot gets a note (low is spacious, high is busy) */
  density: number;
  /** a soft woodblock tick on the off-beats, for the livelier themes */
  tick: boolean;
  /** seeds this theme's melodies, so it always sounds like itself */
  seed: number;
}

export interface Note {
  /** beats from the start of the bar */
  at: number;
  /** beats */
  dur: number;
  midi: number;
  part: 'melody' | 'bass' | 'tick';
  /** 0..1 loudness */
  vel: number;
}

export const BEATS_PER_BAR = 4;
/** the melody never wanders above this many scale steps over its lowest note (about an octave and a half) */
const MELODY_STEPS = 7;

/** Small, fast string hash (FNV-1a), for seeds and for choosing a key, tempo and so on from an id. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A tiny seeded random number generator (mulberry32): the same seed always gives the same tune. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const midiFreq = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

/** The MIDI note for a step of a theme's scale, counted up from the lowest melody note. */
export function scaleNote(theme: Theme, step: number): number {
  const scale = SCALES[theme.scale];
  const octave = Math.floor(step / scale.length);
  return theme.root + 12 + octave * 12 + scale[step - octave * scale.length]!;
}

const menu = (id: string, scale: ScaleName, root: number, bpm: number, density: number, tick = false): Theme => ({ id, scale, root, bpm, density, tick, seed: hash(id) });

/** The menus: each has its own mood. Lessons and games have no theme at all. */
export const MENU_THEMES: Record<string, Theme> = {
  welcome: menu('welcome', 'yo', 50, 72, 0.5),
  who: menu('who', 'yo', 50, 72, 0.4),
  map: menu('map', 'penta', 48, 84, 0.55),
  dojo: menu('dojo', 'yo', 52, 104, 0.7, true),
  shop: menu('shop', 'in', 50, 108, 0.7, true),
  passport: menu('passport', 'hirajoshi', 49, 64, 0.35),
  cats: menu('cats', 'penta', 51, 96, 0.65, true),
};

/** Where each route gets its music from. Settings plays the map's tune so the volume can be heard as it moves. */
const MENU_ROUTES: Record<string, string> = { welcome: 'welcome', who: 'who', map: 'map', settings: 'map', dojo: 'dojo', shop: 'shop', passport: 'passport', cats: 'cats' };

interface Flavour {
  scale: ScaleName;
  bpm: number;
  density: number;
  tick: boolean;
}

/** The mood of each region; every place then picks its own key, tempo and melodies on top of this. */
const REGIONS: Record<string, Flavour> = {
  Hokkaido: { scale: 'yo', bpm: 66, density: 0.4, tick: false },
  Tohoku: { scale: 'hirajoshi', bpm: 72, density: 0.45, tick: false },
  Kanto: { scale: 'penta', bpm: 92, density: 0.6, tick: true },
  Tokyo: { scale: 'penta', bpm: 100, density: 0.65, tick: true },
  Chubu: { scale: 'yo', bpm: 80, density: 0.5, tick: false },
  Kansai: { scale: 'in', bpm: 84, density: 0.55, tick: false },
  Chugoku: { scale: 'hirajoshi', bpm: 76, density: 0.5, tick: false },
  Shikoku: { scale: 'yo', bpm: 82, density: 0.55, tick: false },
  Kyushu: { scale: 'penta', bpm: 90, density: 0.6, tick: true },
  Okinawa: { scale: 'ryukyu', bpm: 100, density: 0.65, tick: true },
};

const placeCache = new Map<string, Theme>();

/** One place's tune: its region's scale and mood, with a key, tempo and melody of its own. */
function placeTheme(stopId: string, region: string): Theme {
  const hit = placeCache.get(stopId);
  if (hit) return hit;
  const f = REGIONS[region] ?? REGIONS.Kanto!;
  const h = hash(`place:${stopId}`);
  const theme: Theme = {
    id: `place:${stopId}`,
    scale: f.scale,
    root: 46 + (h % 7), // B♭2 to F♯3
    bpm: f.bpm - 6 + ((h >>> 5) % 13),
    density: Math.min(0.85, Math.max(0.3, f.density + (((h >>> 9) % 11) - 5) / 50)),
    tick: f.tick,
    seed: h,
  };
  placeCache.set(stopId, theme);
  return theme;
}

/** The theme for a route (`#/stop/kyoto` is route "stop" with params ["kyoto"]); null means silence. */
export function themeFor(route: string, params: string[] = []): Theme | null {
  if (route === 'stop' || route === 'explore') {
    const stop = STOP_BY_ID.get(params[0] ?? '');
    return stop ? placeTheme(stop.id, stop.region) : MENU_THEMES.map!;
  }
  const id = MENU_ROUTES[route];
  return id ? MENU_THEMES[id]! : null;
}

/**
 * One bar (four beats) of a theme. Phrases are four bars long and go A B A C: the third bar repeats the first and
 * the fourth comes to rest on the root, so it sounds like a tune and not like noise. Four phrases are different
 * from each other, so a long stay on one screen doesn't loop the same eight seconds.
 */
export function composeBar(theme: Theme, bar: number): Note[] {
  const notes: Note[] = [];
  const phrase = Math.floor(bar / 4) % 4;
  const inPhrase = bar % 4;
  const slot = inPhrase === 2 ? 0 : inPhrase;
  const rand = rng(theme.seed ^ Math.imul(phrase + 1, 0x9e3779b1) ^ Math.imul(slot + 1, 0x85ebca6b));
  const cadence = inPhrase === 3;

  // melody: a random walk over the scale, in eighth-note slots
  let step = 2 + Math.floor(rand() * 3);
  const eighths = BEATS_PER_BAR * 2;
  for (let i = 0; i < eighths; ) {
    const last = cadence && i >= eighths - 4;
    if (last) {
      notes.push({ at: i / 2, dur: (eighths - i) / 2 + 0.5, midi: scaleNote(theme, 0), part: 'melody', vel: 0.85 });
      break;
    }
    if (rand() > theme.density) {
      i += 1;
      continue;
    }
    const len = rand() < 0.35 ? 1 : rand() < 0.8 ? 2 : 4;
    const move = [-2, -1, -1, 0, 1, 1, 2, rand() < 0.15 ? 3 : -3][Math.floor(rand() * 8)]!;
    step = Math.min(MELODY_STEPS, Math.max(0, step + move));
    notes.push({ at: i / 2, dur: Math.min(len, eighths - i) / 2 + 0.25, midi: scaleNote(theme, step), part: 'melody', vel: i % 2 === 0 ? 0.9 : 0.65 });
    i += len;
  }

  // bass: the root, then the fifth of the scale
  const scale = SCALES[theme.scale];
  notes.push({ at: 0, dur: 2, midi: theme.root, part: 'bass', vel: 0.8 });
  notes.push({ at: 2, dur: 2, midi: theme.root + scale[3]!, part: 'bass', vel: 0.6 });

  if (theme.tick) {
    notes.push({ at: 1, dur: 0.1, midi: 100, part: 'tick', vel: 0.5 });
    notes.push({ at: 3, dur: 0.1, midi: 100, part: 'tick', vel: 0.5 });
  }
  return notes;
}

/* ---------------------------------------------------------------- playback */

/** Seconds of music scheduled ahead of the clock. Short enough that a theme change is prompt. */
const LOOKAHEAD = 1.5;
const FADE_IN = 1.2;
const FADE_OUT = 0.8;
/** how loud the music is against the sound effects: well under them, since it plays for minutes */
const LEVEL = 0.8;

class Voice {
  private readonly master: GainNode;
  private timer: number | undefined;
  private nextBar: number;
  private nextTime: number;

  constructor(
    private readonly ctx: AudioContext,
    readonly theme: Theme,
    target: number,
  ) {
    this.master = ctx.createGain();
    this.master.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(Math.max(0.0001, target), ctx.currentTime + FADE_IN);
    this.master.connect(ctx.destination);
    this.nextTime = ctx.currentTime + 0.3;
    this.nextBar = 0;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 250);
  }

  setLevel(target: number, seconds = 0.4): void {
    const g = this.master.gain;
    g.cancelScheduledValues(this.ctx.currentTime);
    g.setValueAtTime(Math.max(0.0001, g.value), this.ctx.currentTime);
    g.linearRampToValueAtTime(Math.max(0.0001, target), this.ctx.currentTime + seconds);
  }

  stop(): void {
    window.clearInterval(this.timer);
    this.timer = undefined;
    this.setLevel(0.0001, FADE_OUT);
    window.setTimeout(() => this.master.disconnect(), FADE_OUT * 1000 + 100);
  }

  private tick(): void {
    const beat = 60 / this.theme.bpm;
    while (this.nextTime < this.ctx.currentTime + LOOKAHEAD) {
      for (const n of composeBar(this.theme, this.nextBar)) this.play(n, this.nextTime + n.at * beat, n.dur * beat);
      this.nextTime += BEATS_PER_BAR * beat;
      this.nextBar += 1;
    }
  }

  private play(n: Note, when: number, dur: number): void {
    const c = this.ctx;
    const g = c.createGain();
    g.connect(this.master);
    const peak = (n.part === 'bass' ? 0.16 : n.part === 'tick' ? 0.05 : 0.14) * n.vel * LEVEL;
    if (n.part === 'tick') {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = 1500;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(peak, when + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
      o.connect(g);
      o.start(when);
      o.stop(when + 0.08);
      return;
    }
    const freq = midiFreq(n.midi);
    const soften = c.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = n.part === 'bass' ? 500 : 2400;
    soften.connect(g);
    if (n.part === 'bass') {
      // a slow, round swell
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(soften);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(peak, when + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.start(when);
      o.stop(when + dur + 0.05);
      return;
    }
    // a koto-like pluck: a fast attack and a long, soft decay, with a quiet octave above for the shimmer
    const ring = Math.max(dur, 0.6) * 1.6;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + ring);
    for (const [mult, level, type] of [[1, 1, 'triangle'], [2, 0.25, 'sine']] as const) {
      const o = c.createOscillator();
      const part = c.createGain();
      o.type = type;
      o.frequency.value = freq * mult;
      part.gain.value = level;
      o.connect(part).connect(soften);
      o.start(when);
      o.stop(when + ring + 0.05);
    }
  }
}

class Conductor {
  private want: Theme | null = null;
  private on = true;
  private volume = 0.5;
  private ducked = false;
  private voice: Voice | null = null;
  private armed = false;

  /** Music on or off, and how loud (0..1). */
  configure(opts: { on: boolean; volume: number }): void {
    this.on = opts.on;
    this.volume = Math.min(1, Math.max(0, Number.isFinite(opts.volume) ? opts.volume : 0.5));
    this.sync();
  }

  /** Play this theme (null is silence). The same theme again does nothing, so staying on a screen never restarts it. */
  play(theme: Theme | null): void {
    if (this.want?.id === theme?.id) return;
    this.want = theme;
    this.sync();
  }

  /** Dip under the Japanese voice. */
  duck(on: boolean): void {
    this.ducked = on;
    this.voice?.setLevel(this.level(), 0.25);
  }

  /** Re-check what should be playing: after a setting, a route, a tap or the tab being hidden or shown. */
  sync(): void {
    const wanted = this.on && this.volume > 0 && !(typeof document !== 'undefined' && document.hidden) ? this.want : null;
    if (this.voice && this.voice.theme.id === wanted?.id) {
      this.voice.setLevel(this.level());
      return;
    }
    this.voice?.stop();
    this.voice = null;
    if (!wanted) return;
    const ctx = audioContext();
    if (!ctx) return;
    if (ctx.state !== 'running') {
      // not allowed to make sound until the first tap or key press
      this.arm();
      void ctx.resume().then(() => this.sync(), () => undefined);
      return;
    }
    this.voice = new Voice(ctx, wanted, this.level());
  }

  private level(): number {
    return (this.volume ** 1.5) * (this.ducked ? 0.3 : 1);
  }

  private arm(): void {
    if (this.armed || typeof window === 'undefined') return;
    this.armed = true;
    const go = (): void => {
      this.armed = false;
      for (const t of ['pointerdown', 'keydown', 'touchend']) window.removeEventListener(t, go, true);
      this.sync();
    };
    for (const t of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(t, go, true);
  }
}

export const music = new Conductor();

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => music.sync());
  onSpeaking((on) => music.duck(on));
}
