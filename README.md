# Catakana 🐱🗾

Learn Japanese with cats! Play a travelling cat exploring Japan — learn hiragana, katakana, then words, kanji and
more, from complete beginner up to JLPT N1 — through repeatable cat-themed minigames.

- Runs entirely in the browser (TypeScript + Vite), installable as a PWA and fully offline.
- Mobile-first: works on phones, tablets and desktop.
- Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

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
