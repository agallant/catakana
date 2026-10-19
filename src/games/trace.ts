import { h, sleep } from '../ui/dom';
import { sfx, speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { sessionItems, shell } from './common';
import { scoreTrace } from './trace-score';

const FONT = '"Hiragino Maru Gothic ProN","Hiragino Sans","Noto Sans JP","Yu Gothic","Meiryo",sans-serif';
const GRID = 96; // scoring resolution per cell

function maskOf(draw: (c: CanvasRenderingContext2D) => void, w: number, h2: number): Uint8Array {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h2;
  const c = cv.getContext('2d', { willReadFrequently: true });
  if (!c) return new Uint8Array(w * h2);
  draw(c);
  const d = c.getImageData(0, 0, w, h2).data;
  const out = new Uint8Array(w * h2);
  for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3]! > 100 ? 1 : 0;
  return out;
}

/** Paw painting: trace the character on a canvas; scored by coverage and accuracy. */
export const traceGame: GameDef = {
  id: 'trace',
  name: 'Paw Painting',
  jp: 'なぞりがき',
  emoji: '🐾',
  blurb: 'Trace characters with your paw — finger or mouse!',
  kinds: ['kana', 'word'],
  skill: 'writing',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Paw Painting 🐾');
    // Use short items so every glyph fits: kana and words up to 3 characters.
    const items = sessionItems(ctx, 8).filter((i) => [...i.text].length <= 3);
    const queue = items.length ? items.slice(0, 6) : ctx.pool.slice(0, 5);
    let idx = 0;
    let correct = 0;

    const next = (): void => {
      if (idx >= queue.length) {
        sh.destroy();
        return ctx.finish({ correct, total: queue.length });
      }
      sh.setProgress(idx, queue.length);
      const item = queue[idx]!;
      const chars = [...item.text];
      const n = chars.length;
      const cell = Math.min(280, Math.floor((Math.min(window.innerWidth, 520) - 48) / n));
      const w = cell * n;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cv = h('canvas', { class: 'trace-canvas', width: w * dpr, height: cell * dpr, style: `width:${w}px;height:${cell}px;touch-action:none` });
      const c = cv.getContext('2d')!;
      c.scale(dpr, dpr);
      const guideAlpha = ctx.level === 1 ? 0.28 : ctx.level === 2 ? 0.1 : 0;

      const paintGuide = (): void => {
        c.clearRect(0, 0, w, cell);
        c.fillStyle = '#fffdf8';
        c.fillRect(0, 0, w, cell);
        c.strokeStyle = '#e8d9c4';
        c.setLineDash([6, 6]);
        c.lineWidth = 1;
        c.beginPath();
        for (let i = 0; i < n; i++) {
          c.moveTo(i * cell + cell / 2, 8);
          c.lineTo(i * cell + cell / 2, cell - 8);
        }
        c.moveTo(8, cell / 2);
        c.lineTo(w - 8, cell / 2);
        c.stroke();
        c.setLineDash([]);
        if (guideAlpha > 0) {
          c.fillStyle = `rgba(60,40,20,${guideAlpha})`;
          c.font = `${cell * 0.78}px ${FONT}`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          chars.forEach((ch, i) => c.fillText(ch, i * cell + cell / 2, cell / 2 + cell * 0.04));
        }
      };
      paintGuide();

      // ink is recorded as polylines so we can rasterise for scoring at any resolution
      const strokes: { x: number; y: number }[][] = [];
      let cur: { x: number; y: number }[] | null = null;
      const redrawInk = (): void => {
        paintGuide();
        c.strokeStyle = '#ff6f91';
        c.lineWidth = Math.max(8, cell / 14);
        c.lineCap = 'round';
        c.lineJoin = 'round';
        for (const s of strokes) {
          c.beginPath();
          s.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
          if (s.length === 1) c.lineTo(s[0]!.x + 0.1, s[0]!.y);
          c.stroke();
        }
      };
      const pos = (e: PointerEvent): { x: number; y: number } => {
        const r = cv.getBoundingClientRect();
        return { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * cell };
      };
      cv.addEventListener('pointerdown', (e) => {
        cv.setPointerCapture(e.pointerId);
        cur = [pos(e)];
        strokes.push(cur);
        redrawInk();
      });
      cv.addEventListener('pointermove', (e) => {
        if (!cur) return;
        cur.push(pos(e));
        redrawInk();
      });
      const end = (): void => {
        cur = null;
      };
      cv.addEventListener('pointerup', end);
      cv.addEventListener('pointercancel', end);

      let done = false;
      const check = async (): Promise<void> => {
        if (done || !strokes.length) return;
        done = true;
        let covSum = 0;
        let precSum = 0;
        let passAll = true;
        const t = ctx.level === 3 ? { coverage: 0.5, precision: 0.55 } : { coverage: 0.6, precision: 0.65 };
        for (let i = 0; i < n; i++) {
          const scale = GRID / cell;
          const g = maskOf((k) => {
            k.fillStyle = '#000';
            k.font = `${GRID * 0.78}px ${FONT}`;
            k.textAlign = 'center';
            k.textBaseline = 'middle';
            k.fillText(chars[i]!, GRID / 2, GRID / 2 + GRID * 0.04);
          }, GRID, GRID);
          const near = maskOf((k) => {
            k.fillStyle = '#000';
            k.strokeStyle = '#000';
            k.lineWidth = GRID * 0.17;
            k.font = `${GRID * 0.78}px ${FONT}`;
            k.textAlign = 'center';
            k.textBaseline = 'middle';
            k.fillText(chars[i]!, GRID / 2, GRID / 2 + GRID * 0.04);
            k.strokeText(chars[i]!, GRID / 2, GRID / 2 + GRID * 0.04);
          }, GRID, GRID);
          const ink = maskOf((k) => {
            k.strokeStyle = '#000';
            k.lineWidth = Math.max(6, GRID * 0.1);
            k.lineCap = 'round';
            k.lineJoin = 'round';
            for (const s of strokes) {
              k.beginPath();
              s.forEach((p, j) => {
                const x = (p.x - i * cell) * scale;
                const y = p.y * scale;
                if (j) k.lineTo(x, y);
                else k.moveTo(x, y);
              });
              if (s.length === 1) k.lineTo((s[0]!.x - i * cell) * scale + 0.1, s[0]!.y * scale);
              k.stroke();
            }
          }, GRID, GRID);
          const sc = scoreTrace(g, near, ink, t);
          covSum += sc.coverage;
          precSum += sc.precision;
          if (!sc.pass) passAll = false;
        }
        const ok = passAll;
        ctx.store.recordAnswer(item.id, ok);
        if (ok) correct++;
        sfx[ok ? 'correct' : 'wrong']();
        sh.flash(ok);
        sh.say(ok ? 'Beautiful brushwork!' : 'Follow the shape a bit closer!', ok ? 'happy' : 'sad');
        feedback.textContent = `Coverage ${Math.round((covSum / n) * 100)}% · Accuracy ${Math.round((precSum / n) * 100)}%`;
        if (!ok) {
          // reveal the model glyph
          c.fillStyle = 'rgba(60,40,20,0.35)';
          c.font = `${cell * 0.78}px ${FONT}`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          chars.forEach((ch, i) => c.fillText(ch, i * cell + cell / 2, cell / 2 + cell * 0.04));
        }
        void speak(item.reading);
        await sleep(ok ? 900 : 1800);
        idx++;
        next();
      };

      const feedback = h('div', { class: 'hint' }, ' ');
      const clearBtn = h('button', { class: 'btn ghost', onClick: () => { strokes.length = 0; redrawInk(); } }, '↺ Clear');
      const doneBtn = h('button', { class: 'btn primary', onClick: () => void check() }, 'Done ✓');
      const prompt = h(
        'div',
        { class: 'prompt-row' },
        h('div', { class: 'prompt' }, h('div', { class: 'prompt-jp' }, item.romaji), item.en ? h('div', { class: 'prompt-romaji' }, `${item.emoji ?? ''} ${item.en}`) : h('div', { class: 'prompt-romaji' }, 'Trace it!')),
        h('button', { class: 'btn small ghost', onClick: () => void speak(item.reading), 'aria-label': 'Hear it' }, '🔊'),
      );
      sh.body.replaceChildren(prompt, h('div', { class: 'trace-wrap' }, cv), feedback, h('div', { class: 'row' }, clearBtn, doneBtn));
      if (ctx.level === 3) sh.say(`Write “${item.romaji}” from memory!`, 'think');
    };
    sh.setLives(3);
    sh.say('Trace with your finger!', 'happy');
    next();
  },
};
