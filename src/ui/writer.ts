import { s } from './dom';
import { BOX, matchStroke, samplePath, type Pt } from '../core/strokes';

export interface WriterOptions {
  strokes: string[];
  /** 1: full faint model + next-stroke hint, 2: start-dot hint only, 3: no hints */
  level: 1 | 2 | 3;
  size: number;
  onStroke?(ok: boolean, reversed: boolean, index: number): void;
  onDone(mistakes: number): void;
}

export interface Writer {
  el: SVGElement;
  /** animate the next expected stroke */
  hint(): void;
  /** restart the character */
  reset(): void;
}

/** Interactive stroke-by-stroke writing pad for one character (kana or kanji). */
export function createWriter(o: WriterOptions): Writer {
  const expected = o.strokes.map((d) => samplePath(d));
  const grid = s('g', { class: 'w-grid' }, s('path', { d: `M${BOX / 2} 4V${BOX - 4}M4 ${BOX / 2}H${BOX - 4}` }));
  const model = s('g', { class: 'w-model' }, ...(o.level === 1 ? o.strokes.map((d) => s('path', { d })) : []));
  const ink = s('g', { class: 'w-ink' });
  const hintLayer = s('g', { class: 'w-hint' });
  const live = s('polyline', { class: 'w-live', points: '' });
  const svg = s('svg', { viewBox: `0 0 ${BOX} ${BOX}`, width: o.size, height: o.size, class: 'writer', style: 'touch-action:none' }, grid, model, ink, hintLayer, live);

  let n = 0;
  let mistakes = 0;
  let strikes = 0;
  let pts: Pt[] = [];
  let drawing = false;

  const showNextCue = (): void => {
    hintLayer.replaceChildren();
    const next = expected[n];
    if (!next || o.level === 3 || !next.length) return;
    const p0 = next[0]!;
    hintLayer.appendChild(s('circle', { cx: p0.x, cy: p0.y, r: 4, class: 'w-start' }));
    if (o.level === 1) hintLayer.appendChild(s('path', { d: o.strokes[n]!, class: 'w-next' }));
  };
  const hint = (): void => {
    const d = o.strokes[n];
    if (!d) return;
    hintLayer.replaceChildren(s('path', { d, class: 'w-anim', pathLength: 1 }));
  };
  const reset = (): void => {
    // mistakes are kept on purpose; a finished character can't be restarted
    if (n >= expected.length) return;
    n = 0;
    strikes = 0;
    drawing = false;
    live.setAttribute('points', '');
    ink.replaceChildren();
    showNextCue();
  };
  const toLocal = (e: PointerEvent): Pt => {
    const r = svg.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * BOX, y: ((e.clientY - r.top) / r.height) * BOX };
  };
  svg.addEventListener('pointerdown', (e) => {
    if (n >= expected.length) return;
    (svg as unknown as Element).setPointerCapture?.(e.pointerId);
    drawing = true;
    pts = [toLocal(e)];
    e.preventDefault();
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    pts.push(toLocal(e));
    live.setAttribute('points', pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
  });
  const end = (): void => {
    if (!drawing) return;
    drawing = false;
    live.setAttribute('points', '');
    const exp = expected[n];
    if (!exp || pts.length < 2) return;
    const v = matchStroke(pts, exp, o.level === 3 ? 1.15 : 1);
    if (v.ok) {
      ink.appendChild(s('path', { d: o.strokes[n]!, class: 'w-done' }));
      n++;
      strikes = 0;
      o.onStroke?.(true, false, n - 1);
      showNextCue();
      if (n >= expected.length) o.onDone(mistakes);
    } else {
      mistakes++;
      strikes++;
      o.onStroke?.(false, v.reversed, n);
      svg.classList.remove('w-shake');
      void svg.getBoundingClientRect();
      svg.classList.add('w-shake');
      if (strikes >= 2) hint();
    }
  };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  svg.addEventListener('pointerleave', end);
  showNextCue();
  return { el: svg, hint, reset };
}

/** Looping stroke-order animation for lessons (Web Animations API; static if unsupported). */
export function strokeAnimation(strokes: string[], size = 140): SVGElement {
  const per = 0.6;
  const total = strokes.length * per + 1.4;
  const seq = strokes.map((d) => s('path', { d, class: 'w-seq', pathLength: 1 }));
  const svg = s(
    'svg',
    { viewBox: `0 0 ${BOX} ${BOX}`, width: size, height: size, class: 'stroke-anim', role: 'img', 'aria-label': `stroke order, ${strokes.length} strokes` },
    s('g', { class: 'w-grid' }, s('path', { d: `M${BOX / 2} 4V${BOX - 4}M4 ${BOX / 2}H${BOX - 4}` })),
    ...strokes.map((d) => s('path', { d, class: 'w-ghost' })),
    ...seq,
  );
  const reduce = document.documentElement.classList.contains('reduce-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  seq.forEach((p, i) => {
    if (reduce || typeof p.animate !== 'function') return;
    const a = (i * per) / total;
    const b = ((i + 1) * per) / total;
    p.style.strokeDashoffset = '1';
    p.animate(
      [
        { offset: 0, strokeDashoffset: 1 },
        { offset: a, strokeDashoffset: 1 },
        { offset: b, strokeDashoffset: 0 },
        { offset: 1, strokeDashoffset: 0 },
      ],
      { duration: total * 1000, iterations: Infinity },
    );
  });
  return svg;
}
