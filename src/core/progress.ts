import { dayKey, type SaveData, type Store } from './store';
import { STOPS } from '../data/journey';
import { CULTURE } from '../data/culture';
import { SHOP } from '../data/shop';
import { KANJI } from '../data/kanji';
import { ALL_KANA } from '../data/kana';
import { mastery } from './srs';

/** Things the game reports so quests and achievements can react. */
export type GameEvent =
  | { type: 'game'; game: string; skill: string; correct: number; total: number; stars: number }
  | { type: 'answers'; correct: number }
  | { type: 'photo' }
  | { type: 'buy'; kind: 'food' | 'treasure' | 'souvenir' }
  | { type: 'lesson' }
  | { type: 'trivia'; score: number };

export interface QuestDef {
  id: string;
  label: string;
  emoji: string;
  goal: number;
  fish: number;
  /** how much an event advances this quest */
  count(e: GameEvent): number;
}

export const QUESTS: QuestDef[] = [
  { id: 'games3', label: 'Play 3 games', emoji: '🎮', goal: 3, fish: 15, count: (e) => (e.type === 'game' ? 1 : 0) },
  { id: 'correct25', label: 'Answer 25 questions correctly', emoji: '✅', goal: 25, fish: 15, count: (e) => (e.type === 'answers' ? e.correct : 0) },
  { id: 'stars3', label: 'Earn a 3-star result', emoji: '⭐', goal: 1, fish: 20, count: (e) => (e.type === 'game' && e.stars === 3 ? 1 : 0) },
  { id: 'write', label: 'Play a writing game', emoji: '✍️', goal: 1, fish: 10, count: (e) => (e.type === 'game' && e.skill === 'writing' ? 1 : 0) },
  { id: 'listen', label: 'Play a listening game', emoji: '👂', goal: 1, fish: 10, count: (e) => (e.type === 'game' && e.skill === 'listening' ? 1 : 0) },
  { id: 'speak', label: 'Practice speaking with Shadow Cat', emoji: '🎙️', goal: 1, fish: 15, count: (e) => (e.type === 'game' && e.skill === 'speaking' ? 1 : 0) },
  { id: 'photo', label: 'Take a sightseeing photo', emoji: '📸', goal: 1, fish: 10, count: (e) => (e.type === 'photo' ? 1 : 0) },
  { id: 'lesson', label: 'Finish a lesson', emoji: '📖', goal: 1, fish: 10, count: (e) => (e.type === 'lesson' ? 1 : 0) },
  { id: 'trivia', label: 'Ace a tour-guide quiz (3+ right)', emoji: '🎤', goal: 1, fish: 15, count: (e) => (e.type === 'trivia' && e.score >= 3 ? 1 : 0) },
];

/** Small deterministic hash so everyone gets the same quests on a given day. */
function seed(s: string): number {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Three quests for the day: always one "play games" style quest plus two rotating ones. */
export function questsFor(day: string): QuestDef[] {
  const rotating = QUESTS.filter((q) => q.id !== 'games3');
  const r = seed(day);
  const a = rotating[r % rotating.length]!;
  const rest = rotating.filter((q) => q !== a);
  const b = rest[(r >>> 8) % rest.length]!;
  return [QUESTS[0]!, a, b];
}

export interface AchievementDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  test(d: SaveData): boolean;
}

