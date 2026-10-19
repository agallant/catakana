import { TOUR } from './tour';
import { kanaToRomaji } from './kana';

export type Tier = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface Word {
  id: string; // "w:<reading>:<en-slug>" stable
  /** Surface form as normally written (may include kanji). */
  jp: string;
  /** Kana reading (hiragana, or katakana for loanwords as written). */
  reading: string;
  romaji: string;
  en: string;
  emoji: string;
  tier: Tier;
  topic: Topic;
  /** True if the usual written form is all katakana. */
  katakana?: boolean;
  /** Usual written form with kanji (shown once kanji are introduced). */
  kanji?: string;
  /** For N5 Grand Tour words: the stop that teaches it. */
  stop?: string;
}

export type Topic =
  | 'greetings'
  | 'animals'
  | 'food'
  | 'numbers'
  | 'colors'
  | 'family'
  | 'travel'
  | 'nature'
  | 'body'
  | 'things'
  | 'verbs'
  | 'adjectives';

// [jp, reading, romaji, en, emoji, topic]
type Row = [string, string, string, string, string, Topic];

const N5_ROWS: Row[] = [
  // greetings (kept as words; phrases come later)
  ['はい', 'はい', 'hai', 'yes', '👍', 'greetings'],
  ['いいえ', 'いいえ', 'iie', 'no', '🙅', 'greetings'],
  ['ありがとう', 'ありがとう', 'arigatou', 'thank you', '🙏', 'greetings'],
  ['こんにちは', 'こんにちは', 'konnichiwa', 'hello', '👋', 'greetings'],
  ['おはよう', 'おはよう', 'ohayou', 'good morning', '🌅', 'greetings'],
  ['こんばんは', 'こんばんは', 'konbanwa', 'good evening', '🌆', 'greetings'],
  ['さようなら', 'さようなら', 'sayounara', 'goodbye', '🖐️', 'greetings'],
  ['すみません', 'すみません', 'sumimasen', 'excuse me', '🙇', 'greetings'],
  // animals
  ['ねこ', 'ねこ', 'neko', 'cat', '🐱', 'animals'],
  ['いぬ', 'いぬ', 'inu', 'dog', '🐶', 'animals'],
  ['さかな', 'さかな', 'sakana', 'fish', '🐟', 'animals'],
  ['とり', 'とり', 'tori', 'bird', '🐦', 'animals'],
  ['うま', 'うま', 'uma', 'horse', '🐴', 'animals'],
  ['うし', 'うし', 'ushi', 'cow', '🐮', 'animals'],
  ['くま', 'くま', 'kuma', 'bear', '🐻', 'animals'],
  ['さる', 'さる', 'saru', 'monkey', '🐒', 'animals'],
  ['かめ', 'かめ', 'kame', 'turtle', '🐢', 'animals'],
  ['かに', 'かに', 'kani', 'crab', '🦀', 'animals'],
  ['へび', 'へび', 'hebi', 'snake', '🐍', 'animals'],
  ['たぬき', 'たぬき', 'tanuki', 'raccoon dog', '🦝', 'animals'],
  // food
  ['すし', 'すし', 'sushi', 'sushi', '🍣', 'food'],
  ['ごはん', 'ごはん', 'gohan', 'rice / meal', '🍚', 'food'],
  ['みず', 'みず', 'mizu', 'water', '💧', 'food'],
  ['おちゃ', 'おちゃ', 'ocha', 'tea', '🍵', 'food'],
  ['たまご', 'たまご', 'tamago', 'egg', '🥚', 'food'],
  ['にく', 'にく', 'niku', 'meat', '🥩', 'food'],
  ['やさい', 'やさい', 'yasai', 'vegetables', '🥬', 'food'],
  ['くだもの', 'くだもの', 'kudamono', 'fruit', '🍎', 'food'],
  ['りんご', 'りんご', 'ringo', 'apple', '🍎', 'food'],
  ['みかん', 'みかん', 'mikan', 'mandarin orange', '🍊', 'food'],
  ['おかし', 'おかし', 'okashi', 'sweets', '🍬', 'food'],
  ['もち', 'もち', 'mochi', 'rice cake', '🍡', 'food'],
  ['うどん', 'うどん', 'udon', 'udon noodles', '🍜', 'food'],
  ['そば', 'そば', 'soba', 'soba noodles', '🍜', 'food'],
  ['ラーメン', 'ラーメン', 'raamen', 'ramen', '🍜', 'food'],
  ['パン', 'パン', 'pan', 'bread', '🍞', 'food'],
  ['ケーキ', 'ケーキ', 'keeki', 'cake', '🍰', 'food'],
  ['コーヒー', 'コーヒー', 'koohii', 'coffee', '☕', 'food'],
  ['ミルク', 'ミルク', 'miruku', 'milk', '🥛', 'food'],
  ['アイス', 'アイス', 'aisu', 'ice cream', '🍦', 'food'],
  // numbers
  ['いち', 'いち', 'ichi', 'one', '1️⃣', 'numbers'],
  ['に', 'に', 'ni', 'two', '2️⃣', 'numbers'],
  ['さん', 'さん', 'san', 'three', '3️⃣', 'numbers'],
  ['よん', 'よん', 'yon', 'four', '4️⃣', 'numbers'],
  ['ご', 'ご', 'go', 'five', '5️⃣', 'numbers'],
  ['ろく', 'ろく', 'roku', 'six', '6️⃣', 'numbers'],
  ['なな', 'なな', 'nana', 'seven', '7️⃣', 'numbers'],
  ['はち', 'はち', 'hachi', 'eight', '8️⃣', 'numbers'],
  ['きゅう', 'きゅう', 'kyuu', 'nine', '9️⃣', 'numbers'],
  ['じゅう', 'じゅう', 'juu', 'ten', '🔟', 'numbers'],
  // colors
  ['あか', 'あか', 'aka', 'red', '🟥', 'colors'],
  ['あお', 'あお', 'ao', 'blue', '🟦', 'colors'],
  ['きいろ', 'きいろ', 'kiiro', 'yellow', '🟨', 'colors'],
  ['みどり', 'みどり', 'midori', 'green', '🟩', 'colors'],
  ['しろ', 'しろ', 'shiro', 'white', '⬜', 'colors'],
  ['くろ', 'くろ', 'kuro', 'black', '⬛', 'colors'],
  ['ピンク', 'ピンク', 'pinku', 'pink', '🩷', 'colors'],
  // family
  ['おかあさん', 'おかあさん', 'okaasan', 'mother', '👩', 'family'],
  ['おとうさん', 'おとうさん', 'otousan', 'father', '👨', 'family'],
  ['おにいさん', 'おにいさん', 'oniisan', 'older brother', '👦', 'family'],
  ['おねえさん', 'おねえさん', 'oneesan', 'older sister', '👧', 'family'],
  ['あかちゃん', 'あかちゃん', 'akachan', 'baby', '👶', 'family'],
  ['ともだち', 'ともだち', 'tomodachi', 'friend', '🧑‍🤝‍🧑', 'family'],
  ['せんせい', 'せんせい', 'sensei', 'teacher', '🧑‍🏫', 'family'],
  // travel
  ['えき', 'えき', 'eki', 'station', '🚉', 'travel'],
  ['でんしゃ', 'でんしゃ', 'densha', 'train', '🚃', 'travel'],
  ['しんかんせん', 'しんかんせん', 'shinkansen', 'bullet train', '🚄', 'travel'],
  ['ひこうき', 'ひこうき', 'hikouki', 'airplane', '✈️', 'travel'],
  ['ふね', 'ふね', 'fune', 'ship', '🚢', 'travel'],
  ['くるま', 'くるま', 'kuruma', 'car', '🚗', 'travel'],
  ['じてんしゃ', 'じてんしゃ', 'jitensha', 'bicycle', '🚲', 'travel'],
  ['バス', 'バス', 'basu', 'bus', '🚌', 'travel'],
  ['タクシー', 'タクシー', 'takushii', 'taxi', '🚕', 'travel'],
  ['ホテル', 'ホテル', 'hoteru', 'hotel', '🏨', 'travel'],
  ['みち', 'みち', 'michi', 'road', '🛣️', 'travel'],
  ['まち', 'まち', 'machi', 'town', '🏘️', 'travel'],
  ['みせ', 'みせ', 'mise', 'shop', '🏪', 'travel'],
  ['がっこう', 'がっこう', 'gakkou', 'school', '🏫', 'travel'],
  ['おてら', 'おてら', 'otera', 'temple', '⛩️', 'travel'],
  ['おんせん', 'おんせん', 'onsen', 'hot spring', '♨️', 'travel'],
  ['トイレ', 'トイレ', 'toire', 'toilet', '🚻', 'travel'],
  ['きっぷ', 'きっぷ', 'kippu', 'ticket', '🎫', 'travel'],
  // nature
  ['やま', 'やま', 'yama', 'mountain', '🏔️', 'nature'],
  ['かわ', 'かわ', 'kawa', 'river', '🏞️', 'nature'],
  ['うみ', 'うみ', 'umi', 'sea', '🌊', 'nature'],
  ['そら', 'そら', 'sora', 'sky', '🌤️', 'nature'],
  ['あめ', 'あめ', 'ame', 'rain', '🌧️', 'nature'],
  ['ゆき', 'ゆき', 'yuki', 'snow', '❄️', 'nature'],
  ['はな', 'はな', 'hana', 'flower', '🌸', 'nature'],
  ['さくら', 'さくら', 'sakura', 'cherry blossom', '🌸', 'nature'],
  ['き', 'き', 'ki', 'tree', '🌳', 'nature'],
  ['つき', 'つき', 'tsuki', 'moon', '🌙', 'nature'],
  ['ほし', 'ほし', 'hoshi', 'star', '⭐', 'nature'],
  ['たいよう', 'たいよう', 'taiyou', 'sun', '☀️', 'nature'],
  // body
  ['あたま', 'あたま', 'atama', 'head', '🧠', 'body'],
  ['め', 'め', 'me', 'eye', '👀', 'body'],
  ['みみ', 'みみ', 'mimi', 'ear', '👂', 'body'],
  ['はな', 'はな', 'hana', 'nose', '👃', 'body'],
  ['くち', 'くち', 'kuchi', 'mouth', '👄', 'body'],
  ['て', 'て', 'te', 'hand', '✋', 'body'],
  ['あし', 'あし', 'ashi', 'foot / leg', '🦶', 'body'],
  ['しっぽ', 'しっぽ', 'shippo', 'tail', '🐈', 'body'],
  // things
  ['ほん', 'ほん', 'hon', 'book', '📖', 'things'],
  ['かさ', 'かさ', 'kasa', 'umbrella', '☂️', 'things'],
  ['かばん', 'かばん', 'kaban', 'bag', '👜', 'things'],
  ['とけい', 'とけい', 'tokei', 'clock / watch', '⏰', 'things'],
  ['くつ', 'くつ', 'kutsu', 'shoes', '👟', 'things'],
  ['ふく', 'ふく', 'fuku', 'clothes', '👕', 'things'],
  ['おかね', 'おかね', 'okane', 'money', '💴', 'things'],
  ['でんわ', 'でんわ', 'denwa', 'telephone', '📞', 'things'],
  ['テレビ', 'テレビ', 'terebi', 'television', '📺', 'things'],
  ['カメラ', 'カメラ', 'kamera', 'camera', '📷', 'things'],
  ['ペン', 'ペン', 'pen', 'pen', '🖊️', 'things'],
  ['ボール', 'ボール', 'booru', 'ball', '⚽', 'things'],
  ['いす', 'いす', 'isu', 'chair', '🪑', 'things'],
  ['へや', 'へや', 'heya', 'room', '🛋️', 'things'],
  ['まど', 'まど', 'mado', 'window', '🪟', 'things'],
  ['とびら', 'とびら', 'tobira', 'door', '🚪', 'things'],
  // verbs (dictionary form)
  ['たべる', 'たべる', 'taberu', 'to eat', '😋', 'verbs'],
  ['のむ', 'のむ', 'nomu', 'to drink', '🥤', 'verbs'],
  ['みる', 'みる', 'miru', 'to see / watch', '👁️', 'verbs'],
  ['きく', 'きく', 'kiku', 'to listen / ask', '🎧', 'verbs'],
  ['いく', 'いく', 'iku', 'to go', '🚶', 'verbs'],
  ['くる', 'くる', 'kuru', 'to come', '🏃', 'verbs'],
  ['ねる', 'ねる', 'neru', 'to sleep', '😴', 'verbs'],
  ['はなす', 'はなす', 'hanasu', 'to speak', '🗣️', 'verbs'],
  ['かく', 'かく', 'kaku', 'to write', '✍️', 'verbs'],
  ['よむ', 'よむ', 'yomu', 'to read', '📚', 'verbs'],
  ['あそぶ', 'あそぶ', 'asobu', 'to play', '🎮', 'verbs'],
  ['およぐ', 'およぐ', 'oyogu', 'to swim', '🏊', 'verbs'],
  // adjectives
  ['おおきい', 'おおきい', 'ookii', 'big', '🐘', 'adjectives'],
  ['ちいさい', 'ちいさい', 'chiisai', 'small', '🐭', 'adjectives'],
  ['あつい', 'あつい', 'atsui', 'hot', '🔥', 'adjectives'],
  ['さむい', 'さむい', 'samui', 'cold', '🥶', 'adjectives'],
  ['おいしい', 'おいしい', 'oishii', 'delicious', '😋', 'adjectives'],
  ['かわいい', 'かわいい', 'kawaii', 'cute', '🥰', 'adjectives'],
  ['たのしい', 'たのしい', 'tanoshii', 'fun', '🎉', 'adjectives'],
  ['あたらしい', 'あたらしい', 'atarashii', 'new', '✨', 'adjectives'],
  ['はやい', 'はやい', 'hayai', 'fast / early', '⚡', 'adjectives'],
  ['たかい', 'たかい', 'takai', 'tall / expensive', '🗼', 'adjectives'],
];

