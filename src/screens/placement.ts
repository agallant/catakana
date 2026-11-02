import type { App, Screen } from '../ui/app';
import { h, sleep } from '../ui/dom';
import { ALL_KANA, type KanaChar } from '../data/kana';
import { STOPS } from '../data/journey';
import { shuffle } from '../core/srs';
import { sfx } from '../core/audio';
import { catSvg } from '../ui/cat';
import { review } from '../core/srs';
import { checkAchievements } from '../core/progress';
import { currentStopIndex } from '../core/curriculum';
import type { Store } from '../core/store';

const PER_SCRIPT = 8;
const PASS = 7;

/** Where a placement result lets you start: 0 = beginning, else the first stop after what you already know. */
export function placementStart(hiraCorrect: number, kataCorrect: number): number {
  const hira = hiraCorrect >= PASS;
  const kata = kataCorrect >= PASS;
  if (hira && kata) return STOPS.findIndex((s) => s.tier === 'N5');
  if (hira) return STOPS.findIndex((s) => s.teaches.some((g) => g.startsWith('k-')));
  return 0;
}

/**
 * Mark every stop before `start` as done and its kana as known. It only ever moves forward: stars,
 * stamps and introduced items you already have are kept, so taking the test again later can't cost progress.
 */
export function applyPlacement(store: Store, start: number): void {
  const skipped = STOPS.slice(0, start);
  const known = ALL_KANA.filter((k) => skipped.some((s) => s.teaches.includes(k.group)));
  store.update((d) => {
    for (const s of skipped) {
      d.stops[s.id] = Math.max(d.stops[s.id] ?? 0, 1);
      if (!d.stamps.includes(s.id)) d.stamps.push(s.id);
    }
    const intro = new Set(d.introduced);
    for (const k of known) {
      // count them as reviewed once so they show up as known, not new; leave anything already practised alone
      if (!intro.has(k.id)) d.srs[k.id] = review(review(d.srs[k.id], true), true);
      intro.add(k.id);
    }
    d.introduced = [...intro];
    d.started = true;
  });
}

/** Quick kana check for learners who already read some Japanese. */
export function placementScreen(app: App): Screen {
  const pick = (script: 'hiragana' | 'katakana'): KanaChar[] => shuffle(ALL_KANA.filter((k) => k.script === script)).slice(0, PER_SCRIPT);
  const qs = shuffle([...pick('hiragana'), ...pick('katakana')]);
  const root = h('div', { class: 'screen placement' });
  let i = 0;
  const right = { hiragana: 0, katakana: 0 };

  const finish = (): void => {
    const started = app.store.data.started;
    const start = placementStart(right.hiragana, right.katakana);
    // taking the test again later never moves you back
    const ahead = start > currentStopIndex(app.store.data);
    root.replaceChildren(
      h(
        'div',
        { class: 'results' },
        h('h2', null, 'Placement result'),
        h('div', { class: 'result-cat' }, catSvg(app.store.data.look, ahead ? 'wow' : 'happy', 120)),
        h('p', null, `Hiragana ${right.hiragana}/${PER_SCRIPT} · Katakana ${right.katakana}/${PER_SCRIPT}`),
        h(
          'p',
          null,
          ahead
            ? `Great! You can start at ${STOPS[start]!.name} ${STOPS[start]!.emoji}. Earlier stops stay open for review.`
            : !started
              ? 'Let’s start from the very beginning in Tokyo — you’ll fly through it!'
              : start === 0
                ? 'Nothing to skip yet — the journey from Tokyo is the right place for you. Your progress stays as it is.'
                : 'You are already past what this test checks. Your progress stays exactly as it is.',
        ),
        h(
          'div',
          { class: 'row' },
          ahead
            ? h(
                'button',
                {
                  class: 'btn primary big',
                  onClick: () => {
                    applyPlacement(app.store, start);
                    checkAchievements(app.store);
                    app.go(`travel/${STOPS[start]!.id}`);
                  },
                },
                `Skip ahead to ${STOPS[start]!.name}`,
              )
            : null,
          started
            ? h('button', { class: 'btn ghost', onClick: () => app.go('map') }, ahead ? 'Not now' : 'Back to the map')
            : h('button', { class: 'btn ghost', onClick: () => { app.store.update((d) => { d.started = true; }); app.go('travel/tokyo'); } }, 'Start from Tokyo'),
        ),
      ),
    );
  };

  const show = (): void => {
    if (i >= qs.length) return finish();
    const q = qs[i]!;
    const opts = shuffle([q, ...shuffle(ALL_KANA.filter((k) => k.script === q.script && k.romaji !== q.romaji)).slice(0, 3)]);
    let locked = false;
    const buttons = opts.map((o) => {
      const b = h('button', { class: 'choice text' }, o.romaji);
      b.addEventListener('click', async () => {
        if (locked) return;
        locked = true;
        const ok = o.romaji === q.romaji;
        if (ok) right[q.script]++;
        b.classList.add(ok ? 'right' : 'wrong');
        (ok ? sfx.correct : sfx.wrong)();
        await sleep(400);
        i++;
        show();
      });
      return b;
    });
    root.replaceChildren(
      h('div', { class: 'row' }, h('button', { class: 'btn ghost small', 'aria-label': 'Leave the placement test', onClick: () => app.go(app.store.data.started ? 'map' : 'welcome') }, '✕'), h('strong', null, `Placement ${i + 1}/${qs.length}`)),
      h('div', { class: 'prompt' }, h('div', { class: 'prompt-jp jp' }, q.char)),
      h('p', { class: 'hint' }, 'Not sure? Just guess — this only decides where you start.'),
      h('div', { class: 'choices' }, buttons),
    );
  };
  show();
  return { el: root };
}
