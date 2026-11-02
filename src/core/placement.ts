import { ALL_KANA, toHiragana } from '../data/kana';
import { ALL_WORDS, type Tier, type Word } from '../data/vocab';
import { BLANK, PARTICLES } from '../data/particles';
import { KANJI, primaryReading, type Kanji } from '../data/kanji';
import { STOPS, STOP_BY_ID } from '../data/journey';
import { grammarsAt } from './sentences';
import { firstStopOfTier } from './curriculum';
import { shuffle } from './srs';

export const TIERS: Tier[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

/** The highest thing a learner showed they know. */
export type PlacedLevel = 'none' | 'hiragana' | 'kana' | Tier;
export type Area = 'Hiragana' | 'Katakana' | Tier;
export type QuestionKind = 'kana' | 'vocab' | 'kanji' | 'particle' | 'grammar';

export interface Question {
  kind: QuestionKind;
  area: Area;
  /** what to read; `{漢字|かな}` furigana markup is allowed when `markup` is set */
  prompt: string;
  markup?: boolean;
  /** the instruction shown with it */
  ask: string;
  choices: string[];
  /** index of the one correct choice */
  answer: number;
  /** a line shown after answering */
  note?: string;
}

export const KANA_QUESTIONS = 5;
export const KANA_PASS = 4;
export const TIER_QUESTIONS = 5;
export const TIER_PASS = 3;

type Rng = () => number;

const pickOne = <T>(items: readonly T[], rng: Rng): T | undefined => items[Math.floor(rng() * items.length)];

/** Put the right answer among the wrong ones in a random place. */
function withAnswer(correct: string, wrong: string[], rng: Rng): { choices: string[]; answer: number } {
  const choices = shuffle([correct, ...wrong], rng);
  return { choices, answer: choices.indexOf(correct) };
}

/** Five kana to read, as romaji, from one script. */
export function kanaQuestions(script: 'hiragana' | 'katakana', rng: Rng = Math.random): Question[] {
  const pool = ALL_KANA.filter((k) => k.script === script);
  return shuffle(pool, rng)
    .slice(0, KANA_QUESTIONS)
    .map((k) => {
      const wrong = shuffle(pool.filter((o) => o.romaji !== k.romaji), rng).slice(0, 3);
      const wrongRomaji = [...new Set(wrong.map((o) => o.romaji))];
      return { kind: 'kana' as const, area: script === 'hiragana' ? ('Hiragana' as const) : ('Katakana' as const), prompt: k.char, ask: 'How is this read?', ...withAnswer(k.romaji, wrongRomaji, rng) };
    });
}

const meaningKey = (en: string): string => en.replace(/\(.*?\)/g, '').trim().toLowerCase();

/** How a word is shown: kana up to N4, as it is usually written (with kanji) from N3. */
const shownWord = (w: Word, tier: Tier): string => (tier === 'N5' || tier === 'N4' ? w.reading : w.kanji ?? w.reading);

/** Does only one word in the app go by this spelling? Homophones such as はな (flower / nose) make a bad question. */
const spellings = new Map<string, Set<string>>();
for (const w of ALL_WORDS) {
  for (const form of new Set([w.reading, w.kanji].filter((f): f is string => !!f))) {
    const meanings = spellings.get(form) ?? new Set<string>();
    meanings.add(meaningKey(w.en));
    spellings.set(form, meanings);
  }
}
const unambiguous = (form: string): boolean => (spellings.get(form)?.size ?? 0) === 1;

function vocabQuestion(tier: Tier, used: Set<string>, rng: Rng): Question | null {
  const pool = ALL_WORDS.filter((w) => w.tier === tier && !used.has(w.id) && unambiguous(shownWord(w, tier)));
  const w = pickOne(pool, rng);
  if (!w) return null;
  used.add(w.id);
  const key = meaningKey(w.en);
  const wrong = shuffle(
    ALL_WORDS.filter((o) => o.tier === tier && meaningKey(o.en) !== key && !meaningKey(o.en).includes(key) && !key.includes(meaningKey(o.en))),
    rng,
  );
  const seen = new Set<string>();
  const wrongEn: string[] = [];
  for (const o of wrong) {
    const k = meaningKey(o.en);
    if (seen.has(k)) continue;
    seen.add(k);
    wrongEn.push(o.en);
    if (wrongEn.length === 3) break;
  }
  return { kind: 'vocab', area: tier, prompt: shownWord(w, tier), ask: 'What does this word mean?', ...withAnswer(w.en, wrongEn, rng) };
}

const kanjiTier = (k: Kanji): string | undefined => STOP_BY_ID.get(k.stop)?.tier;
const acceptedReadings = (k: Kanji): Set<string> =>
  new Set([...k.kun.map((r) => r.replace(/\(.*\)/, '')), ...k.on.map(toHiragana), primaryReading(k)].filter(Boolean));

function kanjiQuestion(tier: Tier, used: Set<string>, rng: Rng): Question | null {
  const pool = KANJI.filter((k) => kanjiTier(k) === tier);
  const k = pickOne(pool.filter((o) => !used.has(o.char) && primaryReading(o)), rng);
  if (!k) return null;
  used.add(k.char);
  const ok = acceptedReadings(k);
  const wrong = [...new Set(shuffle(pool, rng).map(primaryReading).filter((r) => r && !ok.has(r)))].slice(0, 3);
  return { kind: 'kanji', area: tier, prompt: k.char, ask: 'How is this kanji read?', note: `${k.char} means “${k.meaning}”.`, ...withAnswer(primaryReading(k), wrong, rng) };
}

function particleQuestion(tier: Tier, used: Set<string>, rng: Rng): Question | null {
  const pool = PARTICLES.filter((p) => STOP_BY_ID.get(p.from)?.tier === tier && !used.has(p.id));
  const p = pickOne(pool, rng);
  if (!p) return null;
  used.add(p.id);
  return { kind: 'particle', area: tier, prompt: p.text, markup: true, ask: `Which fits the ${BLANK}?`, note: p.why, ...withAnswer(p.answer, shuffle(p.wrong, rng).slice(0, 3), rng) };
}

function grammarQuestion(tier: Tier, used: Set<string>, rng: Rng): Question | null {
  const examples = STOPS.filter((s) => s.tier === tier).flatMap((s) => grammarsAt(s.id).flatMap((g) => g.examples.map((e) => ({ ...e, gid: g.id, pattern: g.pattern }))));
  const e = pickOne(examples.filter((x) => !used.has(x.jp)), rng);
  if (!e) return null;
  used.add(e.jp);
  const seen = new Set([e.en]);
  const wrong: string[] = [];
  for (const o of shuffle(examples.filter((x) => x.gid !== e.gid), rng)) {
    if (seen.has(o.en)) continue;
    seen.add(o.en);
    wrong.push(o.en);
    if (wrong.length === 3) break;
  }
  return { kind: 'grammar', area: tier, prompt: e.jp, markup: true, ask: 'What does this sentence mean?', note: `Pattern: ${e.pattern}`, ...withAnswer(e.en, wrong, rng) };
}

/** Five questions at one level: two on vocabulary, one each on a particle, a grammar pattern and a kanji. */
export function tierQuestions(tier: Tier, rng: Rng = Math.random): Question[] {
  const usedWords = new Set<string>();
  const usedKanji = new Set<string>();
  const usedParticles = new Set<string>();
  const usedExamples = new Set<string>();
  const out: Question[] = [];
  const add = (q: Question | null): void => {
    if (q && q.choices.length >= 3) out.push(q);
  };
  add(vocabQuestion(tier, usedWords, rng));
  add(vocabQuestion(tier, usedWords, rng));
  add(grammarQuestion(tier, usedExamples, rng));
  add(particleQuestion(tier, usedParticles, rng));
  add(kanjiQuestion(tier, usedKanji, rng));
  // a level short of one kind of question makes up the numbers with vocabulary
  while (out.length < TIER_QUESTIONS) {
    const extra = vocabQuestion(tier, usedWords, rng);
    if (!extra) break;
    out.push(extra);
  }
  return shuffle(out, rng);
}

/** Has a block of questions been decided? Returns the verdict as soon as it can't change. */
export function blockVerdict(right: number, wrong: number, total: number, pass: number): 'pass' | 'fail' | null {
  if (right >= pass) return 'pass';
  if (wrong > total - pass) return 'fail';
  return null;
}

export interface Showing {
  hiragana: boolean;
  katakana: boolean;
  /** levels passed in order, stopping at the first one not passed */
  tiers: Tier[];
}

export function placedLevel(show: Showing): PlacedLevel {
  if (!show.hiragana) return 'none';
  if (!show.katakana) return 'hiragana';
  return show.tiers[show.tiers.length - 1] ?? 'kana';
}

/** Where on the journey a result lets you start: the first stop that teaches something you did not show you know. */
export function startIndexFor(level: PlacedLevel): number {
  switch (level) {
    case 'none':
      return 0;
    case 'hiragana':
      return STOPS.findIndex((s) => s.teaches.some((g) => g.startsWith('k-')));
    case 'kana':
      return firstStopOfTier('N5');
    case 'N1':
      return firstStopOfTier('N1');
    default:
      return firstStopOfTier(TIERS[TIERS.indexOf(level) + 1]!);
  }
}
