import { review, type SrsRecord } from './srs';

export type FuriganaMode = 'always' | 'tap' | 'off';

export const PATTERNS = ['plain', 'tabby', 'tuxedo', 'spots', 'calico'] as const;
export const HAT_IDS = ['none', 'beret', 'bow', 'scarf', 'straw', 'crown', 'headband', 'sakura', 'kitsune', 'kabuto', 'bell', 'tenugui', 'kanzashi', 'conductor', 'sugegasa', 'yukata'] as const;

export interface CatLook {
  fur: string;
  accent: string;
  pattern: (typeof PATTERNS)[number];
  eyes: string;
  hat: (typeof HAT_IDS)[number];
}

export interface Settings {
  furigana: FuriganaMode;
  romaji: boolean;
  sound: boolean;
  speech: boolean;
  speechRate: number;
  reduceMotion: boolean;
  /** larger text and buttons for anyone (Young learner mode turns this look on too) */
  bigText: boolean;
  /** young learner preset: calmer rules, bigger buttons, grown-up check on settings */
  kid: boolean;
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
    settings: { furigana: 'always', romaji: true, sound: true, speech: true, speechRate: 0.85, reduceMotion: false, bigText: false, kid: false },
    stats: { rounds: 0, correct: 0, wrong: 0, playMs: 0 },
    started: false,
  };
}

const KEY = 'catakana.save.v1';
const PLAYERS_KEY = 'catakana.players.v1';
/** The first player keeps the original save key, so saves from before players existed carry on. */
export const MAIN_PLAYER = 'main';
export const MAX_PLAYERS = 6;

export interface PlayerIndex {
  active: string;
  ids: string[];
}

export interface PlayerInfo {
  id: string;
  name: string;
  active: boolean;
}

export function saveKey(id: string): string {
  return id === MAIN_PLAYER ? KEY : `${KEY}.${id}`;
}

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
  private storage: Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>> | null;
  private index: PlayerIndex;

  constructor(storage?: Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>> | null) {
    this.storage = storage === undefined ? safeLocalStorage() : storage;
    this.index = this.loadIndex();
    this.data = this.load();
    this.touchStreak();
  }

  private load(rawOverride?: string): SaveData {
    try {
      const raw = rawOverride ?? this.storage?.getItem(saveKey(this.index.active));
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

  private loadIndex(): PlayerIndex {
    try {
      const raw = this.storage?.getItem(PLAYERS_KEY);
      if (raw) {
        const p: unknown = JSON.parse(raw);
        if (isRecord(p) && typeof p.active === 'string' && isStringArray(p.ids) && p.ids.includes(p.active)) {
          const ids = [...new Set(p.ids)].slice(0, MAX_PLAYERS);
          // an over-long index must never lose the active player
          if (!ids.includes(p.active)) ids[MAX_PLAYERS - 1] = p.active;
          return { active: p.active, ids };
        }
      }
    } catch {
      /* unreadable index: fall back to the first player */
    }
    return { active: MAIN_PLAYER, ids: [MAIN_PLAYER] };
  }

  private saveIndex(index: PlayerIndex = this.index): boolean {
    try {
      this.storage?.setItem(PLAYERS_KEY, JSON.stringify(index));
      return true;
    } catch {
      /* storage full/blocked */
      return false;
    }
  }

  /** Everyone who plays on this device, with the cat name from their save. */
  players(): PlayerInfo[] {
    return this.index.ids.map((id) => {
      let name = 'New player';
      try {
        const raw = id === this.index.active ? null : this.storage?.getItem(saveKey(id));
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        const n = id === this.index.active ? this.data.name : isRecord(parsed) && typeof parsed.name === 'string' ? parsed.name : '';
        if (n.trim()) name = n.trim().slice(0, 14);
      } catch {
        /* unreadable save: keep the placeholder name */
      }
      return { id, name, active: id === this.index.active };
    });
  }

  /** Start a fresh save for another player and make it the active one. Returns false at the player limit. */
  addPlayer(): boolean {
    if (this.index.ids.length >= MAX_PLAYERS) return false;
    this.save();
    let id = `p${Date.now().toString(36)}`;
    while (this.index.ids.includes(id)) id += 'x';
    this.index = { active: id, ids: [...this.index.ids, id] };
    this.saveIndex();
    this.data = defaultSave();
    this.save();
    this.listeners.forEach((l) => l(this.data));
    return true;
  }

  /** Switch to another player's save. */
  switchPlayer(id: string): void {
    if (id === this.index.active || !this.index.ids.includes(id)) return;
    this.save();
    this.index = { ...this.index, active: id };
    this.saveIndex();
    this.data = this.load();
    this.touchStreak();
    this.listeners.forEach((l) => l(this.data));
  }

  /**
   * Delete a player and their save. The last player can't be removed; removing the active one moves to the player
   * who took their place in the list. Returns false, leaving everything as it was, if the device can't forget them.
   */
  removePlayer(id: string): boolean {
    const at = this.index.ids.indexOf(id);
    if (this.index.ids.length <= 1 || at < 0 || !this.storage?.removeItem) return false;
    const wasActive = id === this.index.active;
    if (!wasActive) this.save();
    const ids = this.index.ids.filter((x) => x !== id);
    const next: PlayerIndex = { active: wasActive ? (ids[at] ?? ids[0]!) : this.index.active, ids };
    if (!this.saveIndex(next)) return false;
    try {
      this.storage.removeItem(saveKey(id));
    } catch {
      // the save is still there, so keep the player listed too
      this.saveIndex();
      return false;
    }
    this.index = next;
    if (wasActive) {
      this.data = this.load();
      this.touchStreak();
      this.listeners.forEach((l) => l(this.data));
    }
    return true;
  }

  save(): void {
    try {
      this.storage?.setItem(saveKey(this.index.active), JSON.stringify(this.data));
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

const isColour = (v: unknown): v is string => typeof v === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);

/** Keep only known patterns and accessories and #rgb / #rrggbb colours; anything else falls back to the default look. */
export function sanitizeLook(l: Record<string, unknown>): CatLook {
  return {
    fur: isColour(l.fur) ? l.fur : DEFAULT_LOOK.fur,
    accent: isColour(l.accent) ? l.accent : DEFAULT_LOOK.accent,
    eyes: isColour(l.eyes) ? l.eyes : DEFAULT_LOOK.eyes,
    pattern: (PATTERNS as readonly unknown[]).includes(l.pattern) ? (l.pattern as CatLook['pattern']) : DEFAULT_LOOK.pattern,
    hat: (HAT_IDS as readonly unknown[]).includes(l.hat) ? (l.hat as CatLook['hat']) : DEFAULT_LOOK.hat,
  };
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
  if (isRecord(p.look)) out.look = sanitizeLook(p.look);
  if (isRecord(p.settings)) out.settings = { ...base.settings, ...p.settings };
  if (isRecord(p.stats)) out.stats = { ...base.stats, ...p.stats };
  // copy arrays so later pushes don't alias the parsed object
  out.stamps = [...out.stamps];
  return out;
}
