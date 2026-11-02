import { ALL_KANA, KANA_BY_ID, type KanaChar } from '../data/kana';
import { STOPS, type Stop, type StudyLevel, LEVELS } from '../data/journey';
import { grammarsAt } from './sentences';
import { TOUR_WORDS, WORDS, type Word } from '../data/vocab';
import type { SaveData } from './store';

const SMALL_Y = 'ゃゅょャュョ';
const SMALL_TSU = 'っッ';

/** Split a kana string into the kana ids needed to read it; null if unreadable with kana alone. */
export function kanaTokens(reading: string): string[] | null {
  const chars = [...reading];
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]!;
    const isKata = /[゠-ヿ]/.test(c);
    const prefix = isKata ? 'k' : 'h';
    if (c === 'ー') {
      out.push('mark:ー');
      continue;
    }
    if (SMALL_TSU.includes(c)) {
      out.push(`${prefix}:${isKata ? 'ツ' : 'つ'}`);
      continue;
    }
    const nxt = chars[i + 1];
    if (nxt && SMALL_Y.includes(nxt)) {
      out.push(`${prefix}:${c}${nxt}`);
      i++;
      continue;
    }
    out.push(`${prefix}:${c}`);
  }
  return out.every((t) => t.startsWith('mark:') || KANA_BY_ID.has(t)) ? out : null;
}

export function stopKana(stop: Stop): KanaChar[] {
  return ALL_KANA.filter((k) => stop.teaches.includes(k.group));
}

/** All kana taught up to and including the stop at index i. */
export function learnedKanaThrough(index: number): Set<string> {
  const ids = new Set<string>();
  for (let i = 0; i <= index && i < STOPS.length; i++) stopKana(STOPS[i]!).forEach((k) => ids.add(k.id));
  return ids;
}

export function wordReadable(w: Word, learned: Set<string>): boolean {
  const toks = kanaTokens(w.jp);
  if (!toks) return false;
  const kataInWord = toks.some((t) => t.startsWith('k:'));
  return toks.every((t) => (t.startsWith('mark:') ? kataInWord : learned.has(t)));
}

export function wordsThrough(index: number): Word[] {
  const learned = learnedKanaThrough(index);
  const stopsSoFar = new Set(STOPS.slice(0, index + 1).map((s) => s.id));
  return [...WORDS.filter((w) => wordReadable(w, learned)), ...TOUR_WORDS.filter((w) => stopsSoFar.has(w.stop!))];
}

/** Words first becoming readable at this stop (not readable at the previous one). */
export function newWordsAt(index: number): Word[] {
  const prev = new Set(index > 0 ? wordsThrough(index - 1).map((w) => w.id) : []);
  return wordsThrough(index).filter((w) => !prev.has(w.id));
}

/**
 * Lessons are the stops of one level, in order. Each level has its own track, so choosing a harder level
 * never skips a place: places are always open, and the lessons you do there come from your level's track.
 */
export function unitsOf(level: StudyLevel): number[] {
  return STOPS.flatMap((s, i) => (s.tier === level ? [i] : []));
}

/** The first lesson of every level is open; each next one needs a star on the one before it in the same level. */
export function isUnitOpen(index: number, save: Pick<SaveData, 'stops'>): boolean {
  const units = unitsOf(STOPS[index]!.tier);
  const pos = units.indexOf(index);
  return pos <= 0 || (save.stops[STOPS[units[pos - 1]!]!.id] ?? 0) >= 1;
}

/** The lesson you are on in a level: the first one without a star, or the last one once all have. */
export function unitIndexFor(level: StudyLevel, save: Pick<SaveData, 'stops'>): number {
  const units = unitsOf(level);
  return units.find((i) => (save.stops[STOPS[i]!.id] ?? 0) < 1) ?? units[units.length - 1]!;
}

export function levelDone(level: StudyLevel, save: Pick<SaveData, 'stops'>): boolean {
  return unitsOf(level).every((i) => (save.stops[STOPS[i]!.id] ?? 0) >= 1);
}

export function nextLevel(level: StudyLevel): StudyLevel | undefined {
  return LEVELS[LEVELS.indexOf(level) + 1];
}

/** What a lesson is about, in a few words: its first grammar point, or the kana it teaches, or the place's name. */
export function unitTitle(index: number): string {
  const stop = STOPS[index]!;
  const grammar = grammarsAt(stop.id)[0];
  if (grammar) return grammar.pattern;
  const kana = stopKana(stop);
  return kana.length ? kana.map((k) => k.char).join(' ') : stop.name;
}

/** The level a saved game was at before levels existed: the tier of the first lesson not yet cleared. */
export function levelFromProgress(save: Pick<SaveData, 'stops'>): StudyLevel {
  let last = -1;
  STOPS.forEach((s, i) => {
    if ((save.stops[s.id] ?? 0) >= 1) last = i;
  });
  return STOPS[Math.min(last + 1, STOPS.length - 1)]!.tier;
}

/** Index of the first stop of a tier (e.g. where the N5 Grand Tour begins). */
export function firstStopOfTier(tier: Stop['tier']): number {
  return STOPS.findIndex((s) => s.tier === tier);
}
