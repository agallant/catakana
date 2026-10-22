import type { Settings } from './store';

/**
 * "Young learner" mode is a preset on top of the normal game, not a separate game:
 * the same content and games, with calmer rules and a grown-up check on the settings that matter.
 */

/** Flip the settings a young learner needs. Turning the mode off later leaves them as they are. */
export function applyKidPreset(s: Settings): void {
  s.kid = true;
  s.furigana = 'always';
  s.romaji = true;
  s.speech = true;
}

/** Lives for a round: three normally; young learners never run out (the round just carries on). */
export function startingLives(s: Settings): number {
  return s.kid ? 99 : 3;
}

export interface Gate {
  question: string;
  answer: number;
}

/** A small sum a grown-up can answer quickly and a young child cannot guess (answer 11..21). */
export function makeGate(rand: () => number = Math.random): Gate {
  const a = 4 + Math.floor(rand() * 6);
  const b = 7 + Math.floor(rand() * 6);
  return { question: `Grown-ups only: what is ${a} + ${b}?`, answer: a + b };
}

export function checkGate(g: Gate, input: string | null): boolean {
  return input !== null && input.trim() === String(g.answer);
}

export const BREAK_EVERY_MS = 20 * 60 * 1000;

/** Time for a gentle break reminder: once per `every` of play since the last reminder (or the start). */
export function breakDue(sinceMs: number, now: number, every = BREAK_EVERY_MS): boolean {
  return now - sinceMs >= every;
}
