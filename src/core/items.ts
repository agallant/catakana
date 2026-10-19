import { ALL_KANA, type KanaChar } from '../data/kana';
import { STOPS } from '../data/journey';
import type { Word } from '../data/vocab';
import type { Item } from '../games/types';
import { learnedKanaThrough, newWordsAt, stopKana, wordsThrough } from './curriculum';

export function kanaItem(k: KanaChar): Item {
  return { id: k.id, kind: 'kana', text: k.char, reading: k.char, romaji: k.romaji, script: k.script };
}

export function wordItem(w: Word): Item {
  return { id: w.id, kind: 'word', text: w.jp, reading: w.reading, romaji: w.romaji, en: w.en, emoji: w.emoji, script: w.katakana ? 'katakana' : 'hiragana' };
}

export function poolForStop(index: number): Item[] {
  const learned = learnedKanaThrough(index);
  const kana = ALL_KANA.filter((k) => learned.has(k.id)).map(kanaItem);
  return [...kana, ...wordsThrough(index).map(wordItem)];
}

export function focusForStop(index: number): Item[] {
  const stop = STOPS[index]!;
  const kana = stopKana(stop).map(kanaItem);
  const words = newWordsAt(index).map(wordItem);
  // graduation stop reviews everything
  if (!kana.length && !words.length) return poolForStop(index);
  return [...kana, ...words];
}
