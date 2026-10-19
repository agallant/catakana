/** Pure scoring of a traced glyph against masks (all arrays are w*h, values 0/1). */
export interface TraceScore {
  coverage: number; // portion of the glyph that the learner inked over
  precision: number; // portion of the ink that stayed near the glyph
  pass: boolean;
  stars: 1 | 2 | 3 | 0;
}

export function scoreTrace(glyph: Uint8Array, nearGlyph: Uint8Array, ink: Uint8Array, thresholds = { coverage: 0.6, precision: 0.65 }): TraceScore {
  let g = 0;
  let covered = 0;
  let inkCount = 0;
  let inkNear = 0;
  for (let i = 0; i < glyph.length; i++) {
    if (glyph[i]) {
      g++;
      if (ink[i]) covered++;
    }
    if (ink[i]) {
      inkCount++;
      if (nearGlyph[i]) inkNear++;
    }
  }
  const coverage = g === 0 ? 0 : covered / g;
  const precision = inkCount === 0 ? 0 : inkNear / inkCount;
  const pass = coverage >= thresholds.coverage && precision >= thresholds.precision;
  const combined = Math.min(coverage / 0.85, 1) * 0.6 + precision * 0.4;
  const stars = !pass ? 0 : combined > 0.88 ? 3 : combined > 0.75 ? 2 : 1;
  return { coverage, precision, pass, stars };
}
