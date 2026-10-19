import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { ALL_KANA, KANA_GROUPS, type Script } from '../data/kana';
import { currentStopIndex, learnedKanaThrough } from '../core/curriculum';
import { GAMES } from '../games';
import { speak } from '../core/audio';
import { mastery, isDue } from '../core/srs';
import { STOPS } from '../data/journey';

/** Free practice hub + kana chart with mastery heat. */
export function dojoScreen(app: App): Screen {
  const d = app.store.data;
  const idx = currentStopIndex(d);
  const learned = learnedKanaThrough(idx);
  // include stops visited but whose group is ahead of unlocked? Only learned kana are practicable.
  let script: Script = (sessionStorage.getItem('catakana.script') as Script) || 'hiragana';
  const chart = h('div', { class: 'chart' });
  const draw = (): void => {
    chart.replaceChildren(
      ...KANA_GROUPS.map((g) => {
        const chars = ALL_KANA.filter((k) => k.script === script && k.group === `${script === 'hiragana' ? 'h' : 'k'}-${g.id}`);
        return h(
          'div',
          { class: 'chart-group' },
          h('div', { class: 'chart-name' }, g.name),
          h(
            'div',
            { class: 'chart-row' },
            chars.map((k) => {
              const known = learned.has(k.id);
              const rec = d.srs[k.id];
              const m = mastery(rec);
              const cell = h(
                'button',
                { class: `kcell ${known ? '' : 'unknown'} ${known && rec && isDue(rec) ? 'due' : ''}`, style: known ? `--m:${m}` : '', 'aria-label': `${k.char} ${k.romaji}`, disabled: !known },
                h('span', { class: 'jp kc' }, k.char),
                h('span', { class: 'kr' }, k.romaji),
              );
              cell.addEventListener('click', () => void speak(k.char));
              return cell;
            }),
          ),
        );
      }),
    );
  };
  draw();
  const tab = (s: Script, label: string) =>
    h('button', { class: `chip ${script === s ? 'on' : ''}`, onClick: () => { script = s; sessionStorage.setItem('catakana.script', s); app.render(); } }, label);

  const level = Number(sessionStorage.getItem('catakana.level') ?? '1') as 1 | 2 | 3;
  const stop = STOPS[idx]!;
  const dueCount = [...learned].filter((id) => isDue(d.srs[id]) && d.srs[id]).length;

  const el = h(
    'div',
    { class: 'screen dojo' },
    h('h2', null, '🐾 Practice dojo'),
    h('p', { class: 'hint' }, dueCount ? `${dueCount} characters are ready for review.` : 'Pick a game to review everything you have learned so far.'),
    h('div', { class: 'game-list' }, GAMES.filter((g) => g.available?.(idx) ?? true).map((g) =>
      h('button', { class: 'game-card', onClick: () => app.go(`play/${stop.id}/${g.id}/${level}/review`) }, h('span', { class: 'game-emoji' }, g.emoji), h('span', { class: 'game-info' }, h('strong', null, g.name), h('small', null, g.blurb)), h('span', { class: `skill skill-${g.skill}` }, g.skill)),
    )),
    h('h3', null, 'Kana chart'),
    h('div', { class: 'chips' }, tab('hiragana', 'ひらがな'), tab('katakana', 'カタカナ')),
    h('p', { class: 'hint' }, 'Tap a character to hear it. Brighter = more mastered. Dashed = ready for review.'),
    chart,
  );
  return { el };
}
