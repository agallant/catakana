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
  {
    id: 'change', from: 44, title: 'Getting better',
    lines: [
      { who: 'npc', jp: 'にほんごが じょうずに なりましたね。', en: 'Your Japanese has gotten good.' },
      { who: 'me', jp: 'ありがとう！ かんじも すこし よめるように なりました。', en: 'Thanks! I can read a few kanji now too.' },
      { who: 'npc', jp: 'すごい！', en: 'Amazing!' },
    ],
    q: 'What can your cat do now?', options: ['Read some kanji', 'Drive a car', 'Speak French'], answer: 0,
  },
  {
    id: 'purpose', from: 45, title: 'Why are you here?',
    lines: [
      { who: 'npc', jp: 'どうして ぐじょうに きたんですか。', en: 'Why did you come to Gujo?' },
      { who: 'me', jp: 'おどりに さんかする ために きました。', en: 'I came to take part in the dance.' },
      { who: 'npc', jp: 'こんやは あさまで おどりますよ！', en: 'Tonight we dance until morning!' },
    ],
    q: 'Until when will they dance tonight?', options: ['Until morning', 'Until 9 pm', 'They won’t dance'], answer: 0,
  },
  {
    id: 'hearsay', from: 47, title: 'Weather news',
    lines: [
      { who: 'me', jp: 'あしたも ゆきですか。', en: 'Will it snow tomorrow too?' },
      { who: 'npc', jp: 'てんきよほうに よると、はれるそうです。', en: 'According to the forecast, it will be sunny.' },
      { who: 'me', jp: 'よかった！ ゆきの かべを みに いけますね。', en: 'Great! We can go see the snow walls.' },
    ],
    q: 'What does the forecast say?', options: ['It will be sunny', 'It will snow', 'It will rain'], answer: 0,
  },
  {
    id: 'oops', from: 49, title: 'Oops!',
    lines: [
      { who: 'npc', jp: 'どうしたんですか。', en: 'What happened?' },
      { who: 'me', jp: 'あかべこを おとして、こわして しまいました…', en: 'I dropped the akabeko and broke it…' },
      { who: 'npc', jp: 'だいじょうぶ。あたらしいのを あげますよ。', en: 'It’s okay. I’ll give you a new one.' },
    ],
    q: 'What happened to the akabeko?', options: ['It broke', 'It ran away', 'It was sold'], answer: 0,
  },
  {
    id: 'expect', from: 51, title: 'Bear watch',
    lines: [
      { who: 'me', jp: 'くまは どこに いますか。', en: 'Where are the bears?' },
      { who: 'npc', jp: 'いまは ふゆだから、ねている はずです。', en: 'It’s winter now, so they should be sleeping.' },
      { who: 'me', jp: 'じゃあ、わしを さがしましょう。', en: 'Then let’s look for eagles.' },
    ],
    q: 'Why aren’t the bears around?', options: ['They should be hibernating', 'They moved away', 'They are eating'], answer: 0,
  },
  {
    id: 'passive', from: 53, title: 'Festival trouble',
    lines: [
      { who: 'npc', jp: 'きのう、ねこに さかなを ぬすまれました！', en: 'Yesterday my fish was stolen by a cat!' },
      { who: 'me', jp: 'え、わたしじゃ ありませんよ！', en: 'Hey, it wasn’t me!' },
      { who: 'npc', jp: 'ほんとう？ ひげに なにか ついていますよ。', en: 'Really? Something’s stuck to your whiskers.' },
    ],
    q: 'What was stolen?', options: ['A fish', 'A drum', 'A hat'], answer: 0,
  },
  {
    id: 'wildcat', from: 55, title: 'The wildcat',
    lines: [
      { who: 'me', jp: 'やまねこに あいたいです！', en: 'I want to meet a wildcat!' },
      { who: 'npc', jp: 'わたしも ずっと さがしているけど、まだ みたことが ないんです。', en: 'I’ve been searching for ages too, but I’ve never seen one.' },
      { who: 'me', jp: 'めずらしいから、だいじに しないと いけませんね。', en: 'They’re rare, so we have to take good care of them.' },
    ],
    q: 'Has the local cat seen a wildcat?', options: ['Never', 'Every day', 'Once last week'], answer: 0,
  },
  {
    id: 'castle-move', from: 56, title: 'The moving castle',
    lines: [
      { who: 'me', jp: 'え、おしろが うごいたんですか？', en: 'What, the castle moved?' },
      { who: 'npc', jp: 'ええ。いしがきを なおす ために、70メートル いどうしたんです。', en: 'Yes. It was moved 70 metres so the stone walls could be fixed.' },
      { who: 'me', jp: 'だから いちが ちがう わけですね。', en: 'So that’s why it’s in a different spot.' },
    ],
    q: 'Why was the castle moved?', options: ['To repair the stone walls', 'For a festival', 'It was sold'], answer: 0,
  },
  {
    id: 'island-tour', from: 58, title: 'Can we land?',
    lines: [
      { who: 'me', jp: 'きょうは しまに あがれますか。', en: 'Can we land on the island today?' },
      { who: 'npc', jp: 'なみに よって ちがいます。きょうは なみが たかいので、むずかしいかも しれません。', en: 'It depends on the waves. They’re high today, so it might be hard.' },
      { who: 'me', jp: 'ざんねんですが、ふねから みるだけでも いいです。', en: 'That’s a shame, but just seeing it from the boat is fine.' },
    ],
    q: 'What decides whether you can land?', options: ['The waves', 'The day of the week', 'The ticket price'], answer: 0,
  },
  {
    id: 'kiln', from: 59, title: 'At the kiln',
    lines: [
      { who: 'npc', jp: 'このさらは さんかいも やいたんですよ。', en: 'This plate was fired three times, you know.' },
      { who: 'me', jp: 'こんなに うすいのに、つよいですね。', en: 'It’s so thin, yet strong.' },
      { who: 'npc', jp: 'むかしは ヨーロッパへ ゆしゅつ していました。おうさまに たいへん にんきでしたよ。', en: 'Long ago it was exported to Europe. Kings loved it.' },
    ],
    q: 'Who bought Arita porcelain long ago?', options: ['European kings', 'Chinese farmers', 'American sailors'], answer: 0,
  },
  {
    id: 'steps', from: 62, title: 'Too many steps',
    lines: [
      { who: 'me', jp: 'はあ、はあ…まだ つかないんですか。', en: 'Huff, huff… aren’t we there yet?' },
      { who: 'npc', jp: 'あと 300だん ありますよ。でも ちょうじょうの けしきは さいこうに ちがいない！', en: 'Another 300 steps. But the view from the top must be the best!' },
      { who: 'me', jp: 'じゃあ、がんばって のぼる ことに します。', en: 'Then I’ll decide to keep climbing.' },
    ],
    q: 'How many steps are left?', options: ['300', '30', '3,000'], answer: 0,
  },
  {
    id: 'new-job', from: 63, title: 'A new job',
    lines: [
      { who: 'npc', jp: 'じつは らいげつから くらしきで はたらく ことに なったんです。', en: 'Actually, it’s been decided I’ll work in Kurashiki from next month.' },
      { who: 'me', jp: 'おめでとう！ どんな しごとですか。', en: 'Congratulations! What kind of job?' },
      { who: 'npc', jp: 'ジーンズを つくる しごとです。ちいさい ころからの ゆめでした。', en: 'Making jeans. It’s been my dream since I was little.' },
    ],
    q: 'What will the cat make?', options: ['Jeans', 'Pottery', 'Udon'], answer: 0,
  },
  {
    id: 'trail', from: 66, title: 'On the old trail',
    lines: [
      { who: 'me', jp: 'ちずを みずに あるいて きました。', en: 'I walked here without looking at the map.' },
      { who: 'npc', jp: 'あぶないですよ！ みちしるべを よく みて くださいね。', en: 'That’s dangerous! Watch the signposts carefully.' },
      { who: 'me', jp: 'やたがらすが みちを おしえて くれたんです。', en: 'Yatagarasu showed me the way.' },
    ],
    q: 'What did the traveller walk without?', options: ['Looking at a map', 'Shoes', 'Water'], answer: 0,
  },
  {
    id: 'homecoming', from: 67, title: 'Back in Tokyo',
    lines: [
      { who: 'npc', jp: 'ひさしぶり！ にほんごが ぺらぺらに なりましたね。', en: 'Long time no see! Your Japanese is fluent now.' },
      { who: 'me', jp: 'たいへんだったにも かかわらず、たのしい たびでした。', en: 'Despite being tough, it was a fun trip.' },
      { who: 'npc', jp: 'みんなの おかげですね。つぎは どこへ いきますか。', en: 'Thanks to everyone, right? Where will you go next?' },
    ],
    q: 'How was the trip?', options: ['Tough but fun', 'Boring', 'Too short'], answer: 0,
  },
  {
    id: 'ferry', from: 68, title: 'Twenty-four hours at sea',
    lines: [
      { who: 'npc', jp: 'いっしゅうかんに いちびんしか ない とあって、ふねは まんいんでした。', en: 'With only one ferry a week, the ship was full.' },
      { who: 'me', jp: 'それでも くる かちが ありました。くじらが みえましたから！', en: 'Still, it was worth coming. I saw whales!' },
      { who: 'npc', jp: 'ここならではの けしきですね。', en: 'A view you can only get here.' },
    ],
    q: 'Why was the ferry full?', options: ['There is only one sailing a week', 'It was a holiday', 'It was free'], answer: 0,
  },
  {
    id: 'kappa', from: 69, title: 'Kappa fishing',
    lines: [
      { who: 'me', jp: 'きゅうりで かっぱが つれるって ほんとうですか。', en: 'Is it true you can catch a kappa with a cucumber?' },
      { who: 'npc', jp: 'さあ。でも、とおのの ひとは みんな しんじて いますよ。', en: 'Who knows. But everyone in Tōno believes it.' },
      { who: 'me', jp: 'それなら、ためさずには いられませんね。', en: 'In that case, I can’t help but try.' },
    ],
    q: 'What bait is used for kappa?', options: ['A cucumber', 'A fish', 'Rice balls'], answer: 0,
  },
  {
    id: 'zen-morning', from: 71, title: 'Morning at the temple',
    lines: [
      { who: 'npc', jp: 'あさ さんじはんに おきざるを えないのは たいへんです。', en: 'Having no choice but to get up at 3:30 is hard.' },
      { who: 'me', jp: 'ねこには むりかも しれません…', en: 'That might be impossible for a cat…' },
      { who: 'npc', jp: 'でも、しずかな あさの ざぜんは すばらしいですよ。', en: 'But quiet morning zazen is wonderful.' },
    ],
    q: 'What time do the monks get up?', options: ['3:30', '5:30', '7:00'], answer: 0,
  },
  {
    id: 'battle', from: 72, title: 'The turning point',
    lines: [
      { who: 'me', jp: 'たたかいは なんにち つづいたんですか。', en: 'How many days did the battle last?' },
      { who: 'npc', jp: 'たった いちにちです。うらぎりが あった ことが おおきかったと いわれて います。', en: 'Just one day. It’s said that the betrayals made a big difference.' },
      { who: 'me', jp: 'その ひを さかいに、へいわな じだいが はじまったんですね。', en: 'So from that day on, a peaceful era began.' },
    ],
    q: 'How long did the battle last?', options: ['One day', 'One month', 'One year'], answer: 0,
  },
  {
    id: 'secret-island', from: 75, title: 'The secret island',
    lines: [
      { who: 'me', jp: 'おきのしまには いけますか。', en: 'Can I go to Okinoshima?' },
      { who: 'npc', jp: 'いまは いっぱんの ひとは じょうりく できません。とおくから おがむ ことに なって います。', en: 'Ordinary people can’t land now. We worship it from afar.' },
      { who: 'me', jp: 'わかりました。しまの ひみつは まもるべき ですね。', en: 'I understand. The island’s secrets should be kept.' },
    ],
    q: 'How do people worship Okinoshima today?', options: ['From a distance', 'By swimming there', 'By climbing it'], answer: 0,
  },
  {
    id: 'rabbit', from: 77, title: 'Night drive',
    lines: [
      { who: 'npc', jp: 'よるの もりでは、あまみの くろうさぎに あえる かも しれません。', en: 'In the forest at night, you might meet an Amami rabbit.' },
      { who: 'me', jp: 'うさぎを まもるべく、ゆっくり はしりましょう。', en: 'Let’s drive slowly to protect the rabbits.' },
      { who: 'npc', jp: 'あ、みて！ みちの はしに いますよ！', en: 'Oh, look! There’s one at the side of the road!' },
    ],
    q: 'Why drive slowly?', options: ['To protect the rabbits', 'Because of fog', 'To save fuel'], answer: 0,
  },
  {
    id: 'home', from: 79, title: 'Welcome home',
    lines: [
      { who: 'npc', jp: 'おかえりなさい。ずいぶん とおくまで いきましたね。', en: 'Welcome back. You went a really long way.' },
      { who: 'me', jp: 'はい。あめであれ ゆきであれ、たのしい たびでした。', en: 'Yes. Rain or snow, it was a fun journey.' },
      { who: 'npc', jp: 'あなたの これからの たびを おうえんして やみません。', en: 'I will always cheer on your journeys to come.' },
    ],
    q: 'Who welcomes you home at Gōtoku-ji?', options: ['Maneki', 'Kappa', 'Ieyasu'], answer: 0,
  },
];
