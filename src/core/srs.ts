/** Leitner-style spaced repetition. Boxes 0..5; intervals in minutes for early boxes, days later. */
export interface SrsRecord {
  box: number;
  due: number; // epoch ms
  seen: number;
  correct: number;
  wrong: number;
  last: number;
}

const MIN = 60_000;
const DAY = 24 * 60 * MIN;
export const BOX_INTERVALS = [0, 10 * MIN, 1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY];
export const MAX_BOX = BOX_INTERVALS.length - 1;

export function newRecord(now: number): SrsRecord {
  return { box: 0, due: now, seen: 0, correct: 0, wrong: 0, last: now };
}

export function review(rec: SrsRecord | undefined, correct: boolean, now = Date.now()): SrsRecord {
  const r = rec ? { ...rec } : newRecord(now);
  r.seen++;
  r.last = now;
  if (correct) {
    r.correct++;
    r.box = Math.min(MAX_BOX, r.box + 1);
  } else {
    r.wrong++;
    r.box = Math.max(0, r.box - 2);
  }
  r.due = now + BOX_INTERVALS[r.box]!;
  return r;
}

export function isDue(rec: SrsRecord | undefined, now = Date.now()): boolean {
  return !rec || rec.due <= now;
}

/** 0..1 mastery estimate. */
export function mastery(rec: SrsRecord | undefined): number {
  if (!rec) return 0;
  return rec.box / MAX_BOX;
}

/**
 * Choose up to n item ids for practice from a pool: weakest/due first with a little shuffle,
 * so replays feel fresh but reinforce what's shaky.
 */
export function pickItems<T extends { id: string }>(
  pool: T[],
  records: Record<string, SrsRecord>,
  n: number,
  rng: () => number = Math.random,
  now = Date.now(),
): T[] {
  const scored = pool.map((it) => {
    const rec = records[it.id];
    const dueBonus = isDue(rec, now) ? 0 : 3;
    const score = (rec ? rec.box : -1) + dueBonus + rng() * 2;
    return { it, score };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, n).map((s) => s.it);
}

export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function sample<T>(arr: readonly T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)]!;
}
