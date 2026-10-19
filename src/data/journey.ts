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
  // ---- N5 Grand Tour: vocabulary and grammar (content in n5.ts) ----
  {
    id: 'hakodate', name: 'Hakodate', jp: '函館', reading: 'はこだて', region: 'Hokkaido', lonlat: [140.73, 41.77], emoji: '🦑', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'Hakodate’s night view from Mount Hakodate is one of the most famous in Japan.',
      'Goryokaku is a star-shaped fort — from above it looks like a giant five-pointed star.',
      'At the morning market you can catch a squid and eat it fresh!',
    ],
    npc: { name: 'Ika', jp: 'イカ', look: L('#fafafa', '#e0e0e0', 'spots', '#3d85c6', 'beret'), hello: ['はじめまして！ わたしは イカです。', 'Nice to meet you! I am Ika.'] },
  },
  {
    id: 'aomori', name: 'Aomori', jp: '青森', reading: 'あおもり', region: 'Tohoku', lonlat: [140.74, 40.82], emoji: '🍎', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'You can reach Aomori from Hokkaido through the Seikan Tunnel, which runs under the sea for about 54 km.',
      'Aomori grows more apples than any other prefecture in Japan.',
      'In the Nebuta Festival, giant glowing paper floats of warriors parade through the streets.',
    ],
    npc: { name: 'Ringo', jp: 'りんご', look: L('#c0392b', '#922b21', 'plain', '#6aa84f', 'none'), hello: ['これは わたしの りんごです！', 'This is my apple!'] },
  },
  {
    id: 'akita', name: 'Akita', jp: '秋田', reading: 'あきた', region: 'Tohoku', lonlat: [140.1, 39.72], emoji: '🐕', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'Akita is home of the Akita dog breed — loyal Hachiko was an Akita.',
      'On New Year’s Eve, Namahage “demons” visit homes to scold lazy children.',
      'Kakunodate has a preserved samurai district lined with weeping cherry trees.',
    ],
    npc: { name: 'Hachi', jp: 'ハチ', look: L('#e8c39e', '#c68e5b', 'plain', '#3d2b1f', 'scarf'), hello: ['あきたは さむいです！', 'Akita is cold!'] },
  },
  {
    id: 'nikko', name: 'Nikko', jp: '日光', reading: 'にっこう', region: 'Kanto', lonlat: [139.6, 36.75], emoji: '🐒', transport: 'shinkansen', tier: 'N5',
    teaches: [],
    facts: [
      'Nikko Toshogu shrine has a famous carving of a sleeping cat — the Nemuri-neko!',
      'It also has the original “see no evil, hear no evil, speak no evil” monkeys.',
      'Kegon Falls drops about 97 meters from Lake Chuzenji.',
    ],
    npc: { name: 'Nemuri', jp: 'ねむり', look: L('#fafafa', '#f4b183', 'calico', '#3d85c6', 'none'), hello: ['ねこは よく ねます…', 'Cats sleep a lot…'] },
  },
  {
    id: 'kanazawa', name: 'Kanazawa', jp: '金沢', reading: 'かなざわ', region: 'Chubu', lonlat: [136.65, 36.56], emoji: '🪙', transport: 'shinkansen', tier: 'N5',
    teaches: [],
    facts: [
      'Kenroku-en is counted among Japan’s three great gardens.',
      'Almost all of Japan’s gold leaf is made in Kanazawa — you can even eat gold-leaf ice cream!',
      'Omicho Market has fed the city for about 300 years.',
    ],
    npc: { name: 'Kin', jp: 'きん', look: L('#ffd24a', '#e0a800', 'tabby', '#6aa84f', 'crown'), hello: ['すしを たべますか？', 'Will you eat sushi?'] },
  },
  {
    id: 'shirakawa', name: 'Shirakawa-go', jp: '白川郷', reading: 'しらかわごう', region: 'Chubu', lonlat: [136.91, 36.26], emoji: '🛖', transport: 'bus', tier: 'N5',
    teaches: [],
    facts: [
      'Its gassho-zukuri farmhouses have steep thatched roofs shaped like hands pressed together in prayer.',
      'The steep roofs let heavy mountain snow slide off.',
      'The village is a UNESCO World Heritage site, magical when lit up on winter nights.',
    ],
    npc: { name: 'Kaya', jp: 'かや', look: L('#c9a27a', '#8b5a2b', 'tabby', '#38761d', 'straw'), hello: ['いえへ ようこそ！', 'Welcome to my house!'] },
  },
  {
    id: 'takayama', name: 'Takayama', jp: '高山', reading: 'たかやま', region: 'Chubu', lonlat: [137.25, 36.14], emoji: '🏮', transport: 'bus', tier: 'N5',
    teaches: [],
    facts: [
      'Takayama’s old town has wooden merchant houses and sake breweries with cedar balls hanging outside.',
      'Two morning markets open every day by the river.',
      'Sarubobo — faceless red “baby monkey” dolls — are a local good-luck charm.',
    ],
    npc: { name: 'Bobo', jp: 'ぼぼ', look: L('#e74c3c', '#b03a2e', 'plain', '#2b2b2b', 'headband'), hello: ['これは いくらですか？', 'How much is this?'] },
  },
  {
    id: 'ise', name: 'Ise', jp: '伊勢', reading: 'いせ', region: 'Kansai', lonlat: [136.73, 34.46], emoji: '⛩️', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'Ise Jingu is the most sacred Shinto shrine in Japan.',
      'Its main buildings are rebuilt every 20 years, a tradition kept for over a thousand years.',
      'Ama divers in this region have gathered shellfish from the sea for generations.',
    ],
    npc: { name: 'Miko', jp: 'みこ', look: L('#fafafa', '#e0e0e0', 'plain', '#c2185b', 'bow'), hello: ['でんしゃで きましたか？', 'Did you come by train?'] },
  },
  {
    id: 'kobe', name: 'Kobe', jp: '神戸', reading: 'こうべ', region: 'Kansai', lonlat: [135.19, 34.69], emoji: '⚓', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'Kobe is a port city between the mountains and the sea.',
      'Kobe beef is world famous for its marbled, melt-in-your-mouth texture.',
      'The Kitano district has old Western-style houses built by foreign merchants.',
    ],
    npc: { name: 'Minato', jp: 'みなと', look: L('#2b2b2b', '#111', 'tuxedo', '#ffd24a', 'beret'), hello: ['みなとに ねこが います！', 'There’s a cat at the port!'] },
  },
  {
    id: 'kochi', name: 'Kochi', jp: '高知', reading: 'こうち', region: 'Shikoku', lonlat: [133.53, 33.56], emoji: '🐟', transport: 'train', tier: 'N5',
    teaches: [],
    facts: [
      'Kochi’s specialty is katsuo no tataki — bonito seared over a straw fire.',
      'The energetic Yosakoi dance festival started here in 1954.',
      'The Shimanto River is called “the last clear stream” of Japan.',
    ],
    npc: { name: 'Katsuo', jp: 'かつお', look: L('#9e9e9e', '#616161', 'tabby', '#3d85c6', 'headband'), hello: ['きのう カツオを たべました！', 'I ate bonito yesterday!'] },
  },
  {
    id: 'beppu', name: 'Beppu', jp: '別府', reading: 'べっぷ', region: 'Kyushu', lonlat: [131.49, 33.28], emoji: '♨️', transport: 'ferry', tier: 'N5',
    teaches: [],
    facts: [
      'Beppu has more hot spring vents than almost anywhere on Earth — steam rises all over town.',
      'The “Hells of Beppu” are colorful boiling pools — blue, red, and bubbling mud — for looking, not bathing!',
      'You can eat food steamed in the hot spring vapor (jigoku-mushi).',
    ],
    npc: { name: 'Yukemuri', jp: 'ゆけむり', look: L('#b0bec5', '#78909c', 'plain', '#c2185b', 'headband'), hello: ['おんせんに はいりたいですか？', 'Do you want to get in a hot spring?'] },
  },
  {
    id: 'yakushima', name: 'Yakushima', jp: '屋久島', reading: 'やくしま', region: 'Kyushu', lonlat: [130.53, 30.35], emoji: '🌲', transport: 'ferry', tier: 'N5',
    teaches: [],
    facts: [
      'Yakushima’s mossy forest is a UNESCO World Heritage site.',
      'Jomon Sugi, an ancient cedar, is thought to be thousands of years old.',
      'It rains so much that locals joke it rains “35 days a month”!',
    ],
    npc: { name: 'Koke', jp: 'こけ', look: L('#7cb86a', '#4e7d43', 'spots', '#ffd24a', 'none'), hello: ['もりを みて ください！', 'Please look at the forest!'] },
  },
  // ---- N4 season: everyday grammar, castles and old towns ----
  {
    id: 'hikone', name: 'Hikone', jp: '彦根', reading: 'ひこね', region: 'Kansai', lonlat: [136.25, 35.28], emoji: '🏯', transport: 'plane', tier: 'N4',
    teaches: [],
    facts: [
      'Hikone Castle is one of only five castle keeps that are National Treasures.',
      'Legend says a beckoning cat saved Lord Ii Naotaka from a lightning storm — one origin story of the maneki-neko!',
      'The city’s mascot, Hikonyan, is a white cat wearing a red samurai helmet.',
    ],
    npc: { name: 'Hikonyan', jp: 'ひこにゃん', look: L('#fafafa', '#e0e0e0', 'plain', '#2b2b2b', 'crown'), hello: ['ようこそ！ いま、てを ふっています！', 'Welcome! I’m waving right now!'] },
  },
  {
    id: 'uji', name: 'Uji', jp: '宇治', reading: 'うじ', region: 'Kansai', lonlat: [135.8, 34.89], emoji: '🍵', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Uji is one of Japan’s most famous tea towns — its matcha is prized all over the country.',
      'Byodo-in’s Phoenix Hall appears on the back of the 10-yen coin.',
      'The last chapters of The Tale of Genji, a novel from about 1,000 years ago, are set in Uji.',
    ],
    npc: { name: 'Matcha', jp: 'まっちゃ', look: L('#7cb86a', '#4e7d43', 'tabby', '#ffd24a', 'bow'), hello: ['おちゃを のんでも いいですよ。', 'You may drink some tea.'] },
  },
  {
    id: 'koyasan', name: 'Mount Koya', jp: '高野山', reading: 'こうやさん', region: 'Kansai', lonlat: [135.59, 34.21], emoji: '🧘', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Koyasan is a mountaintop town of over 100 temples, founded by the monk Kukai more than 1,200 years ago.',
      'Visitors can stay overnight in temples (shukubo) and eat monks’ vegetarian food.',
      'Okunoin, Japan’s largest cemetery, is lined with mossy graves and stone lanterns under giant cedars.',
    ],
    npc: { name: 'Kukai', jp: 'くうかい', look: L('#d7ccc8', '#8d6e63', 'plain', '#3d2b1f', 'none'), hello: ['おてらに とまったことが ありますか。', 'Have you ever stayed at a temple?'] },
  },
  {
    id: 'okayama', name: 'Okayama', jp: '岡山', reading: 'おかやま', region: 'Chugoku', lonlat: [133.93, 34.66], emoji: '🍑', transport: 'shinkansen', tier: 'N4',
    teaches: [],
    facts: [
      'Okayama is the home of Momotaro, the Peach Boy who fought ogres with a dog, a monkey and a pheasant.',
      'Okayama Castle is nicknamed “Crow Castle” for its black walls.',
      'Korakuen is one of Japan’s three great gardens, right across the river from the castle.',
    ],
    npc: { name: 'Momo', jp: 'もも', look: L('#ffb3c1', '#e5627f', 'plain', '#3d85c6', 'headband'), hello: ['ももは りんごより あまいです！', 'Peaches are sweeter than apples!'] },
  },
  {
    id: 'tottori', name: 'Tottori', jp: '鳥取', reading: 'とっとり', region: 'Chugoku', lonlat: [134.24, 35.5], emoji: '🐫', transport: 'bus', tier: 'N4',
    teaches: [],
    facts: [
      'The Tottori Sand Dunes stretch about 16 km along the Sea of Japan — you can even ride a camel!',
      'Tottori is the least-populated prefecture in Japan.',
      'In nearby Sakaiminato, a street is lined with bronze statues of yokai from the manga GeGeGe no Kitaro.',
    ],
    npc: { name: 'Suna', jp: 'すな', look: L('#e8c872', '#c9a227', 'spots', '#3d85c6', 'straw'), hello: ['すなで あそんだり、はしったり しよう！', 'Let’s play in the sand, run around and more!'] },
  },
  {
    id: 'matsue', name: 'Matsue & Izumo', jp: '松江', reading: 'まつえ', region: 'Chugoku', lonlat: [133.05, 35.47], emoji: '⛩️', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Matsue Castle is one of the five National Treasure castle keeps — dark, wooden and original.',
      'Izumo Taisha is said to be where Japan’s gods gather every October to discuss people’s fates and matches.',
      'The writer Lafcadio Hearn lived here and collected Japanese ghost stories.',
    ],
    npc: { name: 'En', jp: 'えん', look: L('#fff3e0', '#f4b183', 'calico', '#c2185b', 'bow'), hello: ['かみさまは ここに いると おもいます。', 'I think the gods are here.'] },
  },
  {
    id: 'matsumoto', name: 'Matsumoto', jp: '松本', reading: 'まつもと', region: 'Chubu', lonlat: [137.97, 36.24], emoji: '🏯', transport: 'plane', tier: 'N4',
    teaches: [],
    facts: [
      'Matsumoto Castle is a National Treasure — a black “Crow Castle” with the Japan Alps behind it.',
      'Inside the keep, the wooden stairs are so steep they feel like ladders.',
      'Nearby Kamikochi is a beautiful mountain valley popular with hikers.',
    ],
    npc: { name: 'Karasu', jp: 'からす', look: L('#2b2b2b', '#111', 'plain', '#ffd24a', 'crown'), hello: ['てんしゅに のぼる ことが できますよ。', 'You can climb the castle keep!'] },
  },
  {
    id: 'nagano', name: 'Nagano', jp: '長野', reading: 'ながの', region: 'Chubu', lonlat: [138.19, 36.65], emoji: '🐒', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Wild snow monkeys at Jigokudani soak in hot springs to keep warm in winter.',
      'Zenko-ji temple has drawn pilgrims for about 1,400 years.',
      'Nagano hosted the 1998 Winter Olympics and is famous for soba noodles.',
    ],
    npc: { name: 'Saru', jp: 'さる', look: L('#c9a27a', '#8b5a2b', 'plain', '#cc0000', 'scarf'), hello: ['しゅくだいを しなければ なりません…', 'I have to do my homework…'] },
  },
  {
    id: 'kusatsu', name: 'Kusatsu Onsen', jp: '草津', reading: 'くさつ', region: 'Kanto', lonlat: [138.6, 36.62], emoji: '♨️', transport: 'bus', tier: 'N4',
    teaches: [],
    facts: [
      'Kusatsu is one of Japan’s most famous hot-spring towns, with very hot, sulfur-rich water.',
      'At its center, the Yubatake (“hot water field”) steams as spring water flows down wooden channels.',
      'In the yumomi show, people stir the hot water with long boards while singing to cool it down.',
    ],
    npc: { name: 'Yumomi', jp: 'ゆもみ', look: L('#b0bec5', '#78909c', 'tabby', '#cc0000', 'headband'), hello: ['おゆが あついから、まぜます！', 'The water’s hot, so we stir it!'] },
  },
  {
    id: 'hiraizumi', name: 'Hiraizumi', jp: '平泉', reading: 'ひらいずみ', region: 'Tohoku', lonlat: [141.12, 38.99], emoji: '✨', transport: 'shinkansen', tier: 'N4',
    teaches: [],
    facts: [
      'Hiraizumi was once a rich northern capital that rivaled Kyoto, about 900 years ago.',
      'Chuson-ji’s Konjikido (Golden Hall) is covered inside and out with gold leaf.',
      'The poet Basho wrote a famous haiku here about summer grass and the dreams of old warriors.',
    ],
    npc: { name: 'Kin', jp: 'こがね', look: L('#ffd24a', '#e0a800', 'plain', '#2b2b2b', 'beret'), hello: ['こどもの とき、ここに きました。', 'I came here as a child.'] },
  },
  {
    id: 'yamagata', name: 'Yamagata', jp: '山形', reading: 'やまがた', region: 'Tohoku', lonlat: [140.36, 38.24], emoji: '🍒', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Yamadera is a temple perched on a cliff, reached by about 1,000 stone steps.',
      'In winter, the trees on Mount Zao freeze into “snow monsters” (juhyo).',
      'Yamagata grows most of Japan’s cherries, and every autumn holds a giant taro-stew (imoni) party.',
    ],
    npc: { name: 'Sakuranbo', jp: 'さくらんぼ', look: L('#cc0000', '#8b0000', 'plain', '#6aa84f', 'bow'), hello: ['うえに ついたら、やすみましょう！', 'When we reach the top, let’s rest!'] },
  },
  {
    id: 'kawagoe', name: 'Kawagoe', jp: '川越', reading: 'かわごえ', region: 'Kanto', lonlat: [139.49, 35.92], emoji: '🔔', transport: 'train', tier: 'N4',
    teaches: [],
    facts: [
      'Kawagoe is called “Little Edo” for its streets of old clay-walled storehouses (kura).',
      'The wooden Toki no Kane bell tower has rung the time for centuries.',
      'Candy Alley sells old-fashioned sweets, and the town is famous for sweet potatoes.',
    ],
    npc: { name: 'Edo', jp: 'えど', look: L('#9e9e9e', '#616161', 'tuxedo', '#ffd24a', 'straw'), hello: ['らいねんも にほんに くる つもりですか。', 'Are you planning to come to Japan next year too?'] },
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
