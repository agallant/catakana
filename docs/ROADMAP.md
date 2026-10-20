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
| M5 | **Listening & speaking** – Café Chat dialogue comprehension (16 conversations, read-along → audio-only), dictation in Keyboard Cat hard mode, Shadow Cat speaking practice (speech recognition scoring where available, record & compare / self-rating otherwise), 29-phrase survival phrasebook | in progress |
| M5.5 | **Audio depth** – Role Play scenes (konbini, ramen shop, train tickets, directions, ryokan check-in, pharmacy, sending luggage, minshuku, phone booking, job interview, apologising, Zen temple stay) where you choose or say the natural reply, with feedback on politeness and meaning; pre-generated audio packs for devices lacking a Japanese voice, pitch-accent hints | in progress |
| M6 | **Engagement** – daily quests, 24 achievements with toasts, placement test to skip known kana, better map | in progress |
| M7 | **N4 season** – 12 destinations (Hikone → Kawagoe) incl. National Treasure castles and UNESCO sites; 12 grammar points (ている, てもいい, たことがある, comparisons, たり, と思う, potential, なければ, から/ので, とき, たら, つもり); ~180 words, 118 N4 kanji with stroke data, 60 sentences, 9 conversations | in progress |
| M7.5 | **Verb Kitchen** – conjugation engine (godan/ichidan/irregular; ます/て/た/ない/potential/volitional) and drill game; progress export/import backup | in progress |
| M7.6 | **N4 depth** – Particle Pounce fill-the-gap particle game (43 sentences: は/を/に/で/が/と from Hakodate, だけ/しか/より/ほど/でも in N4, として/によって/にとって in N3, with the rule shown after each answer); Ryokan Manners keigo game (respectful vs humble verbs, unlocks at Kawagoe); adjective conjugation in Verb Kitchen (い/な: くない, かった, くなかった, くて, く/に and the classic きれくない / いくない traps); Cat Count counters game (つ, 人, 匹, 本, 枚, 個, 杯, 冊, 台 with いっぴき / さんぼん / ろっぱい sound changes, from Aomori); Timetable game for clock times and dates (よじ, くじ, いっぷん, ついたち, ようか, はつか, しがつ); 66 more N4 words across the 12 N4 stops (しまる, さわる, くらべる, すなはま, ゆうれい, うんてんする, よやく, におい, うまれる, ふぶき, けいかく…) | in progress |
| M8 | **N3 season** – 12 destinations (Inuyama → Iriomote) incl. the fifth National Treasure castle, Sado gold mines & Shiretoko (UNESCO), and the Iriomote wildcat; 12 grammar points (ようになる, ために, ように, そうだ, らしい, てしまう, ながら, はずだ, ても, passive, causative, ばかり); ~180 words, 119 N3 kanji with strokes, 60 sentences, 7 conversations | in progress |
| M8.5 | **N3 depth** – reading passages (Sado gold mine, Otaru glass), kanji compounds game, more N3 kanji (to ~370) | in progress |
| M9 | **N2 season** – 12 destinations (Hirosaki → Asakusa) incl. Hirosaki Castle, Gunkanjima & Hagi (Meiji Industrial heritage), Yoshino & Kumano Kodō (Kii UNESCO); 12 grammar points (わけだ, にとって, によって, に対して, ものの, ばかりか, に違いない, ことになる/ことにする, おかげで/せいで, かわりに, ようとする/ずに, ながらも/にもかかわらず); ~180 words, 132 more kanji with strokes, 60 sentences, 7 conversations | in progress |
| M9.5 | **N2 depth** – keigo set grows to 17 verbs (ご覧になる, 拝見する, 存じる, お目にかかる, 伺う, 差し上げる…), longer texts, more N2 kanji (to ~1000) | in progress |
| M10 | **N1 season** – 12 destinations (Ogasawara → Gōtoku-ji) incl. Ogasawara & Amami (UNESCO natural), Jōmon Sannai-Maruyama, Mozu kofun, Okinoshima, Hidden Christian sites, Nirayama furnace, Maruoka Castle; folklore (Tōno), Zen (Eihei-ji), Sekigahara and literary onsen towns; 12 formal grammar points, ~180 words, N1 kanji with strokes, 60 sentences, 7 conversations; finale with Maneki at the maneki-neko temple | in progress |
| M10.5 | **N1 depth** – literary and news-style reading (Tales of Tōno, Shiga Naoya at Kinosaki, Okinoshima and Amami news articles), more N1 kanji (to ~2000) | in progress |
| M10.6 | **Seasonal events** – real-calendar Japanese festivals (New Year, Setsubun, Hinamatsuri, hanami, Tanabata, Obon, tsukimi, momiji, Ōmisoka…) on the journey screen with limited-time market treats, a passport shelf and achievement | in progress |
| M11 | **Polish & depth** – Nyan Sounds onomatopoeia game (34 sound and feeling words from ニャー and ゴロゴロ to ドキドキ, ペラペラ and ねばねば: read → hear → use in a sentence), skill tabs (reading / writing / listening / speaking) on the game lists, 47-prefecture collection in the passport (44 on the route, plus day trips to Ibaraki, Chiba and Yamanashi), seasonal events, achievements, cloud-free progress export/import, more cats and outfits (bell collar, onsen towel, kanzashi, station master cap, sedge hat and yukata; cream, chocolate and ginger-spot coats), sound pass (station-style departure jingles, eki-stamp thump, achievement fanfare, streak chimes), i18n of UI | ongoing |

## Design principles
- Offline-first; no accounts, no tracking; progress lives in localStorage with export/import.
- Spaced repetition (Leitner boxes) drives which items appear in every minigame.
- Three difficulty levels per minigame so every stop is replayable.
- Mobile-first touch UI (phone and tablet), keyboard and mouse supported.
- Content is data (`src/data`), curriculum is derived (words become available once their kana are learned).

## Known limitations / ideas
- Japanese speech uses the device's `speechSynthesis`; devices without a Japanese voice get a notice (audio packs in M5).
