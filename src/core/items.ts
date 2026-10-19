import { ALL_KANA, kanaToRomaji, toHiragana, type KanaChar } from '../data/kana';
import { KANJI, primaryReading, type Kanji } from '../data/kanji';
import { STOPS } from '../data/journey';
import type { Word } from '../data/vocab';
import type { Item } from '../games/types';
import { learnedKanaThrough, newWordsAt, stopKana, wordsThrough } from './curriculum';

export function kanaItem(k: KanaChar): Item {
  return { id: k.id, kind: 'kana', text: k.char, reading: k.char, romaji: k.romaji, script: k.script };
}

export function wordItem(w: Word): Item {
  return { id: w.id, kind: 'word', text: w.jp, reading: w.reading, romaji: w.romaji, en: w.en, emoji: w.emoji, script: w.katakana ? 'katakana' : 'hiragana', kanji: w.kanji };
}

export function kanjiItem(k: Kanji): Item {
  const reading = primaryReading(k);
  const alts = [...k.kun.map((r) => r.replace(/\(.*\)/, '')), ...k.on.map(toHiragana)].filter((r) => r && r !== reading);
  return { id: `kj:${k.char}`, kind: 'kanji', text: k.char, reading, romaji: kanaToRomaji(reading), en: k.meaning, emoji: k.emoji, alts };
}

export function kanjiThrough(index: number): Kanji[] {
  const ids = new Set(STOPS.slice(0, index + 1).map((s) => s.id));
  return KANJI.filter((k) => ids.has(k.stop));
}

/** Show a word in its kanji form once every kanji in it has been introduced. */
export function withKnownKanji(item: Item, known: ReadonlySet<string>): Item {
  if (item.kind !== 'word' || !item.kanji) return item;
  const chars = [...item.kanji].filter((c) => /[\u4e00-\u9fff]/.test(c));
  return chars.length && chars.every((c) => known.has(`kj:${c}`)) ? { ...item, text: item.kanji } : item;
}

export function poolForStop(index: number): Item[] {
  const learned = learnedKanaThrough(index);
  const kana = ALL_KANA.filter((k) => learned.has(k.id)).map(kanaItem);
  return [...kana, ...kanjiThrough(index).map(kanjiItem), ...wordsThrough(index).map(wordItem)];
}

export const WORDS_PER_LESSON = 8;

/**
 * Next lesson batch at a stop: all of the stop's kana not yet introduced, plus up to
 * WORDS_PER_LESSON new words. Falls back to a review of the first batch.
 */
export function lessonBatch(index: number, introduced: ReadonlySet<string>): { items: Item[]; review: boolean } {
  const stop = STOPS[index]!;
  const kana = stopKana(stop).map(kanaItem);
  const words = newWordsAt(index).map(wordItem);
  const kanji = KANJI.filter((k) => k.stop === stop.id).map(kanjiItem);
  const freshKana = [...kana, ...kanji].filter((k) => !introduced.has(k.id));
  const freshWords = words.filter((w) => !introduced.has(w.id)).slice(0, WORDS_PER_LESSON);
  if (freshKana.length || freshWords.length) return { items: [...freshKana, ...freshWords], review: false };
  return { items: [...kana, ...kanji, ...words.slice(0, WORDS_PER_LESSON)], review: true };
}

export function focusForStop(index: number): Item[] {
  const stop = STOPS[index]!;
  const kana = stopKana(stop).map(kanaItem);
  const kanji = KANJI.filter((k) => k.stop === stop.id).map(kanjiItem);
  const words = newWordsAt(index).map(wordItem);
  // graduation stop reviews everything
  if (!kana.length && !words.length && !kanji.length) return poolForStop(index);
  return [...kana, ...kanji, ...words];
}
