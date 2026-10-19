import { s } from './dom';
import type { Stop } from '../data/journey';

/** An eki (station) stamp: Japanese stations have collectible rubber stamps — here's ours. */
export function stampSvg(stop: Stop, size = 96, inked = true): SVGElement {
  const color = inked ? '#c0392b' : '#bbb';
  return s(
    'svg',
    { viewBox: '0 0 100 100', width: size, height: size, class: `stamp ${inked ? '' : 'blank'}`, role: 'img', 'aria-label': `${stop.name} station stamp` },
    s('circle', { cx: 50, cy: 50, r: 46, fill: 'none', stroke: color, 'stroke-width': 4 }),
    s('circle', { cx: 50, cy: 50, r: 39, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }),
    s('text', { x: 50, y: 52, 'text-anchor': 'middle', 'font-size': 30 }, inked ? stop.emoji : '?'),
    s('text', { x: 50, y: 78, 'text-anchor': 'middle', 'font-size': 13, fill: color, 'font-weight': 700, class: 'jp' }, stop.jp),
    s('text', { x: 50, y: 24, 'text-anchor': 'middle', 'font-size': 8, fill: color, 'font-weight': 700, 'letter-spacing': 1 }, stop.name.split(' ')[0]!.toUpperCase()),
  );
}
