import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext } from './types';
import { recordAnswer, shell } from './common';
import { sample, shuffle } from '../core/srs';
import { STOPS } from '../data/journey';
import { romajiToHiragana } from '../data/kana';
import {
  DURATION_KANJI,
  DURATION_MAX,
  DURATION_UNITS,
  type DurationUnit,
  dayDistractors,
  dayReadings,
  durationDistractors,
  durationReadings,
  monthDistractors,
  monthReading,
  timeDistractors,
  timeReadings,
} from '../data/time';

/** Clock times arrive at Kanazawa, calendar dates at Kobe (both N5). */
export const TIME_FROM = 'kanazawa';
export const DATE_FROM = 'kobe';
/** How-long durations (～時間, ～週間, ～か月, ～年) arrive with N4 at Hikone. */
export const DURATION_FROM = 'hikone';

const reached = (id: string, stopIndex: number): boolean => {
  const at = STOPS.findIndex((s) => s.id === id);
  return at >= 0 && at <= stopIndex;
};

const TRAINS = ['🚄 のぞみ', '🚄 はやぶさ', '🚃 ふつう', '🚅 こまち', '🚌 バス', '⛴️ フェリー'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Puzzle {
  id: string;
  /** what is shown on the board or calendar */
  card: HTMLElement;
  hint: string;
  answers: string[];
  wrongs: string[];
}

/** A departure board: on the hour or half past at level 1, any minute later. */
function timePuzzle(level: number): Puzzle {
  const hr = 1 + Math.floor(Math.random() * 12);
  const minutes = level === 1 ? [0, 30] : [0, 1, 3, 5, 6, 8, 10, 15, 20, 30, 40, 45, sample([11, 13, 16, 18, 24, 33, 47, 56])];
  const m = sample(minutes);
  const shown = `${hr}:${String(m).padStart(2, '0')}`;
  const card = h('div', { class: 'depart-board', 'aria-label': `departs at ${shown}` }, h('span', { class: 'depart-train jp' }, sample(TRAINS)), h('span', { class: 'depart-time' }, shown));
  return { id: `time:${hr}:${m}`, card, hint: 'What time does it leave?', answers: timeReadings(hr, m), wrongs: timeDistractors(hr, m) };
}

/** A calendar page: days 1–10 at level 1, the irregular dates (14, 20, 24…) later. */
function datePuzzle(level: number): Puzzle {
  const mo = 1 + Math.floor(Math.random() * 12);
  const d = level === 1 ? 1 + Math.floor(Math.random() * 10) : sample([...Array.from({ length: 10 }, (_, i) => i + 1), 14, 17, 19, 20, 24, 1 + Math.floor(Math.random() * 31)]);
  const day = Math.min(d, mo === 2 ? 28 : 30);
  const month = monthReading(mo);
  const days = dayReadings(day);
  // half the traps are in the month, half in the day
  const wrongs = shuffle([...monthDistractors(mo).slice(0, 2).map((x) => x + days[0]), ...dayDistractors(day).slice(0, 3).map((x) => month + x)]);
  const card = h('div', { class: 'calendar-card', 'aria-label': `${MONTHS_EN[mo - 1]} ${day}` }, h('div', { class: 'cal-month jp' }, `${mo}月`), h('div', { class: 'cal-day jp' }, `${day}日`));
  return { id: `date:${mo}:${day}`, card, hint: level === 1 ? `${MONTHS_EN[mo - 1]} ${day} — how do you say it?` : 'How do you say this date?', answers: days.map((x) => month + x), wrongs };
}

/** “1 hour”, “3 weeks”: the duration in English, singular for one. */
export function durationEnglish(unit: DurationUnit, n: number): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}
const DURATION_EMOJI: Record<string, string> = { hour: '⏱️', week: '🗓️', month: '🌙', year: '🎍' };

