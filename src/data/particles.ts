/**
 * Particle Pounce: fill the ＿ with the right particle.
 * Each item lists hand-picked wrong choices that are ungrammatical in that sentence,
 * plus `also` for other particles a native speaker would accept.
 * Sentences use furigana markup `{漢字|かな}`.
 */
export interface ParticleItem {
  id: string;
  /** sentence with exactly one ＿ */
  text: string;
  answer: string;
  /** other correct particles */
  also?: string[];
  /** at least three wrong choices, none of them grammatical here */
  wrong: string[];
  en: string;
  /** one-line rule shown after answering */
  why: string;
  /** stop id from which the item appears */
  from: string;
}

export const BLANK = '＿';

export const PARTICLES: ParticleItem[] = [
  // N5
  { id: 'wa-cat', text: 'わたし＿ ねこです。', answer: 'は', wrong: ['を', 'に', 'で'], en: 'I am a cat.', why: 'は marks the topic: “as for me…”.', from: 'hakodate' },
  { id: 'wa-student', text: 'たなかさん＿ がくせいですか。', answer: 'は', wrong: ['を', 'へ', 'で'], en: 'Is Tanaka-san a student?', why: 'は marks the topic of a です sentence.', from: 'hakodate' },
  { id: 'no-book', text: 'これは わたし＿ ほんです。', answer: 'の', wrong: ['を', 'に', 'で'], en: 'This is my book.', why: 'の links nouns: わたしの ほん = my book.', from: 'aomori' },
  { id: 'mo-tama', text: 'クロは ねこです。タマ＿ ねこです。', answer: 'も', wrong: ['を', 'に', 'へ'], en: 'Kuro is a cat. Tama is a cat too.', why: 'も means “too / also” and takes the place of は.', from: 'aomori' },
  { id: 'wo-fish', text: 'ねこが さかな＿ たべます。', answer: 'を', wrong: ['に', 'へ', 'の'], en: 'The cat eats fish.', why: 'を marks the object of a verb.', from: 'kanazawa' },
  { id: 'wo-read', text: 'まいにち ほん＿ よみます。', answer: 'を', wrong: ['へ', 'が', 'に'], en: 'I read a book every day.', why: 'を marks what you read, eat, drink, see…', from: 'kanazawa' },
  { id: 'wo-water', text: 'みず＿ のみませんか。', answer: 'を', wrong: ['へ', 'に', 'で'], en: 'Won’t you drink some water?', why: 'を marks the thing you drink.', from: 'kanazawa' },
  { id: 'ni-kyoto', text: 'あした きょうと＿ いきます。', answer: 'に', also: ['へ'], wrong: ['で', 'の', 'が'], en: 'Tomorrow I will go to Kyoto.', why: 'に or へ marks where you are going.', from: 'shirakawa' },
  { id: 'ni-seven', text: 'しちじ＿ おきます。', answer: 'に', wrong: ['で', 'を', 'へ'], en: 'I get up at seven.', why: 'に marks a clock time: しちじに = at seven.', from: 'shirakawa' },
  { id: 'ni-sunday', text: 'にちようび＿ こうえんへ いきます。', answer: 'に', also: ['は'], wrong: ['を', 'で', 'へ'], en: 'On Sunday I go to the park.', why: 'に marks a day or time when something happens.', from: 'shirakawa' },
  { id: 'kara-lunch', text: 'ひるやすみは じゅうにじ＿ いちじまでです。', answer: 'から', wrong: ['に', 'を', 'で'], en: 'Lunch break is from twelve to one.', why: 'から = from, まで = until.', from: 'takayama' },
  { id: 'made-work', text: 'くじから ごじ＿ はたらきます。', answer: 'まで', wrong: ['に', 'を', 'へ'], en: 'I work from nine until five.', why: 'まで marks the end point: until five.', from: 'takayama' },
  { id: 'de-library', text: 'としょかん＿ べんきょうします。', answer: 'で', wrong: ['を', 'が', 'へ'], en: 'I study at the library.', why: 'で marks where an action happens.', from: 'ise' },
  { id: 'de-bus', text: 'バス＿ がっこうへ いきます。', answer: 'で', wrong: ['を', 'が', 'に'], en: 'I go to school by bus.', why: 'で marks the means: by bus, with chopsticks.', from: 'ise' },
  { id: 'de-chopsticks', text: 'はし＿ すしを たべます。', answer: 'で', wrong: ['を', 'に', 'へ'], en: 'I eat sushi with chopsticks.', why: 'で marks the tool you use.', from: 'ise' },
  { id: 'ga-park-cat', text: 'こうえんに ねこ＿ います。', answer: 'が', also: ['も'], wrong: ['を', 'で', 'へ'], en: 'There is a cat in the park.', why: 'が marks what exists with います / あります.', from: 'kobe' },
  { id: 'ga-desk-book', text: 'つくえの うえに ほん＿ あります。', answer: 'が', wrong: ['を', 'で', 'へ'], en: 'There is a book on the desk.', why: 'が marks the thing that is there.', from: 'kobe' },
  { id: 'ni-room-tv', text: 'へや＿ テレビが あります。', answer: 'に', wrong: ['を', 'へ', 'で'], en: 'There is a TV in the room.', why: 'に marks where something is; で is for where an action happens.', from: 'kobe' },
  { id: 'to-friend', text: 'ともだち＿ えいがを みました。', answer: 'と', wrong: ['を', 'へ', 'に'], en: 'I watched a film with a friend.', why: 'と = together with.', from: 'kochi' },
  { id: 'to-bread-egg', text: 'パン＿ たまごを かいました。', answer: 'と', also: ['や'], wrong: ['を', 'に', 'へ'], en: 'I bought bread and eggs.', why: 'と joins nouns: A と B = A and B.', from: 'kochi' },
  { id: 'ni-onsen', text: 'おんせん＿ はいりたいです。', answer: 'に', wrong: ['を', 'が', 'の'], en: 'I want to get into a hot spring.', why: 'はいる takes に: you enter into something.', from: 'beppu' },
  { id: 'wo-sushi', text: 'すし＿ たべたいです。', answer: 'を', also: ['が'], wrong: ['に', 'で', 'へ'], en: 'I want to eat sushi.', why: 'With 〜たい the object can take を or が.', from: 'beppu' },
  { id: 'ni-name-here', text: 'ここ＿ なまえを かいてください。', answer: 'に', also: ['で'], wrong: ['を', 'が', 'へ'], en: 'Please write your name here.', why: 'に marks the spot something goes onto.', from: 'yakushima' },
  // N4
  { id: 'ga-window', text: '{窓|まど}＿ {開|あ}いています。', answer: 'が', also: ['は'], wrong: ['を', 'で', 'に'], en: 'The window is open.', why: '開く is intransitive, so the window takes が, not を.', from: 'hikone' },
  { id: 'dake-water', text: '{水|みず}＿ {飲|の}みました。', answer: 'だけ', wrong: ['しか', 'へ', 'に'], en: 'I drank only water.', why: 'だけ = only, with a positive verb; しか needs a negative verb.', from: 'uji' },
  { id: 'shika-yen', text: '{百円|ひゃくえん}＿ ありません。', answer: 'しか', wrong: ['だけ', 'を', 'へ'], en: 'I only have 100 yen.', why: 'しか + negative verb = nothing but.', from: 'uji' },
  { id: 'ni-fuji', text: '{富士山|ふじさん}＿ {登|のぼ}ったことが あります。', answer: 'に', also: ['を'], wrong: ['で', 'が', 'の'], en: 'I have climbed Mt Fuji.', why: '登る takes に (onto the top) or を (along the mountain).', from: 'koyasan' },
  { id: 'yori-train', text: '{電車|でんしゃ}は バス＿ {速|はや}いです。', answer: 'より', wrong: ['から', 'まで', 'を'], en: 'The train is faster than the bus.', why: 'A は B より … = A is more … than B.', from: 'okayama' },
  { id: 'hodo-cold', text: '{今日|きょう}は {昨日|きのう}＿ {寒|さむ}くないです。', answer: 'ほど', wrong: ['を', 'まで', 'に'], en: 'Today is not as cold as yesterday.', why: 'B ほど + negative = not as … as B.', from: 'okayama' },
  { id: 'demo-tea', text: 'お{茶|ちゃ}＿ {飲|の}みませんか。', answer: 'でも', also: ['を'], wrong: ['へ', 'に', 'が'], en: 'How about some tea or something?', why: 'でも softens a suggestion: tea or something.', from: 'tottori' },
  { id: 'to-rain', text: '{明日|あした}は {雨|あめ}だ＿ {思|おも}います。', answer: 'と', wrong: ['を', 'が', 'に'], en: 'I think it will rain tomorrow.', why: 'と quotes what you think or say: …と思います.', from: 'matsue' },
  { id: 'ga-speak', text: 'タマは {日本語|にほんご}＿ {話|はな}せます。', answer: 'が', also: ['を'], wrong: ['に', 'へ', 'まで'], en: 'Tama can speak Japanese.', why: 'Potential verbs usually take が for the object.', from: 'matsumoto' },
  { id: 'ga-fish', text: 'この {川|かわ}では {魚|さかな}＿ {釣|つ}れます。', answer: 'が', also: ['を'], wrong: ['に', 'へ', 'から'], en: 'You can catch fish in this river.', why: 'Potential verbs usually take が for the object.', from: 'matsumoto' },
  { id: 'wo-medicine', text: '{薬|くすり}＿ {飲|の}まなければ なりません。', answer: 'を', wrong: ['に', 'で', 'へ'], en: 'I have to take the medicine.', why: 'を marks the object, even before なければ.', from: 'nagano' },
  { id: 'kara-rain', text: '{雨|あめ}だ＿、{行|い}きません。', answer: 'から', wrong: ['ので', 'を', 'に'], en: 'It’s raining, so I won’t go.', why: 'から follows だ; ので needs な: 雨なので.', from: 'kusatsu' },
  { id: 'ni-receive', text: '{友|とも}だち＿ {本|ほん}を もらいました。', answer: 'に', also: ['から'], wrong: ['を', 'へ', 'で'], en: 'I received a book from a friend.', why: 'もらう marks the giver with に or から.', from: 'yamagata' },
  { id: 'ni-give', text: '{先生|せんせい}＿ {花|はな}を あげました。', answer: 'に', wrong: ['から', 'を', 'で'], en: 'I gave the teacher flowers.', why: 'あげる marks the receiver with に.', from: 'kawagoe' },
  // N3
  { id: 'bakari-sleep', text: 'うちの ねこは {寝|ね}て＿ いる。', answer: 'ばかり', wrong: ['だけ', 'より', 'ほど'], en: 'Our cat does nothing but sleep.', why: '〜てばかりいる = does nothing but …', from: 'inuyama' },
  { id: 'sae-child', text: '{子|こ}どもで＿ わかる {問題|もんだい}です。', answer: 'さえ', also: ['も'], wrong: ['しか', 'ばかり', 'より'], en: 'It’s a question even a child can answer.', why: 'さえ = even: でさえ / でも.', from: 'gujo' },
  { id: 'ni-tsuite', text: '{佐渡|さど}の {歴史|れきし}＿ ついて {調|しら}べています。', answer: 'に', wrong: ['を', 'で', 'と'], en: 'I am researching the history of Sado.', why: 'について = about, concerning.', from: 'sado' },
  { id: 'toshite', text: '{通訳|つうやく}＿ {会議|かいぎ}に {出|で}ました。', answer: 'として', wrong: ['にとって', 'に対して', 'より'], en: 'I attended the meeting as an interpreter.', why: 'として = in the role of, as.', from: 'aizu' },
  { id: 'ni-yotte', text: '{国|くに}＿ {習慣|しゅうかん}が {違|ちが}います。', answer: 'によって', wrong: ['にとって', 'に対して', 'ほど'], en: 'Customs differ from country to country.', why: 'によって = depending on.', from: 'toyama' },
  { id: 'ni-totte', text: 'この {本|ほん}は {私|わたし}＿ {大切|たいせつ}です。', answer: 'にとって', wrong: ['について', 'に対して', 'によって'], en: 'This book is precious to me.', why: 'にとって = for, from the point of view of.', from: 'otaru' },
];

/** Wrong choices for an item, never including an accepted particle. */
export function particleDistractors(item: ParticleItem, n: number, rng: () => number = Math.random): string[] {
  const ok = new Set([item.answer, ...(item.also ?? [])]);
  const pool = item.wrong.filter((w) => !ok.has(w));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, n);
}
