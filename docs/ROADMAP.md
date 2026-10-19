# Catakana roadmap

North star: a fun, addictive, cat-filled game that really teaches Japanese. You play a travelling cat; each
stop in Japan teaches language *and* culture, and repeatable minigames provide replay value and difficulty.

Skill priority: **reading → writing → listening → speaking**. Scripts: hiragana → katakana → furigana → kanji.
Tiers: Kana → N5 → N4 → N3 → N2 → N1. Everything runs client-side, offline (PWA), deployed to GitHub Pages.

## Milestones (each is one PR)

| # | Milestone | Status |
|---|-----------|--------|
| M1 | **Foundations** – PWA scaffold, CI/CodeQL/deploy, journey map (20 stops), complete hiragana + katakana curriculum, SRS, 6 minigames (Sushi Belt, Neko Pairs, Paw Painting tracing, Whisker Ears listening, Yarn Words, Keyboard Cat), cat customisation & collection, ~150 starter words | in progress |
| M2 | **Reading depth** – kana mnemonics review, dakuten/combo drills, "Station Signs" game (read real sign text), daily review quests, streak rewards, accessibility pass | planned |
| M3 | **N5 vocabulary & grammar** – full N5 word list, sentence builder (particles は/が/を/に/で), phrase book with furigana, "Sentence Sushi" ordering game, number/time/counters | planned |
| M4 | **Furigana & N5 kanji** – ruby text everywhere with always/tap/off modes, ~100 N5 kanji with readings and stroke-order animation (KanjiVG-derived data), kanji recognition and writing games | planned |
| M5 | **Listening** – dialogue comprehension scenes at each stop (train announcements, ordering food), speed control, dictation game, pre-generated audio packs for devices lacking a Japanese voice | planned |
| M6 | **Speaking** – pronunciation shadowing with microphone recording and playback comparison, optional SpeechRecognition scoring where supported, pitch-accent hints, role-play with local cats | planned |
| M7 | **N4** – ~300 more words, ~170 kanji, te-form/conjugation drills, new regions and stories | planned |
| M8 | **N3** – ~650 kanji, reading passages, grammar patterns, kanji compounds game | planned |
| M9 | **N2** – ~1000 kanji, longer texts, keigo introduction | planned |
| M10 | **N1** – ~2000 kanji, advanced vocab/grammar, literary and news-style reading | planned |
| M11 | **Polish & depth** – all 47 prefectures, seasonal events, achievements, cloud-free progress export/import, more cats and outfits, sound/music pass, i18n of UI | ongoing |

## Design principles
- Offline-first; no accounts, no tracking; progress lives in localStorage with export/import.
- Spaced repetition (Leitner boxes) drives which items appear in every minigame.
- Three difficulty levels per minigame so every stop is replayable.
- Mobile-first touch UI (phone and tablet), keyboard and mouse supported.
- Content is data (`src/data`), curriculum is derived (words become available once their kana are learned).

## Known limitations / ideas
- Tracing scores glyph coverage/accuracy but does not yet enforce stroke order (needs stroke data, M4).
- Japanese speech uses the device's `speechSynthesis`; devices without a Japanese voice get a notice (audio packs in M5).
