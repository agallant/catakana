/**
 * Onomatopoeia and mimetic words (擬音語・擬態語): ニャー, ゴロゴロ, ドキドキ, ペラペラ…
 * Each example has one ＿ for the word; `wrong` lists words that clearly do not fit that sentence.
 */
export interface Ono {
  id: string;
  word: string;
  en: string;
  emoji: string;
  /** example sentence with ＿ (furigana markup allowed) */
  ex: string;
  exEn: string;
  /** at least three other words from this list that do not fit the example */
  wrong: string[];
  /** stop id from which the word appears */
  from: string;
}

export const ONO_BLANK = '＿';

export const ONOMATOPOEIA: Ono[] = [
  // animal sounds (N5 route)
  { id: 'nya', word: 'ニャー', en: 'meow', emoji: '🐱', ex: 'ねこが ＿と なきました。', exEn: 'The cat went “meow”.', wrong: ['ワンワン', 'ケロケロ', 'コケコッコー'], from: 'aomori' },
  { id: 'wanwan', word: 'ワンワン', en: 'woof woof', emoji: '🐶', ex: 'いぬが ＿ ほえています。', exEn: 'The dog is barking.', wrong: ['ニャー', 'ケロケロ', 'チュンチュン'], from: 'aomori' },
  { id: 'kerokero', word: 'ケロケロ', en: 'ribbit (a frog)', emoji: '🐸', ex: 'かえるが ＿ ないています。', exEn: 'The frogs are croaking.', wrong: ['ワンワン', 'コケコッコー', 'ニャー'], from: 'akita' },
  { id: 'chunchun', word: 'チュンチュン', en: 'tweet tweet (a sparrow)', emoji: '🐦', ex: 'あさ、すずめが ＿ ないています。', exEn: 'In the morning the sparrows are chirping.', wrong: ['ワンワン', 'ケロケロ', 'ニャー'], from: 'akita' },
  { id: 'kokekokko', word: 'コケコッコー', en: 'cock-a-doodle-doo', emoji: '🐓', ex: 'にわとりが ＿と なきました。', exEn: 'The rooster crowed.', wrong: ['ニャー', 'ワンワン', 'ケロケロ'], from: 'nikko' },
  { id: 'gorogoro', word: 'ゴロゴロ', en: 'purr (also: rumbling, lazing about)', emoji: '😺', ex: 'ねこが のどを ＿ ならしています。', exEn: 'The cat is purring.', wrong: ['ワンワン', 'ケロケロ', 'トントン'], from: 'nikko' },
  // everyday sounds
  { id: 'tonton', word: 'トントン', en: 'knock knock, tap tap', emoji: '🚪', ex: 'ドアを ＿ たたきました。', exEn: 'I knocked on the door.', wrong: ['ズルズル', 'ニャー', 'ザーザー'], from: 'kanazawa' },
  { id: 'pachipachi', word: 'パチパチ', en: 'clapping', emoji: '👏', ex: 'コンサートの あと、みんなが ＿ てを たたきました。', exEn: 'After the concert everyone clapped.', wrong: ['ズルズル', 'ワンワン', 'しとしと'], from: 'shirakawa' },
  { id: 'zuruzuru', word: 'ズルズル', en: 'slurp (noodles)', emoji: '🍜', ex: 'ラーメンを ＿ すすります。', exEn: 'I slurp my ramen.', wrong: ['トントン', 'パチパチ', 'ニャー'], from: 'takayama' },
  { id: 'gachan', word: 'ガチャン', en: 'crash, smash', emoji: '🍽️', ex: 'おさらが ＿と われました。', exEn: 'The plate smashed with a crash.', wrong: ['ニャー', 'しとしと', 'ふわふわ'], from: 'ise' },
  // weather and feelings (N4 route)
  { id: 'zaza', word: 'ザーザー', en: 'pouring (rain)', emoji: '☔', ex: '{雨|あめ}が ＿ {降|ふ}っています。', exEn: 'It is pouring with rain.', wrong: ['ワンワン', 'ドキドキ', 'ペラペラ'], from: 'hikone' },
  { id: 'shitoshito', word: 'しとしと', en: 'drizzling softly', emoji: '🌧️', ex: '{静|しず}かな {雨|あめ}が ＿ {降|ふ}っています。', exEn: 'A quiet rain is drizzling down.', wrong: ['ガチャン', 'ワクワク', 'ぺこぺこ'], from: 'uji' },
  { id: 'byubyu', word: 'ビュービュー', en: 'howling (wind)', emoji: '🌬️', ex: '{冷|つめ}たい {風|かぜ}が ＿ {吹|ふ}いています。', exEn: 'A cold wind is howling.', wrong: ['ニコニコ', 'ねばねば', 'ぺこぺこ'], from: 'koyasan' },
  { id: 'pokapoka', word: 'ぽかぽか', en: 'nice and warm', emoji: '☀️', ex: '{今日|きょう}は {日|ひ}が あたって、＿ あたたかいです。', exEn: 'Today the sun is out and it is lovely and warm.', wrong: ['イライラ', 'ねばねば', 'ズルズル'], from: 'okayama' },
  { id: 'dokidoki', word: 'ドキドキ', en: 'heart pounding', emoji: '💓', ex: '{試験|しけん}の {前|まえ}は {胸|むね}が ＿します。', exEn: 'My heart pounds before an exam.', wrong: ['ザーザー', 'さくさく', 'ズルズル'], from: 'tottori' },
  { id: 'wakuwaku', word: 'ワクワク', en: 'excited, thrilled', emoji: '🤩', ex: '{明日|あした}から {旅行|りょこう}なので、＿しています。', exEn: 'I’m excited because my trip starts tomorrow.', wrong: ['ザーザー', 'つるつる', 'ズルズル'], from: 'matsue' },
  { id: 'iraira', word: 'イライラ', en: 'irritated, on edge', emoji: '😤', ex: '{電車|でんしゃ}が {来|こ}なくて、＿しています。', exEn: 'The train isn’t coming and I’m getting irritated.', wrong: ['ぽかぽか', 'さくさく', 'ニャー'], from: 'matsumoto' },
  { id: 'gakkari', word: 'がっかり', en: 'disappointed', emoji: '😞', ex: '{雨|あめ}で {花火|はなび}が {中止|ちゅうし}になって、＿しました。', exEn: 'The fireworks were cancelled for rain, and I was disappointed.', wrong: ['ぴかぴか', 'さくさく', 'トントン'], from: 'nagano' },
  { id: 'hotto', word: 'ほっと', en: 'relieved', emoji: '😮‍💨', ex: '{財布|さいふ}が {見|み}つかって、＿しました。', exEn: 'I found my wallet and was relieved.', wrong: ['ねばねば', 'ズルズル', 'ザーザー'], from: 'kusatsu' },
  { id: 'nikoniko', word: 'ニコニコ', en: 'smiling', emoji: '😊', ex: 'あの ねこは いつも ＿ {笑|わら}っています。', exEn: 'That cat is always smiling.', wrong: ['ザーザー', 'ねばねば', 'ガチャン'], from: 'hiraizumi' },
  { id: 'perapera', word: 'ペラペラ', en: 'fluent', emoji: '🗣️', ex: 'タマは {英語|えいご}が ＿です。', exEn: 'Tama speaks fluent English.', wrong: ['ぺこぺこ', 'ぽかぽか', 'ねばねば'], from: 'yamagata' },
  { id: 'pekopeko', word: 'ぺこぺこ', en: 'starving', emoji: '🍽️', ex: 'おなかが ＿です。', exEn: 'I’m starving.', wrong: ['ペラペラ', 'ぴかぴか', 'ニコニコ'], from: 'yamagata' },
  { id: 'yukkuri', word: 'ゆっくり', en: 'slowly, unhurried', emoji: '🐢', ex: 'もう {少|すこ}し ＿ {話|はな}してください。', exEn: 'Please speak a little more slowly.', wrong: ['ガチャン', 'ねばねば', 'ぺこぺこ'], from: 'kawagoe' },
  // manner and texture (N3 route)
  { id: 'gussuri', word: 'ぐっすり', en: 'sleeping soundly', emoji: '😴', ex: 'ねこが ＿ {寝|ね}ています。', exEn: 'The cat is fast asleep.', wrong: ['ペラペラ', 'ガチャン', 'さくさく'], from: 'inuyama' },
  { id: 'nonbiri', word: 'のんびり', en: 'relaxed, leisurely', emoji: '♨️', ex: '{休|やす}みの {日|ひ}は {温泉|おんせん}で ＿ します。', exEn: 'On my day off I relax at a hot spring.', wrong: ['ガチャン', 'ねばねば', 'ワンワン'], from: 'gujo' },
  { id: 'burabura', word: 'ぶらぶら', en: 'strolling, wandering', emoji: '🚶', ex: '{午後|ごご}は {町|まち}を ＿ {歩|ある}きました。', exEn: 'In the afternoon I strolled around town.', wrong: ['ねばねば', 'さくさく', 'ザーザー'], from: 'tsumago' },
  { id: 'surasura', word: 'すらすら', en: 'smoothly, without a hitch', emoji: '📖', ex: '{漢字|かんじ}が ＿ {読|よ}めるように なりました。', exEn: 'I can now read kanji smoothly.', wrong: ['ねばねば', 'ぺこぺこ', 'ガチャン'], from: 'toyama' },
  { id: 'fuwafuwa', word: 'ふわふわ', en: 'fluffy, soft', emoji: '☁️', ex: 'この ねこの {毛|け}は ＿です。', exEn: 'This cat’s fur is fluffy.', wrong: ['ザーザー', 'ペラペラ', 'イライラ'], from: 'sado' },
  { id: 'tsurutsuru', word: 'つるつる', en: 'slippery, smooth', emoji: '🧊', ex: '{凍|こお}った {道|みち}は ＿ {滑|すべ}ります。', exEn: 'Icy roads are slippery.', wrong: ['ぺこぺこ', 'ニコニコ', 'ワクワク'], from: 'aizu' },
  { id: 'nebaneba', word: 'ねばねば', en: 'sticky, stringy', emoji: '🫘', ex: '{納豆|なっとう}は ＿しています。', exEn: 'Natto is sticky.', wrong: ['ペラペラ', 'ビュービュー', 'ワクワク'], from: 'otaru' },
  { id: 'sakusaku', word: 'さくさく', en: 'crispy, crunchy', emoji: '🍤', ex: 'この てんぷらは ＿して おいしいです。', exEn: 'This tempura is crispy and delicious.', wrong: ['ペラペラ', 'イライラ', 'ビュービュー'], from: 'shiretoko' },
  { id: 'pikapika', word: 'ぴかぴか', en: 'spotless, shiny clean', emoji: '🪟', ex: '{窓|まど}を {拭|ふ}いて、＿に なりました。', exEn: 'I wiped the windows until they were spotless.', wrong: ['ぺこぺこ', 'イライラ', 'ザーザー'], from: 'naoshima' },
  { id: 'kirakira', word: 'キラキラ', en: 'twinkling, glittering', emoji: '✨', ex: '{夜空|よぞら}に {星|ほし}が ＿ {光|ひか}っています。', exEn: 'Stars are twinkling in the night sky.', wrong: ['ねばねば', 'ぺこぺこ', 'ズルズル'], from: 'tokushima' },
  { id: 'boroboro', word: 'ボロボロ', en: 'worn out, falling apart', emoji: '👟', ex: '{古|ふる}い {靴|くつ}が ＿に なりました。', exEn: 'My old shoes have fallen apart.', wrong: ['ワクワク', 'ニコニコ', 'ビュービュー'], from: 'takachiho' },
  // feelings and scenes (N2 route)
  { id: 'hirahira', word: 'ひらひら', en: 'fluttering', emoji: '🌸', ex: '{桜|さくら}の {花|はな}びらが ＿ {散|ち}って いる。', exEn: 'Cherry petals are fluttering down.', wrong: ['ねばねば', 'ぺこぺこ', 'イライラ'], from: 'hirosaki' },
  { id: 'shimijimi', word: 'しみじみ', en: 'deeply, with feeling', emoji: '🍃', ex: '{松島|まつしま}の {景色|けしき}を ＿ {眺|なが}めた。', exEn: 'I gazed at the Matsushima view, deeply moved.', wrong: ['ガチャン', 'ぺこぺこ', 'ねばねば'], from: 'matsushima' },
  { id: 'hissori', word: 'ひっそり', en: 'hushed, deserted', emoji: '🏚️', ex: '{無人|むじん}の {島|しま}は ＿と {静|しず}まり{返|かえ}って いた。', exEn: 'The uninhabited island lay hushed and still.', wrong: ['ワクワク', 'ペラペラ', 'さくさく'], from: 'gunkanjima' },
  { id: 'zurari', word: 'ずらり', en: 'all in a row', emoji: '🏺', ex: '{店先|みせさき}に {茶碗|ちゃわん}が ＿と {並|なら}んで いる。', exEn: 'Tea bowls are lined up in rows outside the shop.', wrong: ['ぐっすり', 'イライラ', 'ぺこぺこ'], from: 'arita' },
  { id: 'hetoheto', word: 'へとへと', en: 'worn out, exhausted', emoji: '🥵', ex: '{石段|いしだん}を {全部|ぜんぶ} {登|のぼ}って、＿に なった。', exEn: 'After climbing all the stone steps, I was worn out.', wrong: ['キラキラ', 'ふわふわ', 'ニャー'], from: 'kotohira' },
  { id: 'tekuteku', word: 'てくてく', en: 'trudging along on foot', emoji: '🥾', ex: '{古道|こどう}を ＿ {歩|ある}いた。', exEn: 'I trudged along the old pilgrim trail.', wrong: ['ザーザー', 'ねばねば', 'ガチャン'], from: 'kumano' },
  { id: 'waiwai', word: 'わいわい', en: 'noisily, merrily', emoji: '🎉', ex: '{仲見世|なかみせ}で {観光客|かんこうきゃく}が ＿ {楽|たの}しんで いる。', exEn: 'Tourists are having a lively time on Nakamise Street.', wrong: ['しとしと', 'ねばねば', 'ぐっすり'], from: 'asakusa' },
  // more everyday feelings and scenes (N2 route)
  { id: 'guruguru', word: 'ぐるぐる', en: 'round and round', emoji: '🌀', ex: '{錦帯橋|きんたいきょう}の {周|まわ}りを ＿ {回|まわ}って {写真|しゃしん}を {撮|と}った。', exEn: 'I went round and round Kintai Bridge taking photos.', wrong: ['ニャー', 'ザーザー', 'ねばねば'], from: 'iwakuni' },
  { id: 'gisshiri', word: 'ぎっしり', en: 'packed tight', emoji: '📚', ex: '{城下町|じょうかまち}の {本屋|ほんや}に {本|ほん}が ＿ {詰|つ}まって いる。', exEn: 'Books are packed tight in the castle-town bookshop.', wrong: ['ひらひら', 'ぐっすり', 'イライラ'], from: 'hagi' },
  { id: 'batabata', word: 'ばたばた', en: 'hectic, in a flurry', emoji: '🏃', ex: '{今日|きょう}は ＿ して いて、ゆっくり {見|み}られなかった。', exEn: 'Today was hectic and I could not look around at leisure.', wrong: ['ニャー', 'ガチャン', 'つるつる'], from: 'kurashiki' },
  { id: 'bonyari', word: 'ぼんやり', en: 'faintly, vaguely', emoji: '🌫️', ex: '{霧|きり}の {中|なか}に {松|まつ}の {林|はやし}が ＿ {見|み}えた。', exEn: 'The pine grove looked faint in the mist.', wrong: ['ガチャン', 'ニャー', 'ぺこぺこ'], from: 'amanohashidate' },
  { id: 'sukkiri', word: 'すっきり', en: 'refreshed, clear-headed', emoji: '😌', ex: '{山道|やまみち}を {歩|ある}いたら、{気分|きぶん}が ＿ した。', exEn: 'After walking the mountain path, I felt refreshed.', wrong: ['ワンワン', 'ねばねば', 'ガチャン'], from: 'yoshino' },
  // subtler moods (N1 route)
  { id: 'uttori', word: 'うっとり', en: 'entranced, spellbound', emoji: '😍', ex: '{夕日|ゆうひ}に {染|そ}まる {海|うみ}を ＿ {見|み}つめた。', exEn: 'I gazed, spellbound, at the sea glowing in the sunset.', wrong: ['イライラ', 'ねばねば', 'ガチャン'], from: 'ogasawara' },
  { id: 'zotto', word: 'ぞっと', en: 'a shiver of fear', emoji: '😨', ex: '{河童|かっぱ}の {話|はなし}を {聞|き}いて、{背筋|せすじ}が ＿した。', exEn: 'Hearing the kappa story sent a shiver down my spine.', wrong: ['ぽかぽか', 'さくさく', 'ペラペラ'], from: 'tono' },
  { id: 'mokumoku', word: 'もくもく', en: 'silently and steadily', emoji: '🧹', ex: '{修行僧|しゅぎょうそう}は ＿と {掃除|そうじ}を {続|つづ}けた。', exEn: 'The trainee monks went on cleaning in silence.', wrong: ['ワクワク', 'ガチャン', 'ぺこぺこ'], from: 'eiheiji' },
  { id: 'harahara', word: 'はらはら', en: 'on edge, in suspense', emoji: '😬', ex: '{合戦|かっせん}の {再現|さいげん}を ＿しながら {見|み}た。', exEn: 'I watched the battle re-enactment on the edge of my seat.', wrong: ['ぽかぽか', 'さくさく', 'ねばねば'], from: 'sekigahara' },
  { id: 'jikkuri', word: 'じっくり', en: 'taking one’s time, thoroughly', emoji: '⏳', ex: '{温泉|おんせん}に ＿ {浸|つ}かって {疲|つか}れを とった。', exEn: 'I soaked unhurriedly in the hot spring and shook off my tiredness.', wrong: ['ガチャン', 'イライラ', 'ペラペラ'], from: 'kinosaki' },
  { id: 'honobono', word: 'ほのぼの', en: 'heartwarming', emoji: '🐈', ex: '{招|まね}き{猫|ねこ}が {並|なら}ぶ、＿と した {光景|こうけい}だ。', exEn: 'Rows of beckoning cats make a heartwarming sight.', wrong: ['ねばねば', 'イライラ', 'ザーザー'], from: 'gotokuji' },
  // quiet, literary feelings and scenes (N1 route)
  { id: 'hishihishi', word: 'ひしひし', en: 'keenly (felt)', emoji: '💭', ex: '{縄文人|じょうもんじん}の {暮|く}らしの {知恵|ちえ}を ＿と {感|かん}じた。', exEn: 'I felt the wisdom of Jōmon life keenly.', wrong: ['ワンワン', 'ガチャン', 'さくさく'], from: 'sannai' },
  { id: 'jiwajiwa', word: 'じわじわ', en: 'little by little, gradually sinking in', emoji: '🌊', ex: '{古墳|こふん}の {大|おお}きさが ＿と {伝|つた}わって きた。', exEn: 'The enormity of the tomb mound slowly sank in.', wrong: ['ニャー', 'ガチャン', 'ぴかぴか'], from: 'sakai' },
  { id: 'zusshiri', word: 'ずっしり', en: 'heavy, weighty', emoji: '🎁', ex: 'おみやげの {箱|はこ}は ＿ {重|おも}かった。', exEn: 'The box of souvenirs was heavy.', wrong: ['ケロケロ', 'ワクワク', 'ぐっすり'], from: 'munakata' },
  { id: 'sukkari', word: 'すっかり', en: 'completely, thoroughly', emoji: '🌴', ex: '{島|しま}の {暮|く}らしが ＿ {気|き}に {入|い}った。', exEn: 'I have taken to island life completely.', wrong: ['ニャー', 'ザーザー', 'ガチャン'], from: 'amami' },
  { id: 'potsun', word: 'ぽつん', en: 'all alone, a lone dot', emoji: '🏝️', ex: '{海|うみ}の {上|うえ}に {小|ちい}さな {島|しま}が ＿と {浮|う}かんで いた。', exEn: 'A small island floated all alone on the sea.', wrong: ['ワンワン', 'ぺこぺこ', 'ねばねば'], from: 'izu' },
];
