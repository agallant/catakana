/**
 * Role-play scenes: the other cat speaks, you pick (or say) the natural reply.
 * Wrong replies teach something: wrong meaning, wrong politeness, or a classic mix-up.
 */
export interface Reply {
  jp: string;
  en: string;
  ok: boolean;
  /** shown when picked: why it's right or what went wrong */
  why: string;
}

export interface Turn {
  npc: string;
  en: string;
  replies: Reply[];
}

export interface Scene {
  id: string;
  title: string;
  emoji: string;
  /** stop id from which the scene appears */
  from: string;
  /** who you are talking to */
  role: string;
  turns: Turn[];
}

const R = (jp: string, en: string, ok: boolean, why: string): Reply => ({ jp, en, ok, why });

export const SCENES: Scene[] = [
  {
    id: 'konbini', title: 'At the konbini', emoji: '🏪', from: 'hakodate', role: 'Shop clerk',
    turns: [
      {
        npc: 'いらっしゃいませ。', en: 'Welcome!',
        replies: [
          R('（えしゃくする）', '(give a small nod)', true, 'Customers don’t answer いらっしゃいませ — a nod or nothing is normal.'),
          R('いらっしゃいませ。', 'Welcome!', false, 'That’s the shop’s line, not the customer’s.'),
          R('さようなら。', 'Goodbye.', false, 'You just arrived!'),
        ],
      },
      {
        npc: 'おべんとう、あたためますか。', en: 'Shall I heat up your bento?',
        replies: [
          R('はい、おねがいします。', 'Yes, please.', true, 'おねがいします is the polite way to accept.'),
          R('はい、ごちそうさまでした。', 'Yes, thanks for the meal.', false, 'ごちそうさま is said after eating.'),
          R('いいえ、いただきます。', 'No, let’s eat.', false, 'いただきます is said before eating, not to a clerk.'),
        ],
      },
      {
        npc: 'ふくろは ごりようですか。', en: 'Would you like a bag?',
        replies: [
          R('いいえ、だいじょうぶです。', 'No, I’m fine.', true, 'だいじょうぶです is a soft, natural “no thanks”.'),
          R('いいえ、だいじょうぶじゃないです。', 'No, I’m not OK.', false, 'That sounds like you’re unwell!'),
          R('はい、ふくろです。', 'Yes, it is a bag.', false, 'That describes the bag instead of answering.'),
        ],
      },
    ],
  },
  {
    id: 'ramen-order', title: 'Ordering ramen', emoji: '🍜', from: 'sapporo', role: 'Ramen chef',
    turns: [
      {
        npc: 'なんめいさまですか。', en: 'How many people?',
        replies: [
          R('ひとりです。', 'Just one.', true, 'ひとり = one person.'),
          R('いちにんです。', '(wrong counter)', false, 'One person is ひとり, not いちにん.'),
          R('ひとつです。', 'One thing.', false, 'ひとつ counts things, not people.'),
        ],
      },
      {
        npc: 'ごちゅうもんは？', en: 'Your order?',
        replies: [
          R('みそラーメンを ください。', 'Miso ramen, please.', true, '〜を ください is the classic way to order.'),
          R('みそラーメンが すきです。', 'I like miso ramen.', false, 'True, but it isn’t an order.'),
          R('みそラーメンを たべました。', 'I ate miso ramen.', false, 'Past tense — you haven’t eaten yet!'),
        ],
      },
      {
        npc: 'おまたせしました。', en: 'Sorry to keep you waiting.',
        replies: [
          R('いただきます！', 'Let’s eat!', true, 'Say いただきます before you start eating.'),
          R('ごちそうさまでした！', 'Thanks for the meal!', false, 'Save that for when you’ve finished.'),
          R('おまたせしました。', 'Sorry to keep you waiting.', false, 'That’s the chef’s line.'),
        ],
      },
    ],
  },
  {
    id: 'ticket', title: 'Buying a train ticket', emoji: '🎫', from: 'nikko', role: 'Station staff',
    turns: [
      {
        npc: 'どちらまで ですか。', en: 'Where to?',
        replies: [
          R('にっこうまで おねがいします。', 'To Nikko, please.', true, '〜まで = as far as; perfect for tickets.'),
          R('にっこうから きました。', 'I came from Nikko.', false, 'から is “from”; they asked where you’re going.'),
          R('にっこうは きれいです。', 'Nikko is pretty.', false, 'Nice, but not an answer.'),
        ],
      },
      {
        npc: 'かたみち ですか、おうふく ですか。', en: 'One way or round trip?',
        replies: [
          R('おうふくで おねがいします。', 'Round trip, please.', true, '〜で おねがいします picks one option politely.'),
          R('はい、そうです。', 'Yes, that’s right.', false, 'It was an either/or question — pick one.'),
          R('いいえ、けっこうです。', 'No, thank you.', false, 'That refuses the ticket altogether.'),
        ],
      },
      {
        npc: 'つぎの でんしゃは なんじ ですか、と ききたい ときは？', en: 'How do you ask what time the next train is?',
        replies: [
          R('つぎの でんしゃは なんじですか。', 'What time is the next train?', true, 'なんじ = what time.'),
          R('つぎの でんしゃは なんですか。', 'What is the next train?', false, 'なん asks “what”, not “what time”.'),
          R('つぎの でんしゃは どこですか。', 'Where is the next train?', false, 'どこ asks “where”.'),
        ],
      },
    ],
  },
  {
    id: 'directions', title: 'Asking the way', emoji: '🗺️', from: 'kobe', role: 'Passer-by',
    turns: [
      {
        npc: '（みちに まよって いる… だれかに こえを かけよう）', en: '(You’re lost… call out to someone)',
        replies: [
          R('すみません、ちょっと いいですか。', 'Excuse me, do you have a moment?', true, 'すみません opens almost any request.'),
          R('ごめんなさい！', 'I’m sorry!', false, 'That’s an apology, not a polite opener.'),
          R('おい！', 'Hey you!', false, 'Very rough — only between close friends.'),
        ],
      },
      {
        npc: 'はい、なんでしょう。', en: 'Yes, what is it?',
        replies: [
          R('えきは どこですか。', 'Where is the station?', true, 'Simple and clear.'),
          R('えきは だれですか。', 'Who is the station?', false, 'だれ = who.'),
          R('えきは いくらですか。', 'How much is the station?', false, 'いくら = how much.'),
        ],
      },
      {
        npc: 'まっすぐ いって、ふたつめの かどを みぎです。', en: 'Go straight and turn right at the second corner.',
        replies: [
          R('ふたつめを みぎですね。ありがとうございます。', 'Right at the second one. Thank you!', true, 'Repeating back with 〜ね checks you understood.'),
          R('ひとつめを ひだりですね。', 'Left at the first one, right?', false, 'Listen again: ふたつめ (second), みぎ (right).'),
          R('どういたしまして。', 'You’re welcome.', false, 'That’s the reply to thanks.'),
        ],
      },
    ],
  },
  {
    id: 'ryokan-checkin', title: 'Checking in at a ryokan', emoji: '🏮', from: 'kusatsu', role: 'Okami (innkeeper)',
    turns: [
      {
        npc: 'ようこそ おこしくださいました。おなまえを うかがっても よろしいですか。', en: 'Welcome. May I ask your name?',
        replies: [
          R('モチと もうします。よやくして います。', 'My name is Mochi. I have a reservation.', true, 'もうします is the humble way to give your name.'),
          R('モチと おっしゃいます。', '(honorific about yourself)', false, 'おっしゃる raises the speaker — never use it for yourself.'),
          R('モチだよ。', 'It’s Mochi.', false, 'Too casual for an okami’s greeting.'),
        ],
      },
      {
        npc: 'ゆうしょくは なんじが よろしいですか。', en: 'What time would you like dinner?',
        replies: [
          R('しちじに おねがいします。', 'Seven o’clock, please.', true, 'しちじ is how 7:00 is usually read.'),
          R('しちじかん おねがいします。', 'Seven hours, please.', false, '〜じかん is a length of time; 〜じ is a clock time.'),
          R('しちじに たべました。', 'I ate at seven.', false, 'Past tense — dinner hasn’t happened yet.'),
        ],
      },
      {
        npc: 'おふろは あちらで ございます。ごゆっくり どうぞ。', en: 'The bath is over there. Please relax.',
        replies: [
          R('ありがとうございます。', 'Thank you very much.', true, 'Simple and warm.'),
          R('ごゆっくり どうぞ。', 'Please relax.', false, 'That’s the host’s line to guests.'),
          R('おじゃましました。', 'Sorry for intruding (when leaving).', false, 'Said when you leave someone’s home.'),
        ],
      },
    ],
  },
  {
    id: 'pharmacy', title: 'At the pharmacy', emoji: '💊', from: 'kawagoe', role: 'Pharmacist',
    turns: [
      {
        npc: 'どう されましたか。', en: 'What seems to be the problem?',
        replies: [
          R('きのうから あたまが いたいんです。', 'I’ve had a headache since yesterday.', true, '〜んです explains your situation; から = since.'),
          R('あたまが いいです。', 'I’m smart.', false, 'あたまが いい means clever, not healthy!'),
          R('あたまを いたいです。', '(wrong particle)', false, 'Pain takes が: あたまが いたい.'),
        ],
      },
      {
        npc: 'ねつは ありますか。', en: 'Do you have a fever?',
        replies: [
          R('いいえ、ねつは ありません。', 'No, no fever.', true, 'は contrasts: no fever (just the headache).'),
          R('いいえ、ねつは いません。', '(wrong verb)', false, 'Things use ある, not いる.'),
          R('はい、ねつが すきです。', 'Yes, I like fever.', false, 'Probably not!'),
        ],
      },
      {
        npc: 'では、この くすりを いちにち さんかい のんで ください。', en: 'Then take this medicine three times a day.',
        replies: [
          R('ごはんの あとで のみますか。', 'Do I take it after meals?', true, 'A useful follow-up question.'),
          R('くすりを たべますか。', 'Do I eat the medicine?', false, 'Medicine is のむ (drink), not たべる.'),
          R('いちにち さんかい ねます。', 'I sleep three times a day.', false, 'ねる = sleep.'),
        ],
      },
    ],
  },
  {
    id: 'phone-booking', title: 'Booking by phone', emoji: '📞', from: 'hirosaki', role: 'Restaurant staff',
    turns: [
      {
        npc: 'おでんわ ありがとうございます。さくらていで ございます。', en: 'Thank you for calling. This is Sakura-tei.',
        replies: [
          R('よやくを おねがいしたいんですが。', 'I’d like to make a reservation…', true, 'Ending with が softens the request — very natural on the phone.'),
          R('よやくを しろ。', 'Make a reservation.', false, 'A bare command — very rude.'),
          R('もしもし、さくらていですか。', 'Hello, is this Sakura-tei?', false, 'They already said so.'),
        ],
      },
      {
        npc: 'かしこまりました。なんめいさまで いらっしゃいますか。', en: 'Certainly. How many people?',
        replies: [
          R('ふたりで おねがいします。', 'Two people, please.', true, 'ふたり = two people.'),
          R('ふたりで いらっしゃいます。', '(honorific about your own group)', false, 'Don’t use honorifics for your own side.'),
          R('ふたつで おねがいします。', 'Two things, please.', false, 'People are counted with 〜り / 〜にん.'),
        ],
      },
      {
        npc: 'では、あしたの しちじに おまちして おります。', en: 'We’ll be expecting you tomorrow at seven.',
        replies: [
          R('よろしく おねがいします。しつれいします。', 'Thank you. Goodbye.', true, 'しつれいします politely ends a phone call.'),
          R('おまちして おります。', 'We’ll be expecting you.', false, 'That’s the restaurant’s humble line.'),
          R('じゃあね！', 'Bye!', false, 'Too casual with a business.'),
        ],
      },
    ],
  },
  {
    id: 'apology', title: 'A late arrival', emoji: '⌛', from: 'ogasawara', role: 'Tour guide',
    turns: [
      {
        npc: 'しゅっぱつ じかんを じゅっぷん すぎて いますよ。', en: 'It’s ten minutes past departure time.',
        replies: [
          R('おくれて しまい、もうしわけ ございません。', 'I’m terribly sorry for being late.', true, 'もうしわけございません is the most formal apology.'),
          R('おくれて、どうも。', 'Late, thanks.', false, 'Sounds flippant.'),
          R('おまたせ！', 'Sorry I kept you!', false, 'Casual — fine with friends, not with a guide you kept waiting.'),
        ],
      },
      {
        npc: 'ふねは もう でて しまいましたが…', en: 'The boat has already left, though…',
        replies: [
          R('つぎの ふねに のることは できますでしょうか。', 'Would it be possible to take the next boat?', true, 'できますでしょうか is an extra-polite request.'),
          R('つぎの ふねに のれ。', 'Take the next boat.', false, 'A command to the guide!'),
          R('ふねが すきでした。', 'I liked the boat.', false, 'Not helpful right now.'),
        ],
      },
      {
        npc: 'みっかごに なりますが、よろしいですか。', en: 'That will be in three days. Is that all right?',
        replies: [
          R('はい、それで かまいません。', 'Yes, that’s fine.', true, 'それで かまいません = that works for me.'),
          R('みっかは どこですか。', 'Where is the third?', false, 'みっか is a date or period, not a place.'),
          R('いいえ、みっかです。', 'No, it’s three days.', false, 'Contradicts yourself.'),
        ],
      },
    ],
  },
];
