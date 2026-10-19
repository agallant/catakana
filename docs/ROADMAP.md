# Catakana roadmap

North star: a fun, addictive, cat-filled game that really teaches Japanese. You play a travelling cat; each
stop in Japan teaches language *and* culture, and repeatable minigames provide replay value and difficulty.

Romaji is training wheels only: shown as hints for the first few stops, then replaced by kana, meaning and sound.

Skill priority: **reading → writing → listening → speaking**. Scripts: hiragana → katakana → furigana → kanji.
Tiers: Kana → N5 → N4 → N3 → N2 → N1. Everything runs client-side, offline (PWA), deployed to GitHub Pages.

## Milestones (each is one PR)

| # | Milestone | Status |
|---|-----------|--------|
| M1 | **Foundations** – PWA scaffold, CI/CodeQL/deploy, journey map (20 stops), complete hiragana + katakana curriculum, SRS, 6 minigames (Sushi Belt, Neko Pairs, Paw Painting tracing, Whisker Ears listening, Yarn Words, Keyboard Cat), cat customisation & collection, ~150 starter words | ✅ done (#2) |
| M2 | **Japan & travel** – Explore screen per stop (landmarks with furigana names, omiyage souvenir shop), tour-guide trivia quiz with spaced review of earlier stops, eki-stamp passport, train arrival announcements (まもなく…), "Station Signs" reading/listening game, romaji fades out after the first stops (meanings and kana instead), batched lessons, better mnemonics, scheduled Pages deploy | in progress |
| M2.5 | **Reading depth** – dakuten/combo look-alike drills, daily review quests, streak rewards, achievements, accessibility pass | planned |
| M3 | **N5 Grand Tour, part 1** – 12 new destinations (Hakodate → Yakushima) each with a grammar point (は/です, これ/の, adjectives, ます, を, に/へ, numbers & time, で, あります/います, past & negative, たい, てください), ~230 N5 words (kanji forms stored for M4), 60 example sentences, Word Train sentence-building game (reading → listening at hard), word book | in progress |
| M3.5 | **N5 Grand Tour, part 2** – remaining N5 vocabulary (~400 more words), counters, adverbs, conjunctions, more grammar (から/まで, ～ましょう, ～ている), new destinations | planned |
| M4.5 | **Castles, World Heritage & Neko Market** – photograph castles and UNESCO sites in Explore (passport collectibles), Neko Market selling 25 traditional foods and 17 treasures (some regional), trophy shelves in the passport | in progress |
| M4 | **Kanji & stroke order** – KanjiVG stroke data for all kana + 109 N5 kanji; Paw Painting checks stroke order and direction (hints → from memory); kanji cards with animated stroke order, on/kun readings and example words; words switch to kanji with furigana once their kanji are learned; kanji chart | in progress |
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
- Japanese speech uses the device's `speechSynthesis`; devices without a Japanese voice get a notice (audio packs in M5).
