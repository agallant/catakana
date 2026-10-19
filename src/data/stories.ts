/** Short graded reading passages. Text uses {kanji|kana} furigana markup; each has comprehension questions. */
export interface Story {
  id: string;
  title: string;
  emoji: string;
  /** stop id from which the story becomes available */
  from: string;
  /** paragraphs */
  text: string[];
  questions: { q: string; options: string[]; answer: number }[];
}

export const STORIES: Story[] = [
  {
    id: 'mochi-day', title: 'Mochi’s day', emoji: '🐱', from: 'nikko',
    text: [
      'わたしは モチです。ねこです。{毎日|まいにち} {六時|ろくじ}に {起|お}きます。',
      '{朝|あさ}ごはんに さかなを {食|た}べます。それから、{外|そと}で あそびます。',
      '{午後|ごご}は {日|ひ}の あたる まどの {前|まえ}で ねます。{夜|よる}は {早|はや}く ねます。',
    ],
    questions: [
      { q: 'What time does Mochi get up?', options: ['6:00', '7:00', '9:00'], answer: 0 },
      { q: 'What does Mochi eat for breakfast?', options: ['Fish', 'Bread', 'Rice'], answer: 0 },
      { q: 'Where does Mochi sleep in the afternoon?', options: ['In front of a sunny window', 'In a box', 'On the roof'], answer: 0 },
    ],
  },
  {
    id: 'station', title: 'At the station', emoji: '🚉', from: 'ise',
    text: [
      'きのう、{電車|でんしゃ}で いせへ {行|い}きました。{駅|えき}は とても {大|おお}きかったです。',
      '{右|みぎ}に きっぷうりばが ありました。{左|ひだり}に おみやげの {店|みせ}が ありました。',
      'わたしは きっぷを {買|か}って、{電車|でんしゃ}に のりました。{電車|でんしゃ}の {中|なか}で おべんとうを {食|た}べました。',
    ],
    questions: [
      { q: 'How did the writer travel to Ise?', options: ['By train', 'By bus', 'By plane'], answer: 0 },
      { q: 'What was on the left?', options: ['A souvenir shop', 'The ticket office', 'A hotel'], answer: 0 },
      { q: 'What did the writer eat on the train?', options: ['A boxed lunch', 'Ramen', 'Nothing'], answer: 0 },
    ],
  },
  {
    id: 'onsen-letter', title: 'A letter from Beppu', emoji: '✉️', from: 'beppu',
    text: [
      'おかあさんへ。{元気|げんき}ですか。わたしは いま べっぷに います。',
      'べっぷは おんせんが とても {多|おお}いです。{町|まち}の あちこちから ゆげが でています。',
      'あした、すなゆに {入|はい}りたいです。でも、あついのは ちょっと こわいです。また {手紙|てがみ}を {書|か}きます。',
    ],
    questions: [
      { q: 'Who is the letter to?', options: ['Mother', 'A teacher', 'A friend'], answer: 0 },
      { q: 'What comes out all over town?', options: ['Steam', 'Smoke from fires', 'Snow'], answer: 0 },
      { q: 'What does the writer want to try tomorrow?', options: ['A sand bath', 'Swimming in the sea', 'Climbing a mountain'], answer: 0 },
    ],
  },
  {
    id: 'hikonyan', title: 'The lucky cat of Hikone', emoji: '🏯', from: 'hikone',
    text: [
      'むかし、ある{殿様|とのさま}が {寺|てら}の {前|まえ}を {歩|ある}いていました。',
      'すると、{白|しろ}い ねこが {手|て}を ふって、{殿様|とのさま}を よびました。{殿様|とのさま}が {寺|てら}に {入|はい}ると、すぐに つよい {雨|あめ}が ふって、かみなりが おちました。',
      'ねこの おかげで {殿様|とのさま}は ぶじでした。それから、{手|て}を ふる ねこは しあわせを よぶと {言|い}われています。',
    ],
    questions: [
      { q: 'What did the white cat do?', options: ['Waved to call the lord', 'Ran away', 'Slept on the gate'], answer: 0 },
      { q: 'What happened after the lord entered the temple?', options: ['A storm with lightning came', 'The temple closed', 'He fell asleep'], answer: 0 },
      { q: 'What is the beckoning cat said to bring?', options: ['Happiness / good luck', 'Rain', 'Fish'], answer: 0 },
    ],
  },
  {
    id: 'snow-monkeys', title: 'Snow monkeys', emoji: '🐒', from: 'nagano',
    text: [
      'ながのの {山|やま}の {中|なか}に、おんせんに {入|はい}る さるが います。',
      'ふゆは とても さむいので、さるは あたたかい おゆに {入|はい}らなければ なりません。',
      'さるは おゆの {中|なか}で {目|め}を とじて、{気持|きも}ちよさそうに しています。{人間|にんげん}と {同|おな}じですね。',
    ],
    questions: [
      { q: 'Why do the monkeys get in the hot water?', options: ['Because winter is very cold', 'To catch fish', 'To wash their food'], answer: 0 },
      { q: 'How do the monkeys look in the water?', options: ['Comfortable', 'Scared', 'Angry'], answer: 0 },
      { q: 'Where do the monkeys live?', options: ['In the mountains of Nagano', 'In Tokyo', 'On an island'], answer: 0 },
    ],
  },
  {
    id: 'kawagoe-plan', title: 'Plans for next year', emoji: '🗓️', from: 'kawagoe',
    text: [
      'にほんに {来|き}て、もう {一年|いちねん}に なります。いろいろな {町|まち}に {行|い}きました。',
      'いちばん {楽|たの}しかったのは、とっとりの さきゅうで らくだに のったことです。',
      'らいねんは もっと {漢字|かんじ}を {勉強|べんきょう}する つもりです。そして、ほっかいどうの ちいさい {島|しま}にも {行|い}ってみたいです。',
    ],
    questions: [
      { q: 'How long has the writer been in Japan?', options: ['One year', 'One week', 'Ten years'], answer: 0 },
      { q: 'What was the most fun?', options: ['Riding a camel at the dunes', 'Eating ramen', 'Visiting a castle'], answer: 0 },
      { q: 'What does the writer plan to do next year?', options: ['Study more kanji', 'Go home', 'Buy a car'], answer: 0 },
    ],
  },
  {
    id: 'akabeko', title: 'The broken akabeko', emoji: '🐂', from: 'aizu',
    text: [
      'あいづで {赤|あか}べこを {買|か}いました。でも、ホテルに {帰|かえ}る とちゅうで おとして しまいました。',
      '{首|くび}が とれて、もう ゆれなく なって しまいました。とても ざんねんでした。',
      'つぎの {日|ひ}、おみせの おじいさんに {見|み}せると、すぐに なおして くれました。「これで また {幸|しあわ}せが くるはずだよ」と {言|い}われました。',
    ],
    questions: [
      { q: 'What happened to the akabeko?', options: ['It was dropped and broke', 'It was stolen', 'It got wet'], answer: 0 },
      { q: 'Who fixed it?', options: ['The old man at the shop', 'The hotel staff', 'Nobody'], answer: 0 },
      { q: 'What did the old man say would come again?', options: ['Happiness', 'Rain', 'The bus'], answer: 0 },
    ],
  },
  {
    id: 'wildcat-search', title: 'Looking for the wildcat', emoji: '🐆', from: 'iriomote',
    text: [
      'いりおもてじまに {着|つ}いた ばかりの {日|ひ}、やまねこを {探|さが}しに {行|い}きました。',
      'ガイドさんに よると、やまねこは {夜|よる}に うごくことが {多|おお}いらしいです。でも、{見|み}られることは ほとんど ないそうです。',
      'けっきょく やまねこには {会|あ}えませんでしたが、みちで「やまねこに {注意|ちゅうい}」という {看板|かんばん}を {見|み}つけました。それだけで うれしく なりました。',
    ],
    questions: [
      { q: 'When are the wildcats usually active?', options: ['At night', 'At noon', 'Only in winter'], answer: 0 },
      { q: 'Did the writer see a wildcat?', options: ['No', 'Yes, several', 'Yes, one'], answer: 0 },
      { q: 'What did the writer find on the road?', options: ['A “watch for wildcats” sign', 'A lost cat', 'A map'], answer: 0 },
    ],
  },
  {
    id: 'moving-castle', title: 'The castle that moved', emoji: '🏯', from: 'hirosaki',
    text: [
      '{弘前城|ひろさきじょう}の {天守|てんしゅ}は、{江戸|えど}{時代|じだい}から {残|のこ}っている {貴重|きちょう}な {建物|たてもの}です。',
      'ところが、{下|した}の {石垣|いしがき}が {外|そと}に ふくらんで きて、このままでは {崩|くず}れる おそれが ありました。',
      'そこで 2015{年|ねん}、{重|おも}さ 400トンの {天守|てんしゅ}を ジャッキで {持|も}ち{上|あ}げ、レールの {上|うえ}を {約|やく}70メートル {移動|いどう}させる ことに なりました。',
      '{工事|こうじ}の あいだも {観光客|かんこうきゃく}は {天守|てんしゅ}に {入|はい}る ことが できたそうです。{城|しろ}が {元|もと}の {場所|ばしょ}に {戻|もど}るのは、{石垣|いしがき}の {修理|しゅうり}が {終|お}わってからです。',
    ],
    questions: [
      { q: 'Why was the keep moved?', options: ['The stone wall below it might collapse', 'To make room for a road', 'To get a better view of the cherry trees'], answer: 0 },
      { q: 'How far was it moved?', options: ['About 70 m', 'About 7 m', 'About 700 m'], answer: 0 },
      { q: 'Could tourists visit during the work?', options: ['Yes', 'No', 'Only at night'], answer: 0 },
    ],
  },
  {
    id: 'battleship-diary', title: 'A diary from Battleship Island', emoji: '🏚️', from: 'gunkanjima',
    text: [
      'おじいさんは {子供|こども}の ころ、{軍艦島|ぐんかんじま}に {住|す}んで いました。{父親|ちちおや}が {炭鉱|たんこう}で {働|はたら}いて いたからです。',
      '{島|しま}は {狭|せま}いものの、{学校|がっこう}も {病院|びょういん}も {映画館|えいがかん}も ありました。{屋上|おくじょう}には {田|た}んぼまで あったそうです。',
      '{人口|じんこう}{密度|みつど}が {東京|とうきょう}の {九倍|きゅうばい}も あった ため、{部屋|へや}は とても {狭|せま}かったと いいます。',
      'しかし {石油|せきゆ}の {時代|じだい}に なると {炭鉱|たんこう}は {閉山|へいざん}し、{島|しま}は {無人島|むじんとう}に なりました。「{寂|さび}しいけれど、{大切|たいせつ}な {思|おも}い{出|で}だ」と おじいさんは {言|い}います。',
    ],
    questions: [
      { q: 'Why did the grandfather live on the island?', options: ['His father worked in the coal mine', 'He was a fisherman', 'He was a teacher there'], answer: 0 },
      { q: 'What was surprisingly found on a rooftop?', options: ['A rice paddy', 'A swimming pool', 'A shrine'], answer: 0 },
      { q: 'Why did the island become empty?', options: ['The mine closed when oil replaced coal', 'A typhoon destroyed it', 'It became a military base'], answer: 0 },
    ],
  },
  {
    id: 'konpira-dog', title: 'The pilgrim dog', emoji: '🐕', from: 'kotohira',
    text: [
      '{江戸|えど}{時代|じだい}、こんぴらさんへの お{参|まい}りは {多|おお}くの {人|ひと}の {夢|ゆめ}でした。でも、{遠|とお}くに {住|す}む {人|ひと}や {病気|びょうき}の {人|ひと}は {旅|たび}に {出|で}られません。',
      'そこで、{飼|か}い{主|ぬし}の かわりに {犬|いぬ}が {旅|たび}を する ことが ありました。{首|くび}に お{金|かね}と {名前|なまえ}を {書|か}いた {袋|ふくろ}を つけて {出発|しゅっぱつ}したのです。',
      '{道|みち}で {会|あ}った {旅人|たびびと}たちは {犬|いぬ}に {食|た}べ{物|もの}を あげたり、{次|つぎ}の {町|まち}まで つれて {行|い}ったり しました。',
      'みんなの おかげで、{犬|いぬ}は お{札|ふだ}を もらって {無事|ぶじ}に {家|いえ}へ {帰|かえ}る ことが できたそうです。',
    ],
    questions: [
      { q: 'Why did dogs make the pilgrimage?', options: ['In place of owners who could not travel', 'To guard the shrine', 'To deliver letters'], answer: 0 },
      { q: 'What did the dog carry around its neck?', options: ['A bag with money and a name', 'A bell', 'A map'], answer: 0 },
      { q: 'How did the dog get home?', options: ['Thanks to help from travellers', 'By boat alone', 'Its owner came to fetch it'], answer: 0 },
    ],
  },
  {
    id: 'kumano-walk', title: 'Walking the Kumano Kodō', emoji: '🥾', from: 'kumano',
    text: [
      '{朝|あさ}{早|はや}く {宿|やど}を {出|で}て、{古道|こどう}を {歩|ある}き{始|はじ}めました。{杉|すぎ}の {森|もり}の {中|なか}は しずかで、{苔|こけ}の {石段|いしだん}が つづいて います。',
      '{途中|とちゅう}で {雨|あめ}が {降|ふ}り{出|だ}しました。{道|みち}が すべりやすく なったにも かかわらず、{休|やす}まずに {進|すす}もうと しました。',
      'すると、{後|うし}ろから {来|き}た おばあさんが「{急|いそ}がないで。{熊野|くまの}の {道|みち}は ゆっくり {歩|ある}く ものですよ」と {言|い}いました。',
      'おばあさんと いっしょに {休憩|きゅうけい}しながら {歩|ある}いた おかげで、{那智|なち}の {滝|たき}に {着|つ}いた ときも {元気|げんき}でした。{滝|たき}の {音|おと}を {聞|き}いて、{来|き}て よかったと {思|おも}いました。',
    ],
    questions: [
      { q: 'What happened partway along the trail?', options: ['It started to rain', 'The writer got lost', 'A bear appeared'], answer: 0 },
      { q: 'What did the old woman advise?', options: ['Don’t hurry — walk slowly', 'Turn back now', 'Take the bus'], answer: 0 },
      { q: 'How did the writer feel at Nachi Falls?', options: ['Glad to have come, and still energetic', 'Exhausted and cold', 'Disappointed'], answer: 0 },
    ],
  },
];
