import type { CatLook } from '../core/store';

export type Transport = 'plane' | 'train' | 'shinkansen' | 'bus' | 'ferry';

export interface Npc {
  name: string;
  jp: string;
  look: CatLook;
  /** greeting: [japanese using {kanji|kana} markup, english] */
  hello: [string, string];
}

export interface Stop {
  id: string;
  name: string;
  jp: string;
  reading: string;
  region: string;
  /** lon/lat for the map */
  lonlat: [number, number];
  emoji: string;
  transport: Transport;
  /** kana group ids (e.g. "h-a") taught here */
  teaches: string[];
  facts: string[];
  npc: Npc;
  /** cumulative tier label shown in the UI */
  tier: 'Kana' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

const L = (fur: string, accent: string, pattern: CatLook['pattern'], eyes: string, hat: CatLook['hat']): CatLook => ({ fur, accent, pattern, eyes, hat });

export const STOPS: Stop[] = [
  {
    id: 'tokyo', name: 'Tokyo', jp: '東京', reading: 'とうきょう', region: 'Kanto', lonlat: [139.7, 35.68], emoji: '🗼', transport: 'plane', tier: 'Kana',
    teaches: ['h-a'],
    facts: [
      'Tokyo is Japan’s capital, and the Tokyo area is one of the biggest cities on Earth.',
      'The Tokyo Skytree is 634 meters tall — the tallest tower in Japan.',
      'The lucky beckoning cat, maneki-neko, is linked to Gotokuji temple in Tokyo. Its raised paw invites good fortune!',
    ],
    npc: { name: 'Maneki', jp: 'まねき', look: L('#fafafa', '#e0e0e0', 'plain', '#3d85c6', 'bow'), hello: ['ようこそ！ にゃー！', 'Welcome! Nya~!'] },
  },
  {
    id: 'yokohama', name: 'Yokohama', jp: '横浜', reading: 'よこはま', region: 'Kanto', lonlat: [139.64, 35.44], emoji: '🚢', transport: 'train', tier: 'Kana',
    teaches: ['h-k'],
    facts: [
      'Yokohama is Japan’s second-largest city and a famous port.',
      'It opened to foreign trade in 1859, so food and ideas from overseas arrived here first.',
      'Yokohama’s Chinatown is the largest in Japan. Meat buns for everyone!',
    ],
    npc: { name: 'Minato', jp: 'みなと', look: L('#2b2b2b', '#111', 'tuxedo', '#c9d83a', 'scarf'), hello: ['みなとへ ようこそ！', 'Welcome to the harbor!'] },
  },
  {
    id: 'kamakura', name: 'Kamakura', jp: '鎌倉', reading: 'かまくら', region: 'Kanto', lonlat: [139.55, 35.32], emoji: '🛕', transport: 'train', tier: 'Kana',
    teaches: ['h-s'],
    facts: [
      'Kamakura was the seat of the samurai government from 1185 to 1333.',
      'Its Great Buddha (Daibutsu) is a bronze statue about 13 meters tall, sitting outdoors.',
      'The little Enoden train rattles right past the beach and through narrow streets.',
    ],
    npc: { name: 'Daibutsu-san', jp: 'だいぶつ', look: L('#c9a27a', '#8b5a2b', 'tabby', '#6aa84f', 'none'), hello: ['のんびり いきましょう。', 'Let’s take it slow and steady.'] },
  },
  {
    id: 'hakone', name: 'Hakone', jp: '箱根', reading: 'はこね', region: 'Kanto', lonlat: [139.02, 35.23], emoji: '♨️', transport: 'bus', tier: 'Kana',
    teaches: ['h-t'],
    facts: [
      'Hakone is famous for onsen — natural hot springs — and views of Mount Fuji.',
      'At Owakudani, eggs boiled in volcanic steam turn black. They are called kuro-tamago.',
      'Legend says eating one adds seven years to your life!',
    ],
    npc: { name: 'Yuzu', jp: 'ゆず', look: L('#f6b26b', '#e69138', 'tabby', '#3d85c6', 'headband'), hello: ['おんせんは さいこう！', 'Hot springs are the best!'] },
  },
  {
    id: 'fuji', name: 'Mt. Fuji (Shizuoka)', jp: '富士山', reading: 'ふじさん', region: 'Chubu', lonlat: [138.73, 35.36], emoji: '🗻', transport: 'bus', tier: 'Kana',
    teaches: ['h-n'],
    facts: [
      'Mount Fuji is 3,776 meters — Japan’s highest mountain — and a UNESCO World Heritage site.',
      'Shizuoka, at Fuji’s foot, is famous for its green tea.',
      'Climbing season is only in summer (July–September). The rest of the year it wears snow!',
    ],
    npc: { name: 'Ocha', jp: 'おちゃ', look: L('#b0bec5', '#78909c', 'plain', '#6aa84f', 'none'), hello: ['おちゃを どうぞ。', 'Have some tea, please.'] },
  },
  {
    id: 'nagoya', name: 'Nagoya', jp: '名古屋', reading: 'なごや', region: 'Chubu', lonlat: [136.9, 35.18], emoji: '🏯', transport: 'shinkansen', tier: 'Kana',
    teaches: ['h-h'],
    facts: [
      'Nagoya Castle has golden shachihoko on its roof — mythical fish with tiger heads.',
      'Nagoya is the home of Toyota, one of the world’s biggest carmakers.',
      'Try miso katsu: a fried pork cutlet with rich red-miso sauce!',
    ],
    npc: { name: 'Shachi', jp: 'しゃち', look: L('#ffd24a', '#e0a800', 'spots', '#3d85c6', 'crown'), hello: ['かっこいい おしろでしょ？', 'Isn’t the castle cool?'] },
  },
  {
    id: 'kyoto', name: 'Kyoto', jp: '京都', reading: 'きょうと', region: 'Kansai', lonlat: [135.77, 35.01], emoji: '⛩️', transport: 'shinkansen', tier: 'Kana',
    teaches: ['h-m', 'h-y'],
    facts: [
      'Kyoto was Japan’s capital for over 1,000 years (794–1868).',
      'Fushimi Inari shrine has thousands of red torii gates winding up a mountain.',
      'Kinkaku-ji, the Golden Pavilion, is covered in gold leaf and mirrored in its pond.',
    ],
    npc: { name: 'Maiko', jp: 'まいこ', look: L('#fff3e0', '#f4b183', 'calico', '#c2185b', 'bow'), hello: ['おこしやす〜', 'Welcome! (Kyoto-style)'] },
  },
  {
    id: 'osaka', name: 'Osaka', jp: '大阪', reading: 'おおさか', region: 'Kansai', lonlat: [135.5, 34.69], emoji: '🐙', transport: 'train', tier: 'Kana',
    teaches: ['h-r', 'h-w'],
    facts: [
      'Osaka is known as the nation’s kitchen. Locals say “kuidaore” — eat until you drop!',
      'Takoyaki — crispy balls with octopus inside — were born here.',
      'Dotonbori’s giant neon signs, like the running Glico man, light up the canal at night.',
    ],
    npc: { name: 'Takoyaki', jp: 'たこやき', look: L('#f6b26b', '#e69138', 'spots', '#cc0000', 'headband'), hello: ['まいど！ げんき？', 'Hey there! How’s it going?'] },
  },
  {
    id: 'nara', name: 'Nara', jp: '奈良', reading: 'なら', region: 'Kansai', lonlat: [135.83, 34.69], emoji: '🦌', transport: 'train', tier: 'Kana',
    teaches: ['h-g', 'h-z'],
    facts: [
      'Over a thousand wild deer roam Nara Park, and they will bow for your crackers.',
      'Todai-ji houses a giant bronze Buddha inside one of the world’s largest wooden buildings.',
      'Nara was Japan’s first permanent capital, around 710.',
    ],
    npc: { name: 'Shika', jp: 'しか', look: L('#c9a27a', '#8b5a2b', 'spots', '#38761d', 'none'), hello: ['おじぎ、おじぎ！', 'Bow, bow!'] },
  },
  {
    id: 'himeji', name: 'Himeji', jp: '姫路', reading: 'ひめじ', region: 'Kansai', lonlat: [134.69, 34.84], emoji: '🏰', transport: 'shinkansen', tier: 'Kana',
    teaches: ['h-d', 'h-b', 'h-p'],
    facts: [
      'Himeji Castle is nicknamed the White Heron Castle for its gleaming white walls.',
      'It is a UNESCO World Heritage site and one of the best-preserved original castles in Japan.',
      'The castle’s maze of winding paths was designed to confuse invaders!',
    ],
    npc: { name: 'Shirasagi', jp: 'しらさぎ', look: L('#fafafa', '#e0e0e0', 'plain', '#6fa8dc', 'crown'), hello: ['しろへ ようこそ！', 'Welcome to the castle!'] },
  },
  {
    id: 'hiroshima', name: 'Hiroshima', jp: '広島', reading: 'ひろしま', region: 'Chugoku', lonlat: [132.46, 34.39], emoji: '🕊️', transport: 'shinkansen', tier: 'Kana',
    teaches: ['h-ky', 'h-sh'],
    facts: [
      'Hiroshima’s Peace Memorial Park is dedicated to peace and remembrance.',
      'Nearby Miyajima island has the famous torii gate that seems to float on the sea at high tide.',
      'Hiroshima-style okonomiyaki layers noodles, cabbage and egg on a hot griddle.',
    ],
    npc: { name: 'Heiwa', jp: 'へいわ', look: L('#d7ccc8', '#8d6e63', 'plain', '#6aa84f', 'bow'), hello: ['へいわが いちばん。', 'Peace is the best.'] },
  },
  {
    id: 'matsuyama', name: 'Matsuyama (Aoshima)', jp: '松山', reading: 'まつやま', region: 'Shikoku', lonlat: [132.77, 33.84], emoji: '🍊', transport: 'ferry', tier: 'Kana',
    teaches: ['h-ny', 'h-by'],
    facts: [
      'Dogo Onsen in Matsuyama is among Japan’s oldest hot springs — its grand wooden bathhouse is famous.',
      'Ehime Prefecture is famous for mikan oranges — you can even find orange-flavored everything.',
      'Aoshima, a small island in Ehime, is home to far more cats than people!',
    ],
    npc: { name: 'Mikan', jp: 'みかん', look: L('#f6b26b', '#e69138', 'tabby', '#6aa84f', 'straw'), hello: ['みかん、たべる？', 'Want some mikan?'] },
  },
  {
    id: 'fukuoka', name: 'Fukuoka', jp: '福岡', reading: 'ふくおか', region: 'Kyushu', lonlat: [130.4, 33.59], emoji: '🍜', transport: 'ferry', tier: 'Kana',
    teaches: ['k-a', 'k-k'],
    facts: [
      'Fukuoka’s Hakata ramen has a creamy pork-bone (tonkotsu) broth and thin noodles.',
      'Yatai — open-air food stalls — line the riverside at night.',
      'Katakana is used for foreign words and names — like ラーメン, which came from Chinese!',
    ],
    npc: { name: 'Tonkotsu', jp: 'とんこつ', look: L('#fff3e0', '#f4b183', 'plain', '#3d85c6', 'headband'), hello: ['ラーメン、いこう！', 'Let’s go get ramen!'] },
  },
  {
    id: 'nagasaki', name: 'Nagasaki', jp: '長崎', reading: 'ながさき', region: 'Kyushu', lonlat: [129.87, 32.75], emoji: '🏮', transport: 'train', tier: 'Kana',
    teaches: ['k-s', 'k-t'],
    facts: [
      'For about 200 years, Nagasaki’s Dejima island was Japan’s window to the outside world.',
      'Castella sponge cake came here from Portugal in the 1500s.',
      'Hillside streets and old stone bridges give the city a unique mix of Japanese, Chinese and European charm.',
    ],
    npc: { name: 'Castella', jp: 'カステラ', look: L('#ffd24a', '#e0a800', 'plain', '#cc0000', 'beret'), hello: ['カステラ、おいしいよ！', 'The castella is delicious!'] },
  },
  {
    id: 'kumamoto', name: 'Kumamoto', jp: '熊本', reading: 'くまもと', region: 'Kyushu', lonlat: [130.74, 32.8], emoji: '🐻', transport: 'train', tier: 'Kana',
    teaches: ['k-n', 'k-h'],
    facts: [
      'Kumamoto’s mascot Kumamon, a black bear with red cheeks, is one of Japan’s most famous.',
      'Mount Aso nearby has one of the largest volcanic calderas in the world.',
      'Kumamoto Castle’s stone walls curve upward in a way designed to stop climbers.',
    ],
    npc: { name: 'Kumamon-nyan', jp: 'くまにゃん', look: L('#2b2b2b', '#111', 'plain', '#ffd24a', 'none'), hello: ['ほっぺが あかいよ！', 'Look at my red cheeks!'] },
  },
  {
    id: 'kagoshima', name: 'Kagoshima', jp: '鹿児島', reading: 'かごしま', region: 'Kyushu', lonlat: [130.56, 31.6], emoji: '🌋', transport: 'shinkansen', tier: 'Kana',
    teaches: ['k-m', 'k-y', 'k-r', 'k-w'],
    facts: [
      'Sakurajima, an active volcano, sits right across the bay and sometimes puffs ash over the city.',
      'Kagoshima is famous for sweet potatoes, black pork, and shochu made from them.',
      'You can take a sand bath at the nearby Ibusuki hot springs!',
    ],
    npc: { name: 'Imo', jp: 'イモ', look: L('#8e44ad', '#5b2c6f', 'spots', '#ffd24a', 'bow'), hello: ['やきいも、あるよ！', 'I’ve got roasted sweet potato!'] },
  },
  {
    id: 'okinawa', name: 'Okinawa (Naha)', jp: '沖縄', reading: 'おきなわ', region: 'Okinawa', lonlat: [127.68, 26.21], emoji: '🌺', transport: 'plane', tier: 'Kana',
    teaches: ['k-g', 'k-z', 'k-d', 'k-b', 'k-p'],
    facts: [
      'Okinawa was once the Ryukyu Kingdom, with its own language, music and cuisine.',
      'Shisa — lion-dog guardians — sit on rooftops and gates to ward off evil.',
      'Karate was born in Okinawa. Its warm, coral-reef seas are full of colorful fish.',
    ],
    npc: { name: 'Shisa', jp: 'シーサー', look: L('#c9a27a', '#8b5a2b', 'tabby', '#cc0000', 'crown'), hello: ['めんそーれ！', 'Welcome! (Okinawan)'] },
  },
  {
    id: 'sendai', name: 'Sendai', jp: '仙台', reading: 'せんだい', region: 'Tohoku', lonlat: [140.87, 38.27], emoji: '🎋', transport: 'plane', tier: 'Kana',
    teaches: ['k-ky', 'k-sh'],
    facts: [
      'Sendai is nicknamed the City of Trees for its tree-lined avenues.',
      'Gyutan — grilled beef tongue — is the local specialty.',
      'The Tanabata star festival in August fills the streets with giant paper decorations.',
    ],
    npc: { name: 'Tanabata', jp: 'たなばた', look: L('#b0bec5', '#78909c', 'tabby', '#c2185b', 'beret'), hello: ['ねがいごと、した？', 'Did you make a wish?'] },
  },
  {
    id: 'tashiro', name: 'Tashirojima (Cat Island)', jp: '田代島', reading: 'たしろじま', region: 'Tohoku', lonlat: [141.43, 38.29], emoji: '🏝️', transport: 'ferry', tier: 'Kana',
    teaches: ['k-ny', 'k-by'],
    facts: [
      'Tashirojima, off Miyagi, is nicknamed Cat Island — cats outnumber the people!',
      'Fishermen long ago kept cats to protect silkworms and treated them as bringers of good luck.',
      'A small cat shrine on the island honors a cat that was cared for there.',
    ],
    npc: { name: 'Fisher-nyan', jp: 'りょうし', look: L('#9e9e9e', '#616161', 'tabby', '#6aa84f', 'straw'), hello: ['ここは ねこのしま！', 'This is the cat island!'] },
  },
  {
    id: 'sapporo', name: 'Sapporo', jp: '札幌', reading: 'さっぽろ', region: 'Hokkaido', lonlat: [141.35, 43.06], emoji: '❄️', transport: 'plane', tier: 'Kana',
    teaches: [],
    facts: [
      'Sapporo hosts a giant Snow Festival every February, with enormous ice sculptures.',
      'Miso ramen was invented in Sapporo.',
      'Hokkaido’s fresh seafood, butter, and dairy are famous all over Japan.',
    ],
    npc: { name: 'Yuki', jp: 'ゆき', look: L('#fafafa', '#e0e0e0', 'plain', '#3d85c6', 'scarf'), hello: ['さむい！ でも たのしい！', 'Cold! But fun!'] },
  },
];

export const STOP_BY_ID = new Map(STOPS.map((s) => [s.id, s]));

export const TRANSPORT_EMOJI: Record<Transport, string> = {
  plane: '✈️',
  train: '🚃',
  shinkansen: '🚄',
  bus: '🚌',
  ferry: '⛴️',
};