/** A “how long?” card: hours and months at level 1, weeks and years too from level 2. */
function durationPuzzle(level: number): Puzzle {
  // level 1 sticks to hours and months; the tricky っ forms come at all levels
  const unit = level === 1 ? sample(['hour', 'month'] as const) : sample(DURATION_UNITS);
  const n = sample([1, 3, 4, 6, 8, 10, 1 + Math.floor(Math.random() * DURATION_MAX[unit]), ...(unit === 'hour' ? [7, 9] : [])]);
  const shown = `${n}${DURATION_KANJI[unit]}`;
  const card = h('div', { class: 'calendar-card', 'aria-label': durationEnglish(unit, n) }, h('div', { class: 'cal-month' }, DURATION_EMOJI[unit]!), h('div', { class: 'cal-day jp' }, shown));
  return { id: `dur:${unit}:${n}`, card, hint: level === 1 ? `${durationEnglish(unit, n)} — how long is the trip?` : 'How long? Say the duration.', answers: durationReadings(unit, n), wrongs: durationDistractors(unit, n) };
}

export type PuzzleKind = 'time' | 'date' | 'duration';
const PUZZLES: Record<PuzzleKind, (level: number) => Puzzle> = { time: timePuzzle, date: datePuzzle, duration: durationPuzzle };

/** The puzzle kinds unlocked by this stop, in the order rounds rotate through them. */
export function puzzleKinds(stopIndex: number): PuzzleKind[] {
  const kinds: PuzzleKind[] = ['time'];
  if (reached(DATE_FROM, stopIndex)) kinds.push('date');
  if (reached(DURATION_FROM, stopIndex)) kinds.push('duration');
  return kinds;
}

/** Timetable: read departure times and calendar dates out loud (よじ, くじ, いっぷん, ついたち, はつか…). */
export const timetableGame: GameDef = {
  id: 'timetable',
  name: 'Timetable',
  jp: 'じこくひょう',
  emoji: '🕰️',
  blurb: 'Read departure times, dates and durations: よじ, いっぷん, ついたち, ろっかげつ…',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || reached(TIME_FROM, stopIndex),
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Timetable 🕰️');
    if (!reached(TIME_FROM, ctx.stopIndex)) return ctx.quit();
    const kinds = puzzleKinds(ctx.stopIndex);
    const ROUNDS = 8;
    let idx = 0;
    let correct = 0;
    let lives = 3;
    sh.setLives(lives);

    const next = (): void => {
      if (idx >= ROUNDS || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: ROUNDS });
      }
      sh.setProgress(idx, ROUNDS);
      const p = PUZZLES[kinds[idx % kinds.length]!](ctx.level);
      const main = p.answers[0]!;
      let locked = false;
      const reveal = h('div', { class: 'type-preview jp' }, ' ');
      const done = async (ok: boolean): Promise<void> => {
        locked = true;
        recordAnswer(ctx, { id: p.id, kind: 'word', text: main, reading: main, romaji: '' }, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        reveal.textContent = p.answers.join(' / ');
        void speak(main);
        await sleep(ok ? 1000 : 2200);
        idx++;
        next();
      };
      const prompt = h('div', { class: 'prompt' }, p.card, h('div', { class: 'prompt-romaji' }, p.hint));
      if (ctx.level === 3) {
        const input = h('input', { class: 'type-input', type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Type it in romaji', placeholder: 'romaji, e.g. yoji juppun' });
        const preview = h('div', { class: 'type-preview jp' }, ' ');
        const clean = (v: string): string => romajiToHiragana(v.trim().toLowerCase().replace(/\s+/g, ''));
        input.addEventListener('input', () => (preview.textContent = clean(input.value)));
        const submit = (): void => {
          if (locked) return;
          void done(p.answers.includes(clean(input.value)));
        };
        input.addEventListener('keydown', (e) => (e as KeyboardEvent).key === 'Enter' && submit());
        sh.body.replaceChildren(prompt, preview, input, h('button', { class: 'btn primary', onClick: submit }, 'Say it ⏎'), reveal);
        input.focus();
      } else {
        const options = shuffle([main, ...shuffle(p.wrongs).slice(0, ctx.level === 1 ? 2 : 3)]);
        const buttons = options.map((o) => {
          const b = h('button', { class: 'choice text jp' }, o);
          b.addEventListener('click', () => {
            if (locked) return;
            const ok = p.answers.includes(o);
            b.classList.add(ok ? 'right' : 'wrong');
            if (!ok) buttons[options.indexOf(main)]!.classList.add('right');
            void done(ok);
          });
          return b;
        });
        sh.body.replaceChildren(prompt, h('div', { class: 'choices one-col' }, buttons), reveal);
      }
    };
    sh.say('All aboard! Read the board, nya.', 'think');
    next();
  },
};
