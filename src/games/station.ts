import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { recordAnswer, shell, startingLives } from './common';
import { shuffle } from '../core/srs';
import { STOPS } from '../data/journey';
import { kanaToRomaji } from '../data/kana';
import { kanaTokens, learnedKanaThrough } from '../core/curriculum';

/** Station names readable with the kana learned by stop `index`. */
export function readableStations(index: number): Item[] {
  const learned = learnedKanaThrough(index);
  return STOPS.filter((s) => {
    const t = kanaTokens(s.reading);
    return t !== null && t.every((x) => x.startsWith('mark:') || learned.has(x));
  }).map((s) => ({ id: `st:${s.id}`, kind: 'word' as const, text: s.reading, reading: s.reading, romaji: kanaToRomaji(s.reading), en: s.name, emoji: s.emoji, script: 'hiragana' as const }));
}

const MIN_STATIONS = 4;

const KANJI_TIERS = new Set(['N4', 'N3', 'N2', 'N1']);

/** From N4, level 2 shows the sign in kanji only: read the place name and pick its kana. */
export function kanjiSignMode(stopIndex: number, level: number): boolean {
  return level === 2 && KANJI_TIERS.has(STOPS[stopIndex]?.tier ?? '');
}

/** Read the platform sign and figure out where the train has stopped. */
export const stationGame: GameDef = {
  id: 'station',
  name: 'Station Signs',
  jp: 'えきのかんばん',
  emoji: '🚉',
  blurb: 'Read the platform sign — which station is this?',
  kinds: ['word'],
  skill: 'reading',
  available: (stopIndex) => stopIndex === undefined || readableStations(stopIndex).length >= MIN_STATIONS,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Station Signs 🚉');
    const stations = readableStations(ctx.stopIndex);
    if (stations.length < MIN_STATIONS) return ctx.quit();
    const rounds = shuffle(stations.concat(shuffle(stations))).slice(0, 8);
    let idx = 0;
    let correct = 0;
    let lives = startingLives(ctx.store.data.settings);
    sh.setLives(lives);
    const next = async (): Promise<void> => {
      if (idx >= rounds.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const st = rounds[idx]!;
      const listening = ctx.level === 3;
      const kanjiSign = kanjiSignMode(ctx.stopIndex, ctx.level);
      const stopIdx = STOPS.findIndex((s) => `st:${s.id}` === st.id);
      const neighbour = (i: number): string => (kanjiSign ? STOPS[i]?.jp : STOPS[i]?.reading) ?? '';
      const prev = neighbour(stopIdx - 1);
      const nxt = neighbour(stopIdx + 1);
      const choices = shuffle([st, ...shuffle(stations.filter((s) => s.id !== st.id)).slice(0, ctx.level === 1 ? 2 : 3)]);
      let locked = false;
      const announce = `つぎは、${st.reading}。${st.reading}です。`;
      const sign = h(
        'div',
        { class: 'sign' },
        h('div', { class: 'sign-main jp' }, listening ? '？？？' : kanjiSign ? STOPS[stopIdx]!.jp : st.text),
        h('div', { class: 'sign-sub' }, kanjiSign ? ' ' : ctx.hints && !listening ? st.romaji.toUpperCase() : STOPS[stopIdx]!.jp),
        h('div', { class: 'sign-bar jp' }, h('span', null, prev ? `← ${prev}` : ''), h('span', null, nxt ? `${nxt} →` : '')),
      );
      const buttons = choices.map((c) => {
        const kana = listening || kanjiSign;
        const b = h('button', { class: `choice text ${kana ? 'jp' : ''}` }, kana ? c.text : `${c.emoji} ${c.en}`);
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          const ok = c.id === st.id;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) buttons[choices.indexOf(st)]!.classList.add('right');
          recordAnswer(ctx, st, ok, sh);
          if (ok) correct++;
          else {
            lives--;
            sh.setLives(lives);
          }
          await sleep(ok ? 800 : 1600);
          idx++;
          void next();
        });
        return b;
      });
      sh.body.replaceChildren(
        h('div', { class: 'announce', role: 'note' }, listening ? '🔊 Listen to the announcement' : kanjiSign ? '🚃 A kanji sign! How do you read this station?' : '🚃 The train stops. Which station is it?'),
        sign,
        h('button', { class: 'btn small ghost', onClick: () => void speak(announce) }, '🔊 Announcement'),
        h('div', { class: 'choices one-col' }, buttons),
      );
      if (listening) void speak(announce);
    };
    sh.say(ctx.level === 3 ? 'Listen for the station name!' : 'Read the big sign!', 'think');
    void next();
  },
};
