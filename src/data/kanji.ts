/** JLPT N5 kanji with core meanings and readings (on'yomi in katakana, kun'yomi in hiragana). */
export interface Kanji {
  char: string;
  meaning: string;
  on: string[];
  kun: string[];
  /** stop that introduces it (N5 Grand Tour) */
  stop: string;
  emoji: string;
}

// [char, meaning, on, kun, emoji]
type Row = [string, string, string, string, string];

const BY_STOP: Record<string, Row[]> = {
  hakodate: [
    ['人', 'person', 'ジン・ニン', 'ひと', '🧍'],
    ['日', 'sun / day', 'ニチ・ジツ', 'ひ・か', '☀️'],
    ['本', 'book / origin', 'ホン', 'もと', '📖'],
    ['語', 'language / word', 'ゴ', 'かた(る)', '🗣️'],
    ['学', 'study', 'ガク', 'まな(ぶ)', '🎓'],
    ['生', 'life / birth', 'セイ・ショウ', 'い(きる)・う(まれる)', '🌱'],
    ['先', 'ahead / previous', 'セン', 'さき', '⏩'],
    ['名', 'name', 'メイ・ミョウ', 'な', '📛'],
    ['男', 'man', 'ダン・ナン', 'おとこ', '👨'],
    ['女', 'woman', 'ジョ・ニョ', 'おんな', '👩'],
    ['子', 'child', 'シ・ス', 'こ', '🧒'],
  ],
  aomori: [
    ['何', 'what', 'カ', 'なに・なん', '❓'],
    ['一', 'one', 'イチ・イツ', 'ひと(つ)', '1️⃣'],
    ['二', 'two', 'ニ', 'ふた(つ)', '2️⃣'],
    ['三', 'three', 'サン', 'みっ(つ)', '3️⃣'],
    ['四', 'four', 'シ', 'よ・よん', '4️⃣'],
    ['五', 'five', 'ゴ', 'いつ(つ)', '5️⃣'],
    ['木', 'tree', 'モク・ボク', 'き', '🌳'],
    ['森', 'forest', 'シン', 'もり', '🌲'],
  ],
  akita: [
    ['大', 'big', 'ダイ・タイ', 'おお(きい)', '🐘'],
    ['小', 'small', 'ショウ', 'ちい(さい)・こ', '🐭'],
    ['長', 'long / leader', 'チョウ', 'なが(い)', '📏'],
    ['高', 'tall / expensive', 'コウ', 'たか(い)', '🗼'],
    ['安', 'cheap / peaceful', 'アン', 'やす(い)', '🏷️'],
    ['新', 'new', 'シン', 'あたら(しい)', '✨'],
    ['古', 'old', 'コ', 'ふる(い)', '🏚️'],
    ['白', 'white', 'ハク', 'しろ(い)', '⚪'],
    ['赤', 'red', 'セキ', 'あか(い)', '🔴'],
    ['青', 'blue', 'セイ', 'あお(い)', '🔵'],
  ],
  nikko: [
    ['今', 'now', 'コン', 'いま', '⏱️'],
    ['毎', 'every', 'マイ', '', '🔁'],
    ['休', 'rest', 'キュウ', 'やす(む)', '🛋️'],
    ['行', 'go', 'コウ・ギョウ', 'い(く)', '🚶'],
    ['来', 'come', 'ライ', 'く(る)', '🏃'],
    ['見', 'see', 'ケン', 'み(る)', '👁️'],
    ['月', 'moon / month', 'ゲツ・ガツ', 'つき', '🌙'],
  ],
  kanazawa: [
    ['食', 'eat / food', 'ショク', 'た(べる)', '🍚'],
    ['飲', 'drink', 'イン', 'の(む)', '🥤'],
    ['金', 'gold / money', 'キン', 'かね', '🪙'],
    ['水', 'water', 'スイ', 'みず', '💧'],
    ['魚', 'fish', 'ギョ', 'さかな', '🐟'],
    ['肉', 'meat', 'ニク', '', '🍖'],
    ['茶', 'tea', 'チャ・サ', '', '🍵'],
  ],
  shirakawa: [
    ['入', 'enter', 'ニュウ', 'はい(る)・い(る)', '🚪'],
    ['出', 'exit / go out', 'シュツ', 'で(る)・だ(す)', '🏃‍♂️'],
    ['口', 'mouth', 'コウ', 'くち', '👄'],
    ['駅', 'station', 'エキ', '', '🚉'],
    ['会', 'meet', 'カイ', 'あ(う)', '🤝'],
    ['社', 'company / shrine', 'シャ', 'やしろ', '🏢'],
    ['校', 'school', 'コウ', '', '🏫'],
  ],
  takayama: [
    ['六', 'six', 'ロク', 'むっ(つ)', '6️⃣'],
    ['七', 'seven', 'シチ', 'なな(つ)', '7️⃣'],
    ['八', 'eight', 'ハチ', 'やっ(つ)', '8️⃣'],
    ['九', 'nine', 'キュウ・ク', 'ここの(つ)', '9️⃣'],
    ['十', 'ten', 'ジュウ', 'とお', '🔟'],
    ['百', 'hundred', 'ヒャク', '', '💯'],
    ['千', 'thousand', 'セン', 'ち', '🔢'],
    ['万', 'ten thousand', 'マン・バン', '', '💴'],
    ['円', 'yen / circle', 'エン', 'まる(い)', '💴'],
    ['時', 'time / hour', 'ジ', 'とき', '🕰️'],
    ['分', 'minute / divide', 'フン・ブン', 'わ(かる)', '⏲️'],
    ['半', 'half', 'ハン', 'なか(ば)', '🕧'],
    ['午', 'noon', 'ゴ', '', '🕛'],
    ['店', 'shop', 'テン', 'みせ', '🏪'],
  ],
  ise: [
    ['電', 'electricity', 'デン', '', '⚡'],
    ['車', 'car / vehicle', 'シャ', 'くるま', '🚗'],
    ['道', 'road / way', 'ドウ', 'みち', '🛣️'],
    ['右', 'right', 'ウ・ユウ', 'みぎ', '➡️'],
    ['左', 'left', 'サ', 'ひだり', '⬅️'],
    ['前', 'before / front', 'ゼン', 'まえ', '⏩'],
    ['後', 'after / behind', 'ゴ・コウ', 'うし(ろ)・あと', '⏪'],
  ],
  kobe: [
    ['上', 'up / above', 'ジョウ', 'うえ・あ(がる)', '⬆️'],
    ['下', 'down / below', 'カ・ゲ', 'した・さ(がる)', '⬇️'],
    ['中', 'middle / inside', 'チュウ', 'なか', '🎯'],
    ['外', 'outside', 'ガイ', 'そと', '🌤️'],
    ['山', 'mountain', 'サン', 'やま', '⛰️'],
    ['川', 'river', 'セン', 'かわ', '🏞️'],
    ['東', 'east', 'トウ', 'ひがし', '🌅'],
    ['西', 'west', 'セイ・サイ', 'にし', '🌇'],
    ['南', 'south', 'ナン', 'みなみ', '🧭'],
    ['北', 'north', 'ホク', 'きた', '🧊'],
  ],
  kochi: [
    ['火', 'fire', 'カ', 'ひ', '🔥'],
    ['土', 'earth / soil', 'ド・ト', 'つち', '🟫'],
    ['曜', 'weekday', 'ヨウ', '', '📅'],
    ['週', 'week', 'シュウ', '', '🗓️'],
    ['年', 'year', 'ネン', 'とし', '🎆'],
    ['間', 'interval / between', 'カン・ケン', 'あいだ・ま', '↔️'],
    ['友', 'friend', 'ユウ', 'とも', '🧑‍🤝‍🧑'],
  ],
  beppu: [
    ['目', 'eye', 'モク', 'め', '👁️'],
    ['耳', 'ear', 'ジ', 'みみ', '👂'],
    ['手', 'hand', 'シュ', 'て', '✋'],
    ['足', 'foot / enough', 'ソク', 'あし・た(りる)', '🦶'],
    ['父', 'father', 'フ', 'ちち', '👨'],
    ['母', 'mother', 'ボ', 'はは', '👩'],
    ['話', 'talk', 'ワ', 'はな(す)', '💬'],
    ['言', 'say', 'ゲン・ゴン', 'い(う)', '🗨️'],
  ],
  yakushima: [
    ['天', 'heaven / sky', 'テン', 'あめ', '🌌'],
    ['気', 'spirit / air', 'キ・ケ', '', '🌬️'],
    ['雨', 'rain', 'ウ', 'あめ', '☔'],
    ['花', 'flower', 'カ', 'はな', '🌺'],
    ['空', 'sky / empty', 'クウ', 'そら・から', '☁️'],
    ['国', 'country', 'コク', 'くに', '🌏'],
    ['立', 'stand', 'リツ', 'た(つ)', '🧍'],
    ['聞', 'hear / ask', 'ブン・モン', 'き(く)', '👂'],
    ['読', 'read', 'ドク', 'よ(む)', '📖'],
    ['書', 'write', 'ショ', 'か(く)', '✍️'],
    ['買', 'buy', 'バイ', 'か(う)', '🛍️'],
    ['多', 'many', 'タ', 'おお(い)', '➕'],
    ['少', 'few / a little', 'ショウ', 'すく(ない)・すこ(し)', '➖'],
  ],
};

const split = (s: string): string[] => (s ? s.split('・') : []);

export const KANJI: Kanji[] = Object.entries(BY_STOP).flatMap(([stop, rows]) =>
  rows.map(([char, meaning, on, kun, emoji]) => ({ char, meaning, on: split(on), kun: split(kun), stop, emoji })),
);

export const KANJI_BY_CHAR = new Map(KANJI.map((k) => [k.char, k]));

/** The most useful reading to quiz: first kun'yomi without okurigana, else first on'yomi in hiragana. */
export function primaryReading(k: Kanji): string {
  const kun = k.kun[0];
  if (kun) return kun.replace(/\(.*\)/, '');
  const on = k.on[0] ?? '';
  return [...on].map((c) => String.fromCodePoint(c.codePointAt(0)! - 0x60)).join('');
}
