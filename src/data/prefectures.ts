import { DAY_TRIPS } from './daytrips';

/** Japan's 47 prefectures, and which prefecture each journey stop is in. */
export interface Prefecture {
  id: string;
  name: string;
  /** Japanese name with {kanji|kana} furigana markup */
  jp: string;
  emoji: string;
  /** a famous local specialty (meibutsu) */
  meibutsu: string;
}

const P = (id: string, name: string, jp: string, emoji: string, meibutsu: string): Prefecture => ({ id, name, jp, emoji, meibutsu });

export const PREFECTURES: Prefecture[] = [
  P('hokkaido', 'Hokkaido', '{北海道|ほっかいどう}', '🐻', 'Fresh crab, melons and miso ramen'),
  P('aomori', 'Aomori', '{青森|あおもり}', '🍎', 'Apples and the Nebuta festival'),
  P('iwate', 'Iwate', '{岩手|いわて}', '🍜', 'Wanko soba — bowl after tiny bowl of noodles'),
  P('miyagi', 'Miyagi', '{宮城|みやぎ}', '🐂', 'Grilled beef tongue (gyūtan)'),
  P('akita', 'Akita', '{秋田|あきた}', '🐕', 'Akita dogs and kiritanpo rice sticks'),
  P('yamagata', 'Yamagata', '{山形|やまがた}', '🍒', 'Cherries and imoni potato stew'),
  P('fukushima', 'Fukushima', '{福島|ふくしま}', '🐮', 'Peaches and the red akabeko cow'),
  P('ibaraki', 'Ibaraki', '{茨城|いばらき}', '🫘', 'Sticky nattō beans'),
  P('tochigi', 'Tochigi', '{栃木|とちぎ}', '🍓', 'Strawberries and Utsunomiya gyōza'),
  P('gunma', 'Gunma', '{群馬|ぐんま}', '♨️', 'Hot springs and daruma dolls'),
  P('saitama', 'Saitama', '{埼玉|さいたま}', '🍠', 'Sweet potato snacks in Kawagoe'),
  P('chiba', 'Chiba', '{千葉|ちば}', '🥜', 'Peanuts and fresh seafood'),
  P('tokyo', 'Tokyo', '{東京|とうきょう}', '🗼', 'Monjayaki and edomae sushi'),
  P('kanagawa', 'Kanagawa', '{神奈川|かながわ}', '🚢', 'Yokohama Chinatown buns'),
  P('niigata', 'Niigata', '{新潟|にいがた}', '🍚', 'Koshihikari rice and sake'),
  P('toyama', 'Toyama', '{富山|とやま}', '🦑', 'Glowing firefly squid'),
  P('ishikawa', 'Ishikawa', '{石川|いしかわ}', '✨', 'Gold leaf — even on ice cream'),
  P('fukui', 'Fukui', '{福井|ふくい}', '🦕', 'Dinosaur fossils and echizen crab'),
  P('yamanashi', 'Yamanashi', '{山梨|やまなし}', '🍇', 'Grapes, peaches and hōtō noodles'),
  P('nagano', 'Nagano', '{長野|ながの}', '🍎', 'Soba noodles and oyaki dumplings'),
  P('gifu', 'Gifu', '{岐阜|ぎふ}', '🏘️', 'Hida beef and gasshō farmhouses'),
  P('shizuoka', 'Shizuoka', '{静岡|しずおか}', '🍵', 'Green tea and wasabi'),
  P('aichi', 'Aichi', '{愛知|あいち}', '🍤', 'Miso katsu and giant fried shrimp'),
  P('mie', 'Mie', '{三重|みえ}', '🦪', 'Ise lobster and pearls'),
  P('shiga', 'Shiga', '{滋賀|しが}', '🏞️', 'Lake Biwa, Japan’s biggest lake'),
  P('kyoto', 'Kyoto', '{京都|きょうと}', '🍵', 'Matcha sweets and yatsuhashi'),
  P('osaka', 'Osaka', '{大阪|おおさか}', '🐙', 'Takoyaki and okonomiyaki'),
  P('hyogo', 'Hyogo', '{兵庫|ひょうご}', '🥩', 'Kobe beef'),
  P('nara', 'Nara', '{奈良|なら}', '🦌', 'Bowing deer and kakinoha-zushi'),
  P('wakayama', 'Wakayama', '{和歌山|わかやま}', '🍊', 'Mandarin oranges and plum pickles'),
  P('tottori', 'Tottori', '{鳥取|とっとり}', '🏜️', 'Sand dunes and pears'),
  P('shimane', 'Shimane', '{島根|しまね}', '⛩️', 'Izumo soba and the gods’ meeting place'),
  P('okayama', 'Okayama', '{岡山|おかやま}', '🍑', 'White peaches and kibi dango'),
  P('hiroshima', 'Hiroshima', '{広島|ひろしま}', '🦪', 'Oysters and okonomiyaki'),
  P('yamaguchi', 'Yamaguchi', '{山口|やまぐち}', '🐡', 'Fugu pufferfish'),
  P('tokushima', 'Tokushima', '{徳島|とくしま}', '💃', 'Awa Odori dance and indigo'),
  P('kagawa', 'Kagawa', '{香川|かがわ}', '🍜', 'Sanuki udon'),
  P('ehime', 'Ehime', '{愛媛|えひめ}', '🍊', 'Mikan oranges — even mikan juice taps'),
  P('kochi', 'Kochi', '{高知|こうち}', '🐟', 'Seared bonito (katsuo no tataki)'),
  P('fukuoka', 'Fukuoka', '{福岡|ふくおか}', '🍜', 'Tonkotsu ramen at yatai stalls'),
  P('saga', 'Saga', '{佐賀|さが}', '🏺', 'Arita porcelain'),
  P('nagasaki', 'Nagasaki', '{長崎|ながさき}', '🍰', 'Castella cake and champon noodles'),
  P('kumamoto', 'Kumamoto', '{熊本|くまもと}', '🐻', 'Kumamon the bear mascot'),
  P('oita', 'Oita', '{大分|おおいた}', '♨️', 'More hot springs than anywhere in Japan'),
  P('miyazaki', 'Miyazaki', '{宮崎|みやざき}', '🥭', 'Mangoes and chicken nanban'),
  P('kagoshima', 'Kagoshima', '{鹿児島|かごしま}', '🌋', 'Sakurajima volcano and black pork'),
  P('okinawa', 'Okinawa', '{沖縄|おきなわ}', '🌺', 'Gōyā champurū and sea grapes'),
];

