import type { App, Screen } from '../ui/app';
import { getLevel, getPref, setPref } from '../core/prefs';
import { h } from '../ui/dom';
import { ALL_KANA, KANA_GROUPS, type Script } from '../data/kana';
import { currentStopIndex, learnedKanaThrough, wordsThrough } from '../core/curriculum';
import { kanjiThrough } from '../core/items';
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
  type Tab = Script | 'words' | 'kanji';
  let script: Tab = (getPref('script') as Tab | null) || 'hiragana';
  const chart = h('div', { class: 'chart' });
  const drawWords = (): void => {
    const words = wordsThrough(idx);
    chart.replaceChildren(
      h('p', { class: 'hint' }, `${words.length} words so far`),
      h(
        'div',
        { class: 'wordbook' },
        words.map((w) => {
          const m = mastery(d.srs[w.id]);
          const row = h(
            'button',
            { class: 'word-row', style: `--m:${m}` },
            h('span', { class: 'word-emoji' }, w.emoji),
            h('span', { class: 'jp word-jp' }, w.jp, w.kanji ? h('small', { class: 'kanji-peek' }, ` ${w.kanji}`) : null),
            h('span', { class: 'word-en' }, w.en),
          );
          row.addEventListener('click', () => void speak(w.reading));
          return row;
        }),
      ),
    );
  };
  const drawKanji = (): void => {
    const ks = kanjiThrough(idx);
    chart.replaceChildren(
      ks.length
        ? h(
            'div',
            { class: 'chart-row' },
            ks.map((k) => {
              const m = mastery(d.srs[`kj:${k.char}`]);
              const cell = h('button', { class: 'kcell', style: `--m:${m}`, 'aria-label': `${k.char} ${k.meaning}` }, h('span', { class: 'jp kc' }, k.char), h('span', { class: 'kr' }, k.meaning.split(' ')[0]!));
              cell.addEventListener('click', () => void speak(k.kun[0]?.replace(/\(.*\)/, '') || k.on[0] || k.char));
              return cell;
            }),
          )
        : h('p', { class: 'hint' }, 'Kanji start on the N5 Grand Tour (after Sapporo).'),
    );
  };
  const draw = (): void => {
    if (script === 'words') return drawWords();
    if (script === 'kanji') return drawKanji();
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
  const tab = (s: Tab, label: string) =>
    h('button', { class: `chip ${script === s ? 'on' : ''}`, onClick: () => { script = s; setPref('script', s); app.render(); } }, label);

  const level = getLevel();
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
    h('h3', null, 'Kana chart & word book'),
    h('div', { class: 'chips' }, tab('hiragana', 'ひらがな'), tab('katakana', 'カタカナ'), tab('kanji', '漢字'), tab('words', '📒 Words')),
    h('p', { class: 'hint' }, 'Tap a character to hear it. Brighter = more mastered. Dashed = ready for review.'),
    chart,
  );
  return { el };
}