function isAllKatakana(s: string): boolean {
  return /^[゠-ヿー]+$/.test(s);
}

export const WORDS: Word[] = N5_ROWS.map(([jp, reading, romaji, en, emoji, topic]) => ({
  id: `w:${reading}:${en.replace(/[^a-z]+/gi, '-').toLowerCase()}`,
  jp,
  reading,
  romaji,
  en,
  emoji,
  tier: 'N5',
  topic,
  katakana: isAllKatakana(jp),
}));


export function wordsByTopic(topic: Topic): Word[] {
  return WORDS.filter((w) => w.topic === topic);
}



/** Tour words (N5, N4, …), taught stop by stop; duplicates of kana-stage words are skipped. */
const kanaStageReadings = new Set(WORDS.map((w) => w.reading));
const seenTour = new Set<string>();
export const TOUR_WORDS: Word[] = TOUR.flatMap(({ tier, content }) =>
  Object.entries(content).flatMap(([stop, c]) =>
    c.words
      .filter(([, reading, en]) => {
        // skip words taught earlier: any kana-stage reading, or the same reading + meaning in the tour
        const key = `${reading}|${en.split(/[ /(]/)[0]!.toLowerCase()}`;
        if (kanaStageReadings.has(reading) || seenTour.has(key)) return false;
        seenTour.add(key);
        return true;
      })
      .map(([kanji, reading, en, emoji]) => ({
        id: `${tier === 'N5' ? 'n5' : tier.toLowerCase()}:${stop}:${reading}`,
        jp: reading,
        reading,
        romaji: kanaToRomaji(reading),
        en,
        emoji,
        tier,
        topic: 'things' as const,
        katakana: isAllKatakana(reading),
        kanji: kanji !== reading ? kanji : undefined,
        stop,
      })),
  ),
);
export const N5_WORDS: Word[] = TOUR_WORDS.filter((w) => w.tier === 'N5');

// Kana-stage words that the tour also teaches keep their kanji form, matched on reading + meaning
// (homophones such as はな flower / nose differ in meaning).
const headword = (en: string): string => en.split(/[ /(]/)[0]!.toLowerCase();
const kanjiFor = new Map<string, string>();
for (const { content } of TOUR)
  for (const c of Object.values(content))
    for (const [kanji, reading, en] of c.words) if (kanji !== reading && !kanjiFor.has(`${reading}|${headword(en)}`)) kanjiFor.set(`${reading}|${headword(en)}`, kanji);
for (const w of WORDS) {
  const k = kanjiFor.get(`${w.reading}|${headword(w.en)}`);
  if (k) w.kanji = k;
}

export const ALL_WORDS: Word[] = [...WORDS, ...TOUR_WORDS];

export const WORD_BY_ID = new Map(ALL_WORDS.map((w) => [w.id, w]));
