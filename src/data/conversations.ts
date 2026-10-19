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
];
