import type { App, Screen } from '../ui/app';
import { h, sleep } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { CULTURE, type Trivia } from '../data/culture';
import { sfx } from '../core/audio';
import { shuffle } from '../core/srs';
import { catSvg } from '../ui/cat';
import { track } from '../core/progress';

/** Questions for a stop: its own trivia plus a few from earlier stops (spaced review of culture). */
export function triviaFor(stopId: string, rng: () => number = Math.random): Trivia[] {
  const idx = STOPS.findIndex((s) => s.id === stopId);
  const own = CULTURE[stopId]?.trivia ?? [];
  const earlier = STOPS.slice(0, Math.max(0, idx)).flatMap((s) => CULTURE[s.id]?.trivia ?? []);
  return [...own, ...shuffle(earlier, rng).slice(0, 3)];
}

export function triviaScreen(app: App, params: string[]): Screen {
  const stop = STOP_BY_ID.get(params[0] ?? '') ?? STOPS[0]!;
  const qs = shuffle(triviaFor(stop.id));
  const root = h('div', { class: 'screen trivia' });
  let i = 0;
  let score = 0;
  const show = (): void => {
    if (i >= qs.length) {
      const fish = score * 3;
      app.store.addRewards(fish, score * 4);
      app.store.update((d) => {
        d.trivia[stop.id] = Math.max(d.trivia[stop.id] ?? 0, score);
      });
      sfx.win();
      track(app.store, { type: 'trivia', score });
      root.replaceChildren(
        h(
          'div',
          { class: 'results' },
          h('h2', null, 'Tour complete!'),
          h('div', { class: 'result-cat' }, catSvg(stop.npc.look, 'wow', 120)),
          h('p', null, `${stop.npc.name}: “You know Japan ${score === qs.length ? 'purr-fectly' : 'pretty well'}!”`),
          h('p', null, `${score} / ${qs.length} correct`),
          h('div', { class: 'reward-row' }, h('span', null, `🐟 +${fish}`)),
          h('div', { class: 'row' }, h('button', { class: 'btn primary', onClick: () => app.go(`trivia/${stop.id}`) }, '↻ Again'), h('button', { class: 'btn ghost', onClick: () => app.go(`explore/${stop.id}`) }, 'Back')),
        ),
      );
      return;
    }
    const q = qs[i]!;
    const order = shuffle(q.options.map((text, k) => ({ text, k })));
    let locked = false;
    const buttons = order.map((o) => {
      const b = h('button', { class: 'choice text' }, o.text);
      b.addEventListener('click', async () => {
        if (locked) return;
        locked = true;
        const ok = o.k === q.answer;
        if (ok) score++;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) buttons[order.findIndex((x) => x.k === q.answer)]!.classList.add('right');
        (ok ? sfx.correct : sfx.wrong)();
        await sleep(ok ? 700 : 1500);
        i++;
        show();
      });
      return b;
    });
    root.replaceChildren(
      h('div', { class: 'row' }, h('button', { class: 'btn ghost small', onClick: () => app.go(`explore/${stop.id}`) }, '✕'), h('strong', null, `Question ${i + 1}/${qs.length}`)),
      h('div', { class: 'npc' }, h('div', { class: 'npc-cat' }, catSvg(stop.npc.look, 'think', 72)), h('div', { class: 'speech' }, h('strong', null, stop.npc.name), h('div', null, q.q))),
      h('div', { class: 'choices one-col' }, buttons),
    );
  };
  show();
  return { el: root };
}
