# Catakana 🐱🗾

Learn Japanese with cats! Play a travelling cat exploring Japan — learn hiragana, katakana, then words, kanji and
more, from complete beginner up to JLPT N1 — through repeatable cat-themed minigames.

- Runs entirely in the browser (TypeScript + Vite), installable as a PWA and fully offline.
- Mobile-first: works on phones, tablets and desktop.
- Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

## For families and shared devices

- **Young learner mode** (welcome screen or Settings) is the same game with calmer rules: no game-over, bigger
  buttons and text, kana help always on, smaller daily quests, a break reminder every 20 minutes, and a grown-up
  sum before backups, restoring, erasing, adding or removing players, or switching the mode off.
- **Players**: up to six players per device, each with their own cat, progress and settings. The app asks who is
  playing when it opens. Add, switch and remove players in Settings.
- **Larger text and buttons** is a separate setting for anyone who wants the roomier layout.
- **Privacy**: no accounts and no tracking. Progress is stored only in the browser on the device. “Export” saves a
  backup file (“Export everyone” saves all players). Importing a single backup replaces the current player's
  progress; importing an “everyone” file adds those players as new ones without changing anyone already there.
- Speaking games that listen use the browser's speech recognition, which many browsers send to an online
  service. Young learner mode turns that off.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173/catakana/
npm run check      # typecheck + lint + tests
npm run build      # production build into dist/
```

Pushes to `main` build and deploy to the `gh-pages` branch (GitHub Pages).

## Credits

- Stroke-order data: [KanjiVG](https://kanjivg.tagaini.net) © Ulrich Apel, licensed
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). The derived file
  `src/data/strokes.json` is distributed under the same license (regenerate with `scripts/fetch-strokes.mjs`).
