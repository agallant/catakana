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
];
