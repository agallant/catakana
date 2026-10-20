import { review, type SrsRecord } from './srs';

export type FuriganaMode = 'always' | 'tap' | 'off';

export interface CatLook {
  fur: string;
  accent: string;
  pattern: 'plain' | 'tabby' | 'tuxedo' | 'spots' | 'calico';
  eyes: string;
  hat: 'none' | 'beret' | 'bow' | 'scarf' | 'straw' | 'crown' | 'headband' | 'sakura' | 'kitsune' | 'kabuto' | 'bell' | 'tenugui' | 'kanzashi' | 'conductor' | 'sugegasa' | 'yukata';
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
  /** shop items bought (food and treasures) */
  owned: string[];
  /** sights photographed in Explore ("<stop>:<spot name>") */
  photos: string[];
  /** day trips taken (ids from daytrips.ts) */
  daytrips: string[];
  /** today's quest progress */
  daily: { day: string; progress: Record<string, number>; claimed: string[] };
  /** unlocked achievement ids */
  achievements: string[];
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
    owned: [],
    photos: [],
    daytrips: [],
    daily: { day: '', progress: {}, claimed: [] },
    achievements: [],
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

  private load(rawOverride?: string): SaveData {
    try {
      const raw = rawOverride ?? this.storage?.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (!isRecord(parsed)) return defaultSave();
        const data = sanitize(parsed);
        // saves from before eki stamps existed: every visited stop earns its stamp
        for (const id of Object.keys(data.stops)) if (!data.stamps.includes(id)) data.stamps.push(id);
        return data;
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

  /** Serialise progress for a backup file. */
  exportJson(): string {
    return JSON.stringify({ app: 'catakana', exported: new Date().toISOString(), save: this.data });
  }

  /** Restore from a backup; returns false (and changes nothing) if the file isn't a Catakana save. */
  importJson(text: string): boolean {
    try {
      const parsed: unknown = JSON.parse(text);
      if (!isRecord(parsed) || parsed.app !== 'catakana' || !isValidSave(parsed.save)) return false;
      this.data = this.load(JSON.stringify(parsed.save));
      this.save();
      this.listeners.forEach((l) => l(this.data));
      return true;
    } catch {
      return false;
    }
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

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

const isStringArray = (x: unknown): x is string[] => Array.isArray(x) && x.every((v) => typeof v === 'string');

/** A backup must look like a real save: an object whose core fields have the right shapes. */
export function isValidSave(x: unknown): x is Partial<SaveData> {
  if (!isRecord(x)) return false;
  if (!isRecord(x.stops) || !Object.values(x.stops).every((v) => typeof v === 'number')) return false;
  if (!isRecord(x.srs)) return false;
  if (typeof x.fish !== 'number' || typeof x.xp !== 'number') return false;
  return ['introduced', 'cats'].every((k) => x[k] === undefined || isStringArray(x[k]));
}

/** Merge a parsed save over the defaults, keeping only fields of the expected type. */
function sanitize(p: Record<string, unknown>): SaveData {
  const base = defaultSave();
  const out: SaveData = { ...base };
  const assign = <K extends keyof SaveData>(k: K, ok: (v: unknown) => boolean): void => {
    if (ok(p[k])) out[k] = p[k] as SaveData[K];
  };
  const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const str = (v: unknown) => typeof v === 'string';
  assign('name', str);
  assign('fish', num);
  assign('xp', num);
  assign('streak', num);
  assign('lastPlayDay', str);
  assign('started', (v) => typeof v === 'boolean');
  assign('srs', isRecord);
  assign('stops', (v) => isRecord(v) && Object.values(v).every((n) => typeof n === 'number'));
  assign('trivia', isRecord);
  for (const k of ['cats', 'introduced', 'unlockedHats', 'stamps', 'souvenirs', 'owned', 'photos', 'daytrips', 'achievements'] as const) assign(k, isStringArray);
  if (isRecord(p.daily) && str(p.daily.day) && isRecord(p.daily.progress) && isStringArray(p.daily.claimed)) out.daily = p.daily as SaveData['daily'];
  if (isRecord(p.look)) out.look = { ...base.look, ...p.look };
  if (isRecord(p.settings)) out.settings = { ...base.settings, ...p.settings };
  if (isRecord(p.stats)) out.stats = { ...base.stats, ...p.stats };
  // copy arrays so later pushes don't alias the parsed object
  out.stamps = [...out.stamps];
  return out;
}