export const PREF_BY_ID = new Map(PREFECTURES.map((p) => [p.id, p]));

/** Prefecture of every journey stop. */
export const STOP_PREFECTURE: Record<string, string> = {
  tokyo: 'tokyo', yokohama: 'kanagawa', kamakura: 'kanagawa', hakone: 'kanagawa', fuji: 'shizuoka', nagoya: 'aichi',
  kyoto: 'kyoto', osaka: 'osaka', nara: 'nara', himeji: 'hyogo', hiroshima: 'hiroshima', matsuyama: 'ehime',
  fukuoka: 'fukuoka', nagasaki: 'nagasaki', kumamoto: 'kumamoto', kagoshima: 'kagoshima', okinawa: 'okinawa',
  sendai: 'miyagi', tashiro: 'miyagi', sapporo: 'hokkaido', hakodate: 'hokkaido', aomori: 'aomori', akita: 'akita',
  nikko: 'tochigi', kanazawa: 'ishikawa', shirakawa: 'gifu', takayama: 'gifu', ise: 'mie', kobe: 'hyogo',
  kochi: 'kochi', beppu: 'oita', yakushima: 'kagoshima', hikone: 'shiga', uji: 'kyoto', koyasan: 'wakayama',
  okayama: 'okayama', tottori: 'tottori', matsue: 'shimane', matsumoto: 'nagano', nagano: 'nagano', kusatsu: 'gunma',
  hiraizumi: 'iwate', yamagata: 'yamagata', kawagoe: 'saitama', inuyama: 'aichi', gujo: 'gifu', tsumago: 'nagano',
  toyama: 'toyama', sado: 'niigata', aizu: 'fukushima', otaru: 'hokkaido', shiretoko: 'hokkaido', naoshima: 'kagawa',
  tokushima: 'tokushima', takachiho: 'miyazaki', iriomote: 'okinawa', hirosaki: 'aomori', matsushima: 'miyagi',
  gunkanjima: 'nagasaki', arita: 'saga', hagi: 'yamaguchi', iwakuni: 'yamaguchi', kotohira: 'kagawa', kurashiki: 'okayama',
  amanohashidate: 'kyoto', yoshino: 'nara', kumano: 'wakayama', asakusa: 'tokyo', ogasawara: 'tokyo', tono: 'iwate',
  sannai: 'aomori', eiheiji: 'fukui', sekigahara: 'gifu', sakai: 'osaka', kinosaki: 'hyogo', munakata: 'fukuoka',
  amakusa: 'kumamoto', amami: 'kagoshima', izu: 'shizuoka', gotokuji: 'tokyo',
};

/** Prefectures the player has visited: any stamped stop inside them, or a day trip there. */
export function visitedPrefectures(stamps: string[], daytrips: string[] = []): Set<string> {
  const out = new Set(stamps.map((s) => STOP_PREFECTURE[s]).filter((p): p is string => p !== undefined));
  for (const t of DAY_TRIPS) if (daytrips.includes(t.id)) out.add(t.pref);
  return out;
}
