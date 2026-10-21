import type { GrammarPoint, Sentence } from '../data/n5';
import { TOUR_CONTENT } from '../data/tour';
import { STOPS } from '../data/journey';

export interface SentenceItem extends Sentence {
  id: string;
  stop: string;
}

/** Sentences taught at or before stop `index`. */
export function sentencesThrough(index: number): SentenceItem[] {
  return STOPS.slice(0, index + 1).flatMap((s) =>
    (TOUR_CONTENT[s.id]?.sentences ?? []).map((sen, i) => ({ ...sen, id: `s:${s.id}:${i}`, stop: s.id })),
  );
}

/** Every grammar point taught at a stop: the main one first, then any extras. */
export function grammarsAt(stopId: string): GrammarPoint[] {
  const c = TOUR_CONTENT[stopId];
  return c ? [c.grammar, ...(c.extraGrammar ?? [])] : [];
}

const PARTICLES = ['は', 'を', 'に', 'へ', 'で', 'が', 'の'];

/** A plausible wrong chunk: swap a trailing particle (e.g. ねこを → ねこが). */
export function decoyChunk(chunks: string[], rng: () => number = Math.random): string | null {
  const candidates = chunks.filter((c) => PARTICLES.includes(c.slice(-1)) && c.length > 1);
  if (!candidates.length) return null;
  const c = candidates[Math.floor(rng() * candidates.length)]!;
  const others = PARTICLES.filter((p) => p !== c.slice(-1));
  const swapped = c.slice(0, -1) + others[Math.floor(rng() * others.length)]!;
  return chunks.includes(swapped) ? null : swapped;
}
