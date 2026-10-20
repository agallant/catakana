/** Survival phrases for travelling cats: used by the phrasebook and the speaking game. */
export interface Phrase {
  id: string;
  jp: string;
  /** kana-only reading (for matching speech recognition and display before kanji) */
  kana: string;
  en: string;
  emoji: string;
  /** stop index from which it is available */
  from: number;
  /** other ways a speech recognizer may write it (with kanji) */
  alts?: string[];
}

const P = (id: string, jp: string, kana: string, en: string, emoji: string, from: number, alts?: string[]): Phrase => ({ id: `p:${id}`, jp, kana, en, emoji, from, alts });

export const PHRASES: Phrase[] = [
  P('hello', 'こんにちは', 'こんにちは', 'Hello', '👋', 0),
  P('thanks', 'ありがとう', 'ありがとう', 'Thanks', '🙏', 0),
  P('yes', 'はい', 'はい', 'Yes', '👍', 0),
  P('ohayou', 'おはようございます', 'おはようございます', 'Good morning (polite)', '🌅', 1, ['お早うございます']),
  P('excuse', 'すみません', 'すみません', 'Excuse me / Sorry', '🙇', 2),
  P('konbanwa', 'こんばんは', 'こんばんは', 'Good evening', '🌆', 3),
  P('itadakimasu', 'いただきます', 'いただきます', 'Let’s eat! (said before meals)', '🍚', 4),
  P('gochisou', 'ごちそうさまでした', 'ごちそうさまでした', 'Thank you for the meal (after eating)', '😋', 5, ['ご馳走様でした', 'ごちそう様でした']),
  P('arigatougozaimasu', 'ありがとうございます', 'ありがとうございます', 'Thank you very much', '🙏', 6),
  P('oyasumi', 'おやすみなさい', 'おやすみなさい', 'Good night', '🌙', 7, ['お休みなさい']),
  P('oishii', 'おいしいです', 'おいしいです', 'It’s delicious', '🍣', 8, ['美味しいです']),
  P('daijoubu', 'だいじょうぶです', 'だいじょうぶです', 'I’m OK / No thanks', '👌', 9, ['大丈夫です']),
  P('wakarimasen', 'わかりません', 'わかりません', 'I don’t understand', '🤔', 10, ['分かりません']),
  P('mouichido', 'もういちど おねがいします', 'もういちどおねがいします', 'One more time, please', '🔁', 11, ['もう一度お願いします']),
  P('kore', 'これを ください', 'これをください', 'This one, please', '👉', 12, ['これを下さい']),
  P('ikura', 'いくらですか', 'いくらですか', 'How much is it?', '💴', 13),
  P('toire', 'トイレは どこですか', 'といれはどこですか', 'Where is the toilet?', '🚻', 14, ['トイレはどこですか']),
  P('eki', 'えきは どこですか', 'えきはどこですか', 'Where is the station?', '🚉', 15, ['駅はどこですか']),
  P('eigo', 'えいごは わかりますか', 'えいごはわかりますか', 'Do you understand English?', '🔤', 16, ['英語はわかりますか', '英語は分かりますか']),
  P('hajimemashite', 'はじめまして', 'はじめまして', 'Nice to meet you', '🤝', 20),
  P('yoroshiku', 'よろしく おねがいします', 'よろしくおねがいします', 'Pleased to meet you / Thanks in advance', '🙇', 20, ['よろしくお願いします']),
  P('nihongo', 'にほんごを べんきょうしています', 'にほんごをべんきょうしています', 'I’m studying Japanese', '📚', 23, ['日本語を勉強しています']),
  P('shashin', 'しゃしんを とっても いいですか', 'しゃしんをとってもいいですか', 'May I take a photo?', '📸', 26, ['写真を撮ってもいいですか']),
  P('kippu', 'きっぷを ください', 'きっぷをください', 'A ticket, please', '🎫', 27, ['切符をください', '切符を下さい']),
  P('tsugi', 'つぎの えきは どこですか', 'つぎのえきはどこですか', 'What is the next station?', '🚃', 27, ['次の駅はどこですか']),
  P('osusume', 'おすすめは なんですか', 'おすすめはなんですか', 'What do you recommend?', '⭐', 24, ['おすすめは何ですか', 'お勧めは何ですか']),
  P('kaado', 'カードで はらえますか', 'かーどではらえますか', 'Can I pay by card?', '💳', 26, ['カードで払えますか']),
  P('michi', 'みちに まよいました', 'みちにまよいました', 'I’m lost', '🧭', 28, ['道に迷いました']),
  P('tasukete', 'たすけて ください', 'たすけてください', 'Please help me', '🆘', 31, ['助けてください', '助けて下さい']),
  // N4
  P('yoyaku', 'よやくして いるんですが', 'よやくしているんですが', 'I have a reservation', '📋', 33, ['予約しているんですが']),
  P('checkin', 'チェックインを おねがいします', 'ちぇっくいんをおねがいします', 'Check-in, please', '🛎️', 35, ['チェックインをお願いします']),
  P('nimotsu', 'にもつを あずけても いいですか', 'にもつをあずけてもいいですか', 'May I leave my luggage here?', '🧳', 37, ['荷物を預けてもいいですか']),
  P('osokunatte', 'おそく なって すみません', 'おそくなってすみません', 'Sorry I’m late', '⏰', 39, ['遅くなってすみません']),
  P('tabetakoto', 'たべた ことが ありません', 'たべたことがありません', 'I’ve never eaten it before', '🍽️', 41, ['食べたことがありません']),
  P('kaeri', 'かえりの でんしゃは なんじですか', 'かえりのでんしゃはなんじですか', 'What time is the train back?', '🚃', 43, ['帰りの電車は何時ですか']),
  P('tetsudau', 'てつだいましょうか', 'てつだいましょうか', 'Shall I help?', '🤲', 44, ['手伝いましょうか']),
  // N3
  P('allergy', 'アレルギーが あるんです', 'あれるぎーがあるんです', 'I have an allergy', '⚠️', 45, ['アレルギーがあるんです']),
  P('chikaku', 'この ちかくに コンビニは ありますか', 'このちかくにこんびにはありますか', 'Is there a convenience store near here?', '🏪', 47, ['この近くにコンビニはありますか']),
  P('wasuremono', 'わすれものを して しまいました', 'わすれものをしてしまいました', 'I’ve left something behind', '🎒', 49, ['忘れ物をしてしまいました']),
  P('okuresou', 'すこし おくれそうです', 'すこしおくれそうです', 'I think I’ll be a little late', '🐢', 51, ['少し遅れそうです']),
  P('tsukaikata', 'つかいかたを おしえて もらえますか', 'つかいかたをおしえてもらえますか', 'Could you show me how to use it?', '🧑‍🏫', 53, ['使い方を教えてもらえますか']),
  P('netsu', 'ねつが あるみたいです', 'ねつがあるみたいです', 'I seem to have a fever', '🤒', 55, ['熱があるみたいです']),
  // N2
  P('osoreirimasu', 'おそれいりますが', 'おそれいりますが', 'Excuse me, but… (very polite)', '🙇', 57, ['恐れ入りますが']),
  P('shouchi', 'しょうちしました', 'しょうちしました', 'Understood (polite)', '✅', 59, ['承知しました']),
  P('otesuu', 'おてすうを おかけしました', 'おてすうをおかけしました', 'Sorry for the trouble I caused', '🙏', 61, ['お手数をおかけしました']),
  P('kekkou', 'けっこうです', 'けっこうです', 'No, thank you (I’m fine)', '🙅', 63, ['結構です']),
  P('osewa', 'おせわに なりました', 'おせわになりました', 'Thank you for everything (when leaving)', '👋', 65, ['お世話になりました']),
  P('osakini', 'おさきに しつれいします', 'おさきにしつれいします', 'Excuse me for leaving first', '🚪', 67, ['お先に失礼します']),
  // N1
  P('ukagau', 'あした うかがっても よろしいでしょうか', 'あしたうかがってもよろしいでしょうか', 'Might I call on you tomorrow?', '📅', 69, ['明日伺ってもよろしいでしょうか']),
  P('haiken', 'はいけんしても よろしいですか', 'はいけんしてもよろしいですか', 'May I take a look? (humble)', '👀', 71, ['拝見してもよろしいですか']),
  P('kyoushuku', 'きょうしゅくです', 'きょうしゅくです', 'I’m much obliged (humble)', '🙇‍♀️', 73, ['恐縮です']),
  P('goenryo', 'ごえんりょなく', 'ごえんりょなく', 'Please don’t hold back', '😊', 75, ['ご遠慮なく']),
  P('omenikakarete', 'おめに かかれて こうえいです', 'おめにかかれてこうえいです', 'It’s an honour to meet you', '🌟', 77, ['お目にかかれて光栄です']),
  P('tanoshimini', 'また おめに かかれるのを たのしみに して おります', 'またおめにかかれるのをたのしみにしております', 'I look forward to meeting you again', '🎐', 79, ['またお目にかかれるのを楽しみにしております']),
];
