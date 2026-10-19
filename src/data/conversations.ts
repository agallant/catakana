/** Short spoken dialogues for listening comprehension. `me` is your cat, `npc` the local cat. */
export interface Line {
  who: 'me' | 'npc';
  jp: string;
  en: string;
}

export interface Conversation {
  id: string;
  /** stop index from which it is available */
  from: number;
  title: string;
  lines: Line[];
  q: string;
  options: string[];
  answer: number;
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'greet', from: 0, title: 'Meeting a cat',
    lines: [
      { who: 'npc', jp: 'こんにちは！', en: 'Hello!' },
      { who: 'me', jp: 'こんにちは！', en: 'Hello!' },
      { who: 'npc', jp: 'ようこそ！', en: 'Welcome!' },
      { who: 'me', jp: 'ありがとう！', en: 'Thanks!' },
    ],
    q: 'What did the local cat say after “hello”?', options: ['Welcome!', 'Goodbye!', 'Good night!'], answer: 0,
  },
  {
    id: 'morning', from: 2, title: 'Morning at the inn',
    lines: [
      { who: 'npc', jp: 'おはようございます。', en: 'Good morning.' },
      { who: 'me', jp: 'おはよう！ さむいね。', en: 'Morning! It’s cold, huh.' },
      { who: 'npc', jp: 'はい、さむいです。おちゃを どうぞ。', en: 'Yes, it’s cold. Have some tea.' },
    ],
    q: 'What does the inn cat offer?', options: ['Tea', 'Sushi', 'A blanket'], answer: 0,
  },
  {
    id: 'sushi', from: 6, title: 'At the sushi counter',
    lines: [
      { who: 'npc', jp: 'いらっしゃいませ！', en: 'Welcome (to the shop)!' },
      { who: 'me', jp: 'すみません、さかなを ください。', en: 'Excuse me, fish please.' },
      { who: 'npc', jp: 'はい、どうぞ。', en: 'Here you go.' },
      { who: 'me', jp: 'おいしい！ ありがとう！', en: 'Delicious! Thanks!' },
    ],
    q: 'What did your cat order?', options: ['Fish', 'Meat', 'Ramen'], answer: 0,
  },
  {
    id: 'lost', from: 10, title: 'Asking the way',
    lines: [
      { who: 'me', jp: 'すみません、えきは どこですか。', en: 'Excuse me, where is the station?' },
      { who: 'npc', jp: 'えきは あそこです。', en: 'The station is over there.' },
      { who: 'me', jp: 'ありがとうございます！', en: 'Thank you very much!' },
    ],
    q: 'What was your cat looking for?', options: ['The station', 'The toilet', 'A hotel'], answer: 0,
  },
  {
    id: 'ramen', from: 13, title: 'Ramen stall',
    lines: [
      { who: 'npc', jp: 'ラーメン、ひとつ？', en: 'One ramen?' },
      { who: 'me', jp: 'はい、ひとつ ください。 ミルクも！', en: 'Yes, one please. Milk too!' },
      { who: 'npc', jp: 'ミルクは ありません。おちゃは？', en: 'We don’t have milk. Tea?' },
      { who: 'me', jp: 'じゃあ、おちゃを ください。', en: 'Then tea, please.' },
    ],
    q: 'What does your cat drink in the end?', options: ['Tea', 'Milk', 'Water'], answer: 0,
  },
  {
    id: 'intro', from: 20, title: 'Self-introduction',
    lines: [
      { who: 'npc', jp: 'はじめまして。わたしは イカです。', en: 'Nice to meet you. I’m Ika.' },
      { who: 'me', jp: 'はじめまして。あなたは がくせいですか。', en: 'Nice to meet you. Are you a student?' },
      { who: 'npc', jp: 'いいえ、せんせいです。', en: 'No, I’m a teacher.' },
    ],
    q: 'What is Ika’s job?', options: ['Teacher', 'Student', 'Doctor'], answer: 0,
  },
  {
    id: 'whose', from: 21, title: 'Lost and found',
    lines: [
      { who: 'npc', jp: 'これは だれの かさですか。', en: 'Whose umbrella is this?' },
      { who: 'me', jp: 'あっ、わたしの かさです！', en: 'Oh, it’s my umbrella!' },
      { who: 'npc', jp: 'はい、どうぞ。', en: 'Here you are.' },
    ],
    q: 'Whose umbrella was it?', options: ['Your cat’s', 'The teacher’s', 'Nobody’s'], answer: 0,
  },
  {
    id: 'weather', from: 22, title: 'Small talk',
    lines: [
      { who: 'npc', jp: 'きょうは さむいですね。', en: 'It’s cold today, isn’t it.' },
      { who: 'me', jp: 'はい。でも ゆきは きれいです。', en: 'Yes. But the snow is pretty.' },
      { who: 'npc', jp: 'そうですね。', en: 'That’s true.' },
    ],
    q: 'What does your cat think is pretty?', options: ['The snow', 'The sea', 'The flowers'], answer: 0,
  },
  {
    id: 'schedule', from: 23, title: 'Plans for tomorrow',
    lines: [
      { who: 'npc', jp: 'あした なにを しますか。', en: 'What will you do tomorrow?' },
      { who: 'me', jp: 'あさ ろくじに おきます。それから おんせんに いきます。', en: 'I’ll get up at six. Then I’ll go to a hot spring.' },
      { who: 'npc', jp: 'いいですね！', en: 'Sounds nice!' },
    ],
    q: 'What time will your cat wake up?', options: ['6:00', '7:00', '9:00'], answer: 0,
  },
  {
    id: 'breakfast', from: 24, title: 'Breakfast',
    lines: [
      { who: 'npc', jp: 'あさごはんに なにを たべますか。', en: 'What do you eat for breakfast?' },
      { who: 'me', jp: 'パンを たべます。あなたは？', en: 'I eat bread. And you?' },
      { who: 'npc', jp: 'わたしは ごはんと さかなを たべます。', en: 'I eat rice and fish.' },
    ],
    q: 'What does the local cat eat for breakfast?', options: ['Rice and fish', 'Bread', 'Cake'], answer: 0,
  },
  {
    id: 'shopping', from: 26, title: 'At the market',
    lines: [
      { who: 'me', jp: 'この りんごは いくらですか。', en: 'How much is this apple?' },
      { who: 'npc', jp: 'ひゃくえんです。', en: 'It’s 100 yen.' },
      { who: 'me', jp: 'じゃあ、みっつ ください。', en: 'Then three, please.' },
      { who: 'npc', jp: 'さんびゃくえんです。', en: 'That’s 300 yen.' },
    ],
    q: 'How much does your cat pay?', options: ['300 yen', '100 yen', '3,000 yen'], answer: 0,
  },
  {
    id: 'train', from: 27, title: 'On the platform',
    lines: [
      { who: 'me', jp: 'すみません、この でんしゃは いせへ いきますか。', en: 'Excuse me, does this train go to Ise?' },
      { who: 'npc', jp: 'いいえ。つぎの でんしゃに のって ください。', en: 'No. Please take the next train.' },
      { who: 'me', jp: 'わかりました。ありがとうございます。', en: 'Understood. Thank you.' },
    ],
    q: 'Which train should your cat take?', options: ['The next one', 'This one', 'A bus instead'], answer: 0,
  },
  {
    id: 'where', from: 28, title: 'Where is the cat?',
    lines: [
      { who: 'npc', jp: 'ねこは どこに いますか。', en: 'Where is the cat?' },
      { who: 'me', jp: 'はこの なかに います。', en: 'It’s inside the box.' },
      { who: 'npc', jp: 'ああ、ほんとうだ！', en: 'Oh, it really is!' },
    ],
    q: 'Where is the cat?', options: ['In the box', 'Under the bed', 'On the desk'], answer: 0,
  },
  {
    id: 'yesterday', from: 29, title: 'What did you do?',
    lines: [
      { who: 'npc', jp: 'きのう なにを しましたか。', en: 'What did you do yesterday?' },
      { who: 'me', jp: 'うみで およぎました。でも さかなは たべませんでした。', en: 'I swam in the sea. But I didn’t eat fish.' },
      { who: 'npc', jp: 'えっ、ねこなのに？', en: 'What, even though you’re a cat?' },
    ],
    q: 'What did your cat NOT do yesterday?', options: ['Eat fish', 'Swim', 'Go to the sea'], answer: 0,
  },
  {
    id: 'want', from: 30, title: 'Hot spring plans',
    lines: [
      { who: 'npc', jp: 'なにを したいですか。', en: 'What do you want to do?' },
      { who: 'me', jp: 'おんせんに はいりたいです。でも あついのは ちょっと…', en: 'I want to get in a hot spring. But hot ones are a bit…' },
      { who: 'npc', jp: 'すなゆは どうですか。', en: 'How about a sand bath?' },
    ],
    q: 'What does the local cat suggest?', options: ['A sand bath', 'A cold shower', 'Going home'], answer: 0,
  },
  {
    id: 'please', from: 31, title: 'In the forest',
    lines: [
      { who: 'npc', jp: 'ちょっと まって ください。', en: 'Please wait a moment.' },
      { who: 'me', jp: 'どうしましたか。', en: 'What’s wrong?' },
      { who: 'npc', jp: 'あの きを みて ください。とても ふるいです。', en: 'Please look at that tree. It’s very old.' },
    ],
    q: 'What does the local cat want you to look at?', options: ['An old tree', 'A deer', 'The sea'], answer: 0,
  },
  {
    id: 'hikonyan', from: 32, title: 'Meeting Hikonyan',
    lines: [
      { who: 'me', jp: 'なにを していますか。', en: 'What are you doing?' },
      { who: 'npc', jp: 'おしろの まえで、みんなを まっています。', en: 'I’m waiting for everyone in front of the castle.' },
      { who: 'me', jp: 'かぶとが かわいいですね！', en: 'Your helmet is cute!' },
    ],
    q: 'Where is the local cat waiting?', options: ['In front of the castle', 'At the station', 'By the lake'], answer: 0,
  },
  {
    id: 'temple-rules', from: 33, title: 'Temple rules',
    lines: [
      { who: 'me', jp: 'すみません、ここで しゃしんを とっても いいですか。', en: 'Excuse me, may I take photos here?' },
      { who: 'npc', jp: 'そとは いいですが、なかで とっては いけません。', en: 'Outside is fine, but you must not take them inside.' },
      { who: 'me', jp: 'わかりました。', en: 'Understood.' },
    ],
    q: 'Where are photos NOT allowed?', options: ['Inside', 'Outside', 'Anywhere — all fine'], answer: 0,
  },
  {
    id: 'experience', from: 34, title: 'Have you ever…?',
    lines: [
      { who: 'npc', jp: 'おてらに とまったことが ありますか。', en: 'Have you ever stayed at a temple?' },
      { who: 'me', jp: 'いいえ、ありません。でも おんせんには なんども とまりました。', en: 'No, never. But I’ve stayed at hot-spring inns many times.' },
      { who: 'npc', jp: 'じゃあ、こんやは ここに とまりましょう。', en: 'Then let’s stay here tonight.' },
    ],
    q: 'Has your cat stayed at a temple before?', options: ['No, never', 'Yes, many times', 'Once'], answer: 0,
  },
  {
    id: 'compare', from: 35, title: 'Which is better?',
    lines: [
      { who: 'me', jp: 'ももと ぶどうと、どちらが すきですか。', en: 'Which do you like better, peaches or grapes?' },
      { who: 'npc', jp: 'ぶどうより ももの ほうが すきです。', en: 'I like peaches more than grapes.' },
      { who: 'npc', jp: 'くだものの なかで ももが いちばん おいしいです！', en: 'Of all fruits, peaches are the most delicious!' },
    ],
    q: 'Which fruit does the local cat like best?', options: ['Peaches', 'Grapes', 'Apples'], answer: 0,
  },
  {
    id: 'weekend', from: 36, title: 'Weekend at the dunes',
    lines: [
      { who: 'npc', jp: 'しゅうまつ、なにを しましたか。', en: 'What did you do on the weekend?' },
      { who: 'me', jp: 'さきゅうで はしったり、らくだに のったり しました。', en: 'I ran on the dunes, rode a camel, and so on.' },
      { who: 'npc', jp: 'たのしそうですね！', en: 'Sounds fun!' },
    ],
    q: 'What did your cat ride?', options: ['A camel', 'A horse', 'A bus'], answer: 0,
  },
  {
    id: 'opinion', from: 37, title: 'What do you think?',
    lines: [
      { who: 'npc', jp: 'あしたの てんきは どうだと おもいますか。', en: 'What do you think tomorrow’s weather will be?' },
      { who: 'me', jp: 'あめだと おもいます。そらが くらいですから。', en: 'I think it’ll rain, because the sky is dark.' },
      { who: 'npc', jp: 'じゃあ、かさを もっていきましょう。', en: 'Then let’s take umbrellas.' },
    ],
    q: 'Why does your cat think it will rain?', options: ['The sky is dark', 'The TV said so', 'Its tail hurts'], answer: 0,
  },
  {
    id: 'can', from: 38, title: 'Climbing the keep',
    lines: [
      { who: 'me', jp: 'てんしゅに のぼる ことが できますか。', en: 'Can we climb the castle keep?' },
      { who: 'npc', jp: 'はい、できます。でも かいだんが とても きゅうですよ。', en: 'Yes, you can. But the stairs are very steep.' },
      { who: 'me', jp: 'ねこだから だいじょうぶです！', en: 'I’m a cat, so I’m fine!' },
    ],
    q: 'What warning does the local cat give?', options: ['The stairs are steep', 'It is closed', 'It costs a lot'], answer: 0,
  },
  {
    id: 'must', from: 39, title: 'Early start',
    lines: [
      { who: 'npc', jp: 'あしたは ごじに おきなければ なりません。', en: 'Tomorrow we must get up at five.' },
      { who: 'me', jp: 'えっ、どうしてですか。', en: 'What? Why?' },
      { who: 'npc', jp: 'あさの さるを みに いくからです。', en: 'Because we’re going to see the monkeys in the morning.' },
    ],
    q: 'Why must they get up early?', options: ['To see the monkeys', 'To catch a plane', 'To do homework'], answer: 0,
  },
  {
    id: 'plans', from: 43, title: 'Next year',
    lines: [
      { who: 'npc', jp: 'らいねんは なにを する つもりですか。', en: 'What do you plan to do next year?' },
      { who: 'me', jp: 'もっと かんじを べんきょうする つもりです。N3を めざします！', en: 'I plan to study more kanji. I’m aiming for N3!' },
      { who: 'npc', jp: 'がんばってください！', en: 'Good luck!' },
    ],
    q: 'What is your cat aiming for next?', options: ['N3', 'A new house', 'A nap'], answer: 0,
  },
];
