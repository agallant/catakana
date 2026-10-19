import { s } from './dom';
import type { CatLook } from '../core/store';

export type Mood = 'happy' | 'sad' | 'think' | 'wow' | 'sleep';

/** Procedurally drawn cat face/body in SVG. Cheap, offline, endlessly customisable. */
export function catSvg(look: CatLook, mood: Mood = 'happy', size = 120): SVGElement {
  const { fur, accent, pattern, eyes, hat } = look;
  const g: SVGElement[] = [];
  // tail
  g.push(s('path', { d: 'M150 150 C190 150 195 100 170 95', fill: 'none', stroke: fur, 'stroke-width': 14, 'stroke-linecap': 'round', class: 'cat-tail' }));
  // body
  g.push(s('ellipse', { cx: 100, cy: 150, rx: 52, ry: 40, fill: fur }));
  g.push(s('ellipse', { cx: 100, cy: 160, rx: 30, ry: 26, fill: '#fff', opacity: 0.55 }));
  // paws
  g.push(s('ellipse', { cx: 78, cy: 186, rx: 14, ry: 8, fill: fur }));
  g.push(s('ellipse', { cx: 122, cy: 186, rx: 14, ry: 8, fill: fur }));
  // ears
  g.push(s('path', { d: 'M52 62 L58 18 L92 46 Z', fill: fur }));
  g.push(s('path', { d: 'M148 62 L142 18 L108 46 Z', fill: fur }));
  g.push(s('path', { d: 'M60 52 L63 30 L80 46 Z', fill: '#ffb3c1' }));
  g.push(s('path', { d: 'M140 52 L137 30 L120 46 Z', fill: '#ffb3c1' }));
  // head
  g.push(s('ellipse', { cx: 100, cy: 88, rx: 56, ry: 48, fill: fur }));
  if (pattern === 'tabby') {
    g.push(s('path', { d: 'M100 42 v16 M88 44 l3 13 M112 44 l-3 13', stroke: accent, 'stroke-width': 5, 'stroke-linecap': 'round' }));
    g.push(s('path', { d: 'M48 80 h14 M50 94 h12 M152 80 h-14 M150 94 h-12', stroke: accent, 'stroke-width': 4, 'stroke-linecap': 'round' }));
  } else if (pattern === 'tuxedo') {
    g.push(s('path', { d: 'M100 60 C80 80 80 120 100 134 C120 120 120 80 100 60Z', fill: '#fff', opacity: 0.95 }));
  } else if (pattern === 'spots') {
    g.push(s('circle', { cx: 70, cy: 70, r: 9, fill: accent }));
    g.push(s('circle', { cx: 134, cy: 98, r: 7, fill: accent }));
    g.push(s('circle', { cx: 120, cy: 58, r: 5, fill: accent }));
  } else if (pattern === 'calico') {
    g.push(s('path', { d: 'M48 70 C60 40 90 40 96 60 C80 80 60 96 48 70Z', fill: accent }));
    g.push(s('path', { d: 'M152 90 C140 70 120 80 124 110 C140 120 152 110 152 90Z', fill: '#444', opacity: 0.85 }));
  }
  // eyes
  const ex = [76, 124];
  if (mood === 'sleep' || mood === 'happy') {
    for (const x of ex) g.push(s('path', { d: `M${x - 10} 88 Q${x} ${mood === 'happy' ? 76 : 98} ${x + 10} 88`, fill: 'none', stroke: '#2b2b2b', 'stroke-width': 4, 'stroke-linecap': 'round' }));
  } else {
    for (const x of ex) {
      g.push(s('ellipse', { cx: x, cy: 86, rx: 11, ry: mood === 'wow' ? 14 : 12, fill: '#fff' }));
      g.push(s('ellipse', { cx: x + (mood === 'think' ? 3 : 0), cy: mood === 'think' ? 82 : 87, rx: 7, ry: 9, fill: eyes }));
      g.push(s('circle', { cx: x + 2, cy: 83, r: 2.6, fill: '#fff' }));
    }
  }
  // nose + mouth
  g.push(s('path', { d: 'M94 102 h12 l-6 7 Z', fill: '#ff8fa3' }));
  g.push(
    s('path', {
      d: mood === 'sad' ? 'M88 120 Q100 110 112 120' : mood === 'wow' ? 'M94 112 Q100 128 106 112 Z' : 'M88 110 Q100 124 100 109 Q100 124 112 110',
      fill: mood === 'wow' ? '#c0392b' : 'none',
      stroke: '#2b2b2b',
      'stroke-width': 3,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  );
  // whiskers
  g.push(s('path', { d: 'M52 104 h-26 M52 112 l-24 8 M148 104 h26 M148 112 l24 8', stroke: '#5b5b5b', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.7 }));
  // blush
  g.push(s('ellipse', { cx: 62, cy: 108, rx: 9, ry: 5, fill: '#ff8fa3', opacity: 0.35 }));
  g.push(s('ellipse', { cx: 138, cy: 108, rx: 9, ry: 5, fill: '#ff8fa3', opacity: 0.35 }));
  // hat
  switch (hat) {
    case 'beret':
      g.push(s('ellipse', { cx: 100, cy: 42, rx: 40, ry: 14, fill: '#d94f6a' }));
      g.push(s('circle', { cx: 100, cy: 28, r: 4, fill: '#d94f6a' }));
      break;
    case 'bow':
      g.push(s('path', { d: 'M100 134 l-22 -12 v24 Z M100 134 l22 -12 v24 Z', fill: '#ff5d8f' }));
      g.push(s('circle', { cx: 100, cy: 134, r: 6, fill: '#e0356e' }));
      break;
    case 'scarf':
      g.push(s('path', { d: 'M60 128 Q100 150 140 128 L140 142 Q100 164 60 142Z', fill: '#e74c3c' }));
      g.push(s('rect', { x: 118, y: 138, width: 14, height: 34, rx: 5, fill: '#e74c3c' }));
      break;
    case 'straw':
      g.push(s('ellipse', { cx: 100, cy: 46, rx: 62, ry: 10, fill: '#e8c872' }));
      g.push(s('path', { d: 'M68 46 Q70 14 100 14 Q130 14 132 46Z', fill: '#f0d68a' }));
      g.push(s('rect', { x: 68, y: 38, width: 64, height: 7, fill: '#d94f4f' }));
      break;
    case 'crown':
      g.push(s('path', { d: 'M68 46 l6 -28 l16 16 l10 -22 l10 22 l16 -16 l6 28Z', fill: '#ffd24a', stroke: '#e0a800', 'stroke-width': 2 }));
      break;
    case 'headband':
      g.push(s('rect', { x: 50, y: 52, width: 100, height: 11, rx: 4, fill: '#fff', stroke: '#d12', 'stroke-width': 1 }));
      g.push(s('circle', { cx: 100, cy: 57.5, r: 5, fill: '#d12' }));
      break;
    default:
  }
  return s('svg', { viewBox: '0 0 200 200', width: size, height: size, class: `cat cat-${mood}`, role: 'img', 'aria-label': `cat feeling ${mood}` }, ...g);
}

export const FUR_PRESETS: { fur: string; accent: string; pattern: CatLook['pattern'] }[] = [
  { fur: '#f6b26b', accent: '#e69138', pattern: 'tabby' },
  { fur: '#9e9e9e', accent: '#616161', pattern: 'tabby' },
  { fur: '#2b2b2b', accent: '#111', pattern: 'tuxedo' },
  { fur: '#fff3e0', accent: '#f4b183', pattern: 'calico' },
  { fur: '#d7ccc8', accent: '#8d6e63', pattern: 'spots' },
  { fur: '#fafafa', accent: '#e0e0e0', pattern: 'plain' },
  { fur: '#c9a27a', accent: '#8b5a2b', pattern: 'tabby' },
  { fur: '#b0bec5', accent: '#78909c', pattern: 'plain' },
];