const castles = () => STOPS.flatMap((s) => (CULTURE[s.id]?.spots ?? []).filter((sp) => sp.tags?.includes('castle')).map((sp) => `${s.id}:${sp.name}`));
const heritage = () => STOPS.flatMap((s) => (CULTURE[s.id]?.spots ?? []).filter((sp) => sp.tags?.includes('heritage')).map((sp) => `${s.id}:${sp.name}`));
const masteredKana = (d: SaveData, script: 'hiragana' | 'katakana') => ALL_KANA.filter((k) => k.script === script && mastery(d.srs[k.id]) >= 0.6).length;

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-star', name: 'First Paw-step', emoji: '🐾', desc: 'Earn your first star', test: (d) => Object.values(d.stops).some((s) => s >= 1) },
  { id: 'tokyo-done', name: 'Hello Tokyo', emoji: '🗼', desc: 'Finish Tokyo', test: (d) => (d.stops.tokyo ?? 0) >= 1 },
  { id: 'stamps5', name: 'Rail Fan', emoji: '🚃', desc: 'Collect 5 eki stamps', test: (d) => d.stamps.length >= 5 },
  { id: 'stamps20', name: 'Grand Traveler', emoji: '🗾', desc: 'Collect 20 eki stamps', test: (d) => d.stamps.length >= 20 },
  { id: 'hira', name: 'Hiragana Hero', emoji: 'あ', desc: 'Master 40 hiragana', test: (d) => masteredKana(d, 'hiragana') >= 40 },
  { id: 'kata', name: 'Katakana Knight', emoji: 'ア', desc: 'Master 40 katakana', test: (d) => masteredKana(d, 'katakana') >= 40 },
  { id: 'kana-grad', name: 'Kana Graduate', emoji: '🎓', desc: 'Reach Sapporo and finish the kana journey', test: (d) => (d.stops.sapporo ?? 0) >= 1 },
  { id: 'kanji10', name: 'Kanji Kitten', emoji: '🈁', desc: 'Learn 10 kanji', test: (d) => d.introduced.filter((i) => i.startsWith('kj:')).length >= 10 },
  { id: 'kanji50', name: 'Kanji Cat', emoji: '🏯', desc: 'Learn 50 kanji', test: (d) => d.introduced.filter((i) => i.startsWith('kj:')).length >= 50 },
  { id: 'n5', name: 'N5 Explorer', emoji: '🌲', desc: 'Finish the N5 Grand Tour', test: (d) => (d.stops.yakushima ?? 0) >= 1 },
  { id: 'n4', name: 'N4 Adventurer', emoji: '🔔', desc: 'Finish the N4 season in Kawagoe', test: (d) => (d.stops.kawagoe ?? 0) >= 1 },
  { id: 'treasure-castles', name: 'Treasure Castles', emoji: '🏯', desc: 'Photograph the National Treasure castles of Himeji, Hikone, Matsue and Matsumoto', test: (d) => ['himeji:Himeji Castle', 'hikone:Hikone Castle', 'matsue:Matsue Castle', 'matsumoto:Matsumoto Castle'].every((p) => d.photos.includes(p)) },
  { id: 'streak3', name: 'Three-day Purr', emoji: '🔥', desc: 'Play 3 days in a row', test: (d) => d.streak >= 3 },
  { id: 'streak7', name: 'Week of Whiskers', emoji: '📅', desc: 'Play 7 days in a row', test: (d) => d.streak >= 7 },
  { id: 'streak30', name: 'Lucky Cat Habit', emoji: '🐈', desc: 'Play 30 days in a row', test: (d) => d.streak >= 30 },
  { id: 'correct100', name: 'Sharp Ears', emoji: '💯', desc: 'Answer 100 questions correctly', test: (d) => d.stats.correct >= 100 },
  { id: 'correct1000', name: 'Sensei Cat', emoji: '🧑‍🏫', desc: 'Answer 1,000 questions correctly', test: (d) => d.stats.correct >= 1000 },
  { id: 'foodie5', name: 'Foodie', emoji: '🍙', desc: 'Taste 5 foods', test: (d) => d.owned.filter((o) => o.startsWith('food:')).length >= 5 },
  { id: 'gourmet', name: 'Gourmet Cat', emoji: '🍱', desc: 'Taste every food at the market', test: (d) => SHOP.filter((i) => i.kind === 'food').every((i) => d.owned.includes(i.id)) },
  { id: 'castles5', name: 'Castle Hopper', emoji: '🏰', desc: 'Photograph 5 castles', test: (d) => castles().filter((c) => d.photos.includes(c)).length >= 5 },
  { id: 'heritage10', name: 'Heritage Hunter', emoji: '🌏', desc: 'Photograph 10 World Heritage sites', test: (d) => heritage().filter((c) => d.photos.includes(c)).length >= 10 },
  { id: 'cats10', name: 'Cat Collector', emoji: '😺', desc: 'Befriend 10 local cats', test: (d) => d.cats.length >= 10 },
  { id: 'rich', name: 'Fat Cat', emoji: '💰', desc: 'Hold 500 fish at once', test: (d) => d.fish >= 500 },
  { id: 'kanji-all', name: 'Kanji Master', emoji: '👑', desc: `Learn all ${KANJI.length} kanji`, test: (d) => KANJI.every((k) => d.introduced.includes(`kj:${k.char}`)) },
];

export interface Unlock {
  kind: 'quest' | 'achievement';
  label: string;
  emoji: string;
}

type UnlockListener = (u: Unlock) => void;
const listeners = new Set<UnlockListener>();

/** The app shows a toast for every unlock. */
export function onUnlock(fn: UnlockListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Record a game event: advances today's quests and checks achievements. Returns new unlocks. */
export function track(store: Store, e: GameEvent): Unlock[] {
  const today = dayKey();
  const out: Unlock[] = [];
  store.update((d) => {
    if (d.daily.day !== today) d.daily = { day: today, progress: {}, claimed: [] };
    for (const q of questsFor(today)) {
      const before = d.daily.progress[q.id] ?? 0;
      const add = q.count(e);
      if (!add || before >= q.goal) continue;
      const now = Math.min(q.goal, before + add);
      d.daily.progress[q.id] = now;
      if (now >= q.goal && !d.daily.claimed.includes(q.id)) {
        d.daily.claimed.push(q.id);
        d.fish += q.fish;
        d.xp += q.fish;
        out.push({ kind: 'quest', label: `Quest complete: ${q.label} (+🐟${q.fish})`, emoji: q.emoji });
      }
    }
  });
  const all = [...out, ...checkAchievements(store, false)];
  all.forEach((u) => listeners.forEach((l) => l(u)));
  return all;
}

export function checkAchievements(store: Store, notify = true): Unlock[] {
  const out: Unlock[] = [];
  const d = store.data;
  const fresh = ACHIEVEMENTS.filter((a) => !d.achievements.includes(a.id) && a.test(d));
  if (fresh.length) {
    store.update((s) => {
      for (const a of fresh) s.achievements.push(a.id);
    });
    for (const a of fresh) out.push({ kind: 'achievement', label: `Achievement: ${a.name}`, emoji: a.emoji });
  }
  if (notify) out.forEach((u) => listeners.forEach((l) => l(u)));
  return out;
}
