import type { App, Screen } from '../ui/app';
import { h, ruby, sleep } from '../ui/dom';
import { ALL_KANA } from '../data/kana';
import { STOPS } from '../data/journey';
import { sfx } from '../core/audio';
import { catSvg } from '../ui/cat';
import { review } from '../core/srs';
import { checkAchievements } from '../core/progress';
import { currentStopIndex } from '../core/curriculum';
import type { Store } from '../core/store';
import {
  KANA_PASS,
  KANA_QUESTIONS,
  TIERS,
  TIER_PASS,
  TIER_QUESTIONS,
  blockVerdict,
  kanaQuestions,
  placedLevel,
  startIndexFor,
  tierQuestions,
  type Area,
  type PlacedLevel,
  type Question,
  type Showing,
} from '../core/placement';

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

interface Block {
  area: Area;
  questions: Question[];
  pass: number;
}

interface Score {
  area: Area;
  right: number;
  /** how many were asked: a level ends as soon as it is decided */
  asked: number;
  passed: boolean;
}

const SUMMARY: Record<PlacedLevel, string> = {
  none: 'Let’s start from the very beginning — hiragana first.',
  hiragana: 'You read hiragana. Katakana comes next.',
  kana: 'You read hiragana and katakana. Time for your first words and grammar (N5).',
  N5: 'You handle N5 words and grammar. Next up is N4.',
  N4: 'You handle N4 words and grammar. Next up is N3.',
  N3: 'You handle N3 words and grammar. Next up is N2.',
  N2: 'You handle N2 words and grammar. Next up is N1.',
  N1: 'You handled every level we check, including N1. Start at the N1 stops and test yourself.',
};

/**
 * Placement test: reading kana first, then vocabulary, grammar and kanji at each level from N5 up.
 * It stops at the first level that turns out too hard.
 */
export function placementScreen(app: App): Screen {
  const root = h('div', { class: 'screen placement' });
  const furi = app.store.data.settings.furigana;
  const show: Showing = { hiragana: false, katakana: false, tiers: [] };
  const scores: Score[] = [];
  let stopped = false;

  const leave = (): void => app.go(app.store.data.started ? 'map' : 'welcome');
  const closeBtn = h('button', { class: 'btn ghost small', 'aria-label': 'Leave the placement test', onClick: leave }, '✕');

  const nextBlock = (): Block | null => {
    if (stopped) return null;
    if (!scores.some((s) => s.area === 'Hiragana')) return { area: 'Hiragana', questions: kanaQuestions('hiragana'), pass: KANA_PASS };
    if (!show.hiragana) return null;
    if (!scores.some((s) => s.area === 'Katakana')) return { area: 'Katakana', questions: kanaQuestions('katakana'), pass: KANA_PASS };
    if (!show.katakana) return null;
    const tier = TIERS[show.tiers.length];
    return tier ? { area: tier, questions: tierQuestions(tier), pass: TIER_PASS } : null;
  };

  const record = (block: Block, right: number, asked: number, passed: boolean): void => {
    scores.push({ area: block.area, right, asked, passed });
    if (block.area === 'Hiragana') show.hiragana = passed;
    else if (block.area === 'Katakana') show.katakana = passed;
    else if (passed) show.tiers.push(block.area);
    if (!passed) stopped = true;
  };

  const finish = (): void => {
    const started = app.store.data.started;
    const level = placedLevel(show);
    const start = startIndexFor(level);
    // taking the test again later never moves you back
    const ahead = start > currentStopIndex(app.store.data);
    root.replaceChildren(
      h(
        'div',
        { class: 'results' },
        h('h2', null, 'Placement result'),
        h('div', { class: 'result-cat' }, catSvg(app.store.data.look, ahead ? 'wow' : 'happy', 120)),
        h('ul', { class: 'placement-scores' }, scores.map((s) => h('li', null, `${s.passed ? '✅' : '▫️'} ${s.area} · ${s.right} of ${s.asked} right`))),
        h('p', null, SUMMARY[level]),
        h(
          'p',
          null,
          ahead
            ? `You can start at ${STOPS[start]!.name} ${STOPS[start]!.emoji}. Earlier stops stay open for review.`
            : !started
              ? 'Tokyo is the place to begin.'
              : start === 0
                ? 'Nothing to skip yet. Your progress stays as it is.'
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

  const runBlock = (block: Block): void => {
    let i = 0;
    let right = 0;
    let wrong = 0;
    const ask = (): void => {
      const q = block.questions[i]!;
      let locked = false;
      const answered = async (picked: number | null): Promise<void> => {
        if (locked) return;
        locked = true;
        const ok = picked === q.answer;
        if (ok) right++;
        else wrong++;
        buttons.forEach((b, n) => {
          if (n === q.answer) b.classList.add('right');
          else if (n === picked) b.classList.add('wrong');
        });
        (ok ? sfx.correct : sfx.wrong)();
        if (q.note && !ok) note.textContent = q.note;
        await sleep(ok ? 450 : q.note ? 1300 : 700);
        if (!root.isConnected) return;
        i++;
        const verdict = blockVerdict(right, wrong, block.questions.length, block.pass);
        if (verdict || i >= block.questions.length) {
          record(block, right, right + wrong, verdict === 'pass' || right >= block.pass);
          const next = nextBlock();
          return next ? runBlock(next) : finish();
        }
        ask();
      };
      const buttons = q.choices.map((c, n) => {
        const b = h('button', { class: 'choice text' }, c);
        b.addEventListener('click', () => void answered(n));
        return b;
      });
      const note = h('p', { class: 'hint', 'aria-live': 'polite' });
      root.replaceChildren(
        h('div', { class: 'row' }, closeBtn, h('strong', null, `${block.area} · ${i + 1}/${block.questions.length}`)),
        h('p', { class: 'hint' }, q.ask),
        h('div', { class: 'prompt' }, h('div', { class: `prompt-jp jp ${q.kind === 'grammar' || q.kind === 'particle' ? 'prompt-sentence' : ''}` }, q.markup ? ruby(q.prompt, furi) : q.prompt)),
        h('div', { class: 'choices' }, buttons),
        h('button', { class: 'btn ghost small', onClick: () => void answered(null) }, 'I’m not sure'),
        note,
      );
    };
    ask();
  };

  root.replaceChildren(
    h('div', { class: 'row' }, closeBtn, h('strong', null, 'Placement test')),
    h('div', { class: 'result-cat' }, catSvg(app.store.data.look, 'smile', 110)),
    h('p', null, `This starts easy and gets harder. First you read hiragana and katakana. Then, level by level from N5, you answer a few questions on vocabulary, grammar and kanji. It stops when a level gets too hard. About ${KANA_QUESTIONS * 2 + TIER_QUESTIONS} to ${KANA_QUESTIONS * 2 + TIER_QUESTIONS * TIERS.length} questions.`),
    h('p', { class: 'hint' }, 'Not sure? Tap “I’m not sure” instead of guessing — it only decides where you start.'),
    h('button', { class: 'btn primary big', onClick: () => runBlock(nextBlock()!) }, 'Start'),
  );
  return { el: root };
}
