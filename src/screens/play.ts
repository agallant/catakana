import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { STOP_BY_ID, STOPS } from '../data/journey';
import { GAME_BY_ID } from '../games';
import type { GameContext, Item, Level, Summary } from '../games/types';
import { focusForStop, poolForStop, withKnownKanji } from '../core/items';
import { catSvg } from '../ui/cat';
import { sfx } from '../core/audio';
import { collectCat } from '../core/cats';
import { romajiHints } from '../core/romaji';
import { track } from '../core/progress';

export function rewards(summary: Summary, level: Level): { stars: 0 | 1 | 2 | 3; fish: number; xp: number } {
  const pct = summary.total ? summary.correct / summary.total : 0;
  const stars = pct >= 0.95 ? 3 : pct >= 0.8 ? 2 : pct >= 0.6 ? 1 : 0;
  const mult = 1 + (level - 1) * 0.5;
  return {
    stars,
    fish: Math.round((summary.correct * 2 + stars * 5) * mult),
    xp: Math.round((summary.correct * 5 + summary.total + stars * 10) * mult),
  };
}

/** Runs a minigame then shows rewards. params: stopId, gameId, level; stop may be "any" for free practice. */
export function playScreen(app: App, params: string[]): Screen {
  const stopId = params[0] ?? 'tokyo';
  const gameId = params[1] ?? 'sushi';
  const level = (Math.min(3, Math.max(1, Number(params[2] ?? 1))) || 1) as Level;
  const game = GAME_BY_ID.get(gameId) ?? GAME_BY_ID.get('sushi')!;
  const stop = STOP_BY_ID.get(stopId) ?? STOPS[0]!;
  const stopIndex = STOPS.indexOf(stop);
  const review = params[3] === 'review';
  const home = review ? 'dojo' : `stop/${stop.id}`;
  const root = h('div', { class: 'screen play' });
  // Practice what has been introduced in lessons; fall back to everything if that's too little.
  const known = new Set(app.store.data.introduced);
  const onlyKnown = (items: Item[]): Item[] => {
    const k = items.filter((i) => i.kind === 'kana' || known.has(i.id));
    return k.length >= 4 ? k : items;
  };
  const kanjify = (items: Item[]): Item[] => items.map((i) => withKnownKanji(i, known));
  const wide = kanjify(poolForStop(stopIndex));
  const pool = onlyKnown(wide);
  const started = Date.now();

  const ctx: GameContext = {
    root,
    store: app.store,
    stop,
    stopIndex,
    level,
    hints: romajiHints(app.store.data, stopIndex),
    pool,
    wide,
    focus: review ? pool : onlyKnown(kanjify(focusForStop(stopIndex))),
    quit: () => app.go(home),
    finish(summary) {
      const r = rewards(summary, level);
      app.store.markPlayed();
      app.store.update((d) => {
        d.stats.rounds++;
        d.stats.playMs += Date.now() - started;
      });
      const before = app.store.data.stops[stop.id] ?? 0;
      if (r.stars > 0) app.store.setStars(stop.id, r.stars);
      app.store.addRewards(r.fish, r.xp);
      const newCat = r.stars >= 1 ? collectCat(app.store, stop.id, r.stars === 3) : null;
      track(app.store, { type: 'answers', correct: summary.correct });
      track(app.store, { type: 'game', game: game.id, skill: game.skill, correct: summary.correct, total: summary.total, stars: r.stars });
      (r.stars ? sfx.win : sfx.wrong)();
      const unlocked = before < 1 && r.stars >= 1 && stopIndex < STOPS.length - 1;
      root.replaceChildren(
        h(
          'div',
          { class: 'results' },
          h('h2', null, r.stars ? 'Stage clear!' : 'Keep practicing!'),
          h('div', { class: 'stars huge' }, '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars)),
          h('div', { class: 'result-cat' }, catSvg(app.store.data.look, r.stars ? 'wow' : 'sad', 130)),
          h('p', null, `${summary.correct} / ${summary.total} correct`),
          h('div', { class: 'reward-row' }, h('span', null, `🐟 +${r.fish}`), h('span', null, `⭐ +${r.xp} XP`)),
          newCat ? h('div', { class: 'callout' }, h('div', { class: 'result-cat' }, catSvg(newCat.look, 'happy', 90)), h('p', null, `${newCat.name} the cat joined your collection!`)) : null,
          unlocked ? h('div', { class: 'callout' }, `🔓 ${STOPS[stopIndex + 1]!.name} unlocked!`) : null,
          h(
            'div',
            { class: 'row' },
            h('button', { class: 'btn primary', onClick: () => app.go(`play/${stop.id}/${game.id}/${level}${review ? '/review' : ''}`) }, '↻ Again'),
            h('button', { class: 'btn ghost', onClick: () => app.go(home) }, review ? 'Back to practice' : 'Back to stop'),
          ),
          level < 3 && r.stars >= 2 ? h('button', { class: 'btn ghost', onClick: () => app.go(`play/${stop.id}/${game.id}/${level + 1}${review ? '/review' : ''}`) }, `Try harder level ${level + 1} →`) : null,
        ),
      );
    },
  };
  if (ctx.pool.length < 3) {
    root.appendChild(h('p', null, 'Nothing to practice yet!'));
  } else {
    game.start(ctx);
  }
  return { el: root };
}
