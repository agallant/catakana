import { review, type SrsRecord } from './srs';

export type FuriganaMode = 'always' | 'tap' | 'off';

export interface CatLook {
  fur: string;
  accent: string;
  pattern: 'plain' | 'tabby' | 'tuxedo' | 'spots' | 'calico';
  eyes: string;
  hat: 'none' | 'beret' | 'bow' | 'scarf' | 'straw' | 'crown' | 'headband';
}

export interface Settings {
  furigana: FuriganaMode;
  romaji: boolean;
  sound: boolean;
  speech: boolean;
  speechRate: number;
  reduceMotion: boolean;
}

export interface SaveData {
  v: 1;
  name: string;
  look: CatLook;
  fish: number;
  xp: number;
  streak: number;
  lastPlayDay: string;
  srs: Record<string, SrsRecord>;
  /** stop id -> stars 0..3 */
  stops: Record<string, number>;
  /** ids of collected cats */
  cats: string[];
  /** items the learner has been introduced to */
  introduced: string[];
  unlockedHats: string[];
  /** eki stamps collected on arrival (stop ids) */
  stamps: string[];
  /** souvenirs bought (stop ids) */
  souvenirs: string[];
  /** stop id -> best trivia score */
  trivia: Record<string, number>;
  settings: Settings;
  stats: { rounds: number; correct: number; wrong: number; playMs: number };
  started: boolean;
}

export const DEFAULT_LOOK: CatLook = { fur: '#f6b26b', accent: '#e69138', pattern: 'tabby', eyes: '#3d85c6', hat: 'none' };

export function defaultSave(): SaveData {
  return {
    v: 1,
    name: 'Mochi',
    look: { ...DEFAULT_LOOK },
    fish: 0,
    xp: 0,
    streak: 0,
    lastPlayDay: '',
    srs: {},
    stops: {},
    cats: [],
    introduced: [],
    unlockedHats: ['none'],
    stamps: [],
    souvenirs: [],
    trivia: {},
    settings: { furigana: 'always', romaji: true, sound: true, speech: true, speechRate: 0.85, reduceMotion: false },
    stats: { rounds: 0, correct: 0, wrong: 0, playMs: 0 },
    started: false,
  };
}

const KEY = 'catakana.save.v1';

export function level(xp: number): { level: number; into: number; need: number } {
  let lvl = 1;
  let rest = xp;
  let need = 100;
  while (rest >= need) {
    rest -= need;
    lvl++;
    need = Math.round(need * 1.25);
  }
  return { level: lvl, into: rest, need };
}

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Listener = (s: SaveData) => void;

export class Store {
  data: SaveData;
  private listeners = new Set<Listener>();
  private storage: Pick<Storage, 'getItem' | 'setItem'> | null;

  constructor(storage?: Pick<Storage, 'getItem' | 'setItem'> | null) {
    this.storage = storage === undefined ? safeLocalStorage() : storage;
    this.data = this.load();
    this.touchStreak();
  }

  private load(): SaveData {
    try {
      const raw = this.storage?.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SaveData>;
        const base = defaultSave();
        return {
          ...base,
          ...parsed,
          look: { ...base.look, ...(parsed.look ?? {}) },
          settings: { ...base.settings, ...(parsed.settings ?? {}) },
          stats: { ...base.stats, ...(parsed.stats ?? {}) },
        };
      }
    } catch {
      /* corrupted save: start fresh */
    }
    return defaultSave();
  }

  save(): void {
    try {
      this.storage?.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* storage full/blocked */
    }
  }

  update(fn: (d: SaveData) => void): void {
    fn(this.data);
    this.save();
    this.listeners.forEach((l) => l(this.data));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private touchStreak(): void {
    const today = dayKey();
    if (this.data.lastPlayDay === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const streak = this.data.lastPlayDay === dayKey(y) ? this.data.streak : 0;
    this.data.streak = streak;
  }

  /** Call when the learner completes any practice round. */
  markPlayed(): void {
    const today = dayKey();
    this.update((d) => {
      if (d.lastPlayDay !== today) {
        d.streak = d.streak + 1;
        d.lastPlayDay = today;
      }
    });
  }

  recordAnswer(id: string, correct: boolean): void {
    this.update((d) => {
      d.srs[id] = review(d.srs[id], correct);
      if (correct) d.stats.correct++;
      else d.stats.wrong++;
    });
  }

  addRewards(fish: number, xp: number): void {
    this.update((d) => {
      d.fish += fish;
      d.xp += xp;
    });
  }

  introduce(ids: string[]): void {
    this.update((d) => {
      const set = new Set(d.introduced);
      ids.forEach((i) => set.add(i));
      d.introduced = [...set];
    });
  }

  setStars(stop: string, stars: number): void {
    this.update((d) => {
      d.stops[stop] = Math.max(d.stops[stop] ?? 0, stars);
    });
  }

  reset(): void {
    this.data = defaultSave();
    this.save();
    this.listeners.forEach((l) => l(this.data));
  }
}

function safeLocalStorage(): Storage | null {
  try {
    const s = globalThis.localStorage;
    s.getItem('x');
    return s;
  } catch {
    return null;
  }
}
