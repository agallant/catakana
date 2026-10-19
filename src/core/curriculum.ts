import { ALL_KANA, KANA_BY_ID, type KanaChar } from '../data/kana';
import { STOPS, type Stop } from '../data/journey';
import { N5_WORDS, WORDS, type Word } from '../data/vocab';
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
  return [...WORDS.filter((w) => wordReadable(w, learned)), ...N5_WORDS.filter((w) => stopsSoFar.has(w.stop!))];
}

/** Words first becoming readable at this stop (not readable at the previous one). */
export function newWordsAt(index: number): Word[] {
  const prev = new Set(index > 0 ? wordsThrough(index - 1).map((w) => w.id) : []);
  return wordsThrough(index).filter((w) => !prev.has(w.id));
}

export function isStopUnlocked(index: number, save: Pick<SaveData, 'stops'>): boolean {
  if (index <= 0) return true;
  return (save.stops[STOPS[index - 1]!.id] ?? 0) >= 1;
}

export function currentStopIndex(save: Pick<SaveData, 'stops'>): number {
  let idx = 0;
  for (let i = 0; i < STOPS.length; i++) {
    if (isStopUnlocked(i, save)) idx = i;
  }
  return idx;
}

/** Index of the first stop of a tier (e.g. where the N5 Grand Tour begins). */
export function firstStopOfTier(tier: Stop['tier']): number {
  return STOPS.findIndex((s) => s.tier === tier);
}
