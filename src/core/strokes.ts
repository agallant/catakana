/** Stroke-order data (KanjiVG, CC BY-SA 3.0) and stroke matching. Coordinates use KanjiVG's 109×109 box. */
export type Pt = { x: number; y: number };
export type StrokeData = Record<string, string[]>;

let cache: Promise<StrokeData> | null = null;

/** Lazily load stroke paths (kept out of the main bundle). */
export function loadStrokes(): Promise<StrokeData> {
  cache ??= import('../data/strokes.json').then((m) => (m.default ?? m) as StrokeData);
  return cache;
}

export const BOX = 109;

export function pathLength(pts: Pt[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  return len;
}

/** Resample a polyline to n evenly spaced points. */
export function resample(pts: Pt[], n: number): Pt[] {
  if (pts.length === 0) return [];
  if (pts.length === 1) return Array.from({ length: n }, () => ({ ...pts[0]! }));
  const total = pathLength(pts);
  if (total === 0) return Array.from({ length: n }, () => ({ ...pts[0]! }));
  const step = total / (n - 1);
  const out: Pt[] = [{ ...pts[0]! }];
  let acc = 0;
  let prev = pts[0]!;
  for (let i = 1; i < pts.length && out.length < n; i++) {
    const cur = pts[i]!;
    let d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    while (acc + d >= step && out.length < n) {
      const t = (step - acc) / d;
      const p = { x: prev.x + t * (cur.x - prev.x), y: prev.y + t * (cur.y - prev.y) };
      out.push(p);
      prev = p;
      d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      acc = 0;
    }
    acc += d;
    prev = cur;
  }
  while (out.length < n) out.push({ ...pts[pts.length - 1]! });
  return out;
}

function meanDist(a: Pt[], b: Pt[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.hypot(a[i]!.x - b[i]!.x, a[i]!.y - b[i]!.y);
  return s / a.length;
}

export interface StrokeVerdict {
  ok: boolean;
  /** drawn in the opposite direction */
  reversed: boolean;
  dist: number;
}

/**
 * Compare a drawn stroke with the expected one. Tolerance grows for short strokes (dots/ticks
 * are hard to place exactly) and with `leniency` (difficulty).
 */
export function matchStroke(drawn: Pt[], expected: Pt[], leniency = 1): StrokeVerdict {
  const N = 24;
  const a = resample(drawn, N);
  const b = resample(expected, N);
  const len = pathLength(expected);
  const tol = (12 + Math.max(0, 25 - len) * 0.35) * leniency;
  const dist = meanDist(a, b);
  const rev = meanDist(a, [...b].reverse());
  const lengthOk = pathLength(drawn) > len * 0.4 || len < 12;
  if (dist <= tol && lengthOk) return { ok: true, reversed: false, dist };
  return { ok: false, reversed: rev <= tol && rev < dist, dist };
}

/** Sample an SVG path's points (browser only). */
export function samplePath(d: string, n = 40): Pt[] {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 0;
  if (!len) return [];
  return Array.from({ length: n }, (_, i) => {
    const q = p.getPointAtLength((len * i) / (n - 1));
    return { x: q.x, y: q.y };
  });
}
