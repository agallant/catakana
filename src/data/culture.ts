/** Sightseeing, souvenirs and trivia for each stop: the "learn about Japan" side of the journey. */

export type SpotTag = 'castle' | 'heritage';

export interface Spot {
  name: string;
  /** castle and/or UNESCO World Heritage (these become passport collectibles) */
  tags?: SpotTag[];
  /** Japanese name; may use {kanji|kana} furigana markup */
  jp: string;
  emoji: string;
  about: string;
}

export interface Trivia {
  q: string;
  options: string[];
  /** index into options */
  answer: number;
}

export interface Souvenir {
  name: string;
  jp: string;
  emoji: string;
  cost: number;
}

export interface StopCulture {
  spots: Spot[];
  trivia: Trivia[];
  souvenir: Souvenir;
}

export const CULTURE: Record<string, StopCulture> = {
  tokyo: {
    spots: [
      { name: 'Shibuya Crossing', jp: '{渋谷|しぶや}', emoji: '🚦', about: 'One of the busiest pedestrian crossings in the world — when the lights turn, people pour in from every direction.' },
      { name: 'Senso-ji Temple', jp: '{浅草寺|せんそうじ}', emoji: '🏮', about: 'Tokyo’s oldest temple, in Asakusa, with a giant red lantern at the Kaminarimon (Thunder Gate).' },
      { name: 'Tokyo Skytree', jp: 'スカイツリー', emoji: '🗼', about: 'At 634 m, the tallest tower in Japan. On clear days you can see Mt. Fuji from the top.' },
    ],
    trivia: [
      { q: 'What does the maneki-neko (beckoning cat) do?', options: ['Waves its paw to invite good luck', 'Guards temples from foxes', 'Delivers the mail'], answer: 0 },
      { q: 'How tall is the Tokyo Skytree?', options: ['333 m', '634 m', '1,000 m'], answer: 1 },
    ],
    souvenir: { name: 'Maneki-neko figurine', jp: 'まねきねこ', emoji: '🐈', cost: 30 },
  },
  yokohama: {
    spots: [
      { name: 'Chinatown', jp: '{中華街|ちゅうかがい}', emoji: '🥟', about: 'Japan’s biggest Chinatown, packed with steamed-bun stands and colorful gates.' },
      { name: 'Minato Mirai', jp: 'みなとみらい', emoji: '🎡', about: 'A seaside district with a giant Ferris wheel and a view of the harbor.' },
      { name: 'Cup Noodles Museum', jp: 'カップヌードルミュージアム', emoji: '🍜', about: 'Instant ramen was invented in Japan by Momofuku Ando. Here you can design your own cup!' },
    ],
    trivia: [
      { q: 'Which food was invented in Japan by Momofuku Ando?', options: ['Sushi', 'Instant ramen', 'Tempura'], answer: 1 },
      { q: 'Yokohama is famous as a…', options: ['Mountain resort', 'Port city', 'Desert town'], answer: 1 },
    ],
    souvenir: { name: 'Steamed pork bun', jp: 'にくまん', emoji: '🥟', cost: 20 },
  },
  kamakura: {
    spots: [
      { name: 'Great Buddha', jp: '{大仏|だいぶつ}', emoji: '🧘', about: 'A bronze Buddha about 13 m tall that has sat outdoors since the temple hall around it washed away centuries ago.' },
      { name: 'Enoden Railway', jp: '{江ノ電|えのでん}', emoji: '🚃', about: 'A cute little train that runs along the coast, sometimes right between houses.' },
      { name: 'Hase-dera', jp: '{長谷寺|はせでら}', emoji: '💐', about: 'A hillside temple famous for its hydrangea flowers in June.' },
    ],
    trivia: [
      { q: 'The Great Buddha of Kamakura sits…', options: ['Inside a giant hall', 'Outdoors', 'Underwater'], answer: 1 },
      { q: 'Kamakura was the center of which government?', options: ['The first samurai shogunate', 'The modern parliament', 'The Ryukyu Kingdom'], answer: 0 },
    ],
    souvenir: { name: 'Dove-shaped cookie', jp: 'はとサブレー', emoji: '🕊️', cost: 20 },
  },
  hakone: {
    spots: [
      { name: 'Owakudani', jp: '{大涌谷|おおわくだに}', emoji: '🥚', about: 'A steaming volcanic valley where eggs are boiled black in the hot springs.' },
      { name: 'Lake Ashi', jp: '{芦ノ湖|あしのこ}', emoji: '⛵', about: 'Sightseeing boats shaped like pirate ships cruise past a red torii gate standing in the lake.' },
      { name: 'Onsen ryokan', jp: '{温泉|おんせん}', emoji: '♨️', about: 'At a ryokan (traditional inn) you wear a yukata robe and wash before getting into the hot bath.' },
    ],
    trivia: [
      { q: 'What should you do before getting into an onsen bath?', options: ['Wash your body first', 'Put on a swimsuit', 'Drink a coffee'], answer: 0 },
      { q: 'Owakudani’s eggs turn black because of…', options: ['Squid ink', 'Volcanic minerals in the water', 'Charcoal'], answer: 1 },
    ],
    souvenir: { name: 'Black egg (kuro-tamago)', jp: 'くろたまご', emoji: '🥚', cost: 15 },
  },
  fuji: {
    spots: [
      { name: 'Mount Fuji', tags: ['heritage'], jp: '{富士山|ふじさん}', emoji: '🗻', about: 'Japan’s tallest peak at 3,776 m — an active volcano and a sacred mountain.' },
      { name: 'Tea fields', jp: '{茶畑|ちゃばたけ}', emoji: '🍵', about: 'Rows of bright green tea bushes cover the hills of Shizuoka.' },
      { name: 'Chureito Pagoda', jp: '{忠霊塔|ちゅうれいとう}', emoji: '⛩️', about: 'A five-story pagoda framed by cherry blossoms and Mt. Fuji — a classic postcard view.' },
    ],
    trivia: [
      { q: 'How tall is Mount Fuji?', options: ['2,000 m', '3,776 m', '8,848 m'], answer: 1 },
      { q: 'Shizuoka is especially famous for…', options: ['Green tea', 'Snow monkeys', 'Pineapples'], answer: 0 },
    ],
    souvenir: { name: 'Bag of green tea', jp: 'おちゃ', emoji: '🍵', cost: 25 },
  },
  nagoya: {
    spots: [
      { name: 'Nagoya Castle', tags: ['castle'], jp: '{名古屋城|なごやじょう}', emoji: '🏯', about: 'Golden shachihoko — mythical tiger-headed fish — guard the roof.' },
      { name: 'Atsuta Shrine', jp: '{熱田神宮|あつたじんぐう}', emoji: '⛩️', about: 'One of Japan’s most important Shinto shrines, said to hold a legendary sacred sword.' },
      { name: 'Railway museum', jp: 'リニア・{鉄道館|てつどうかん}', emoji: '🚄', about: 'See record-breaking shinkansen and maglev trains up close.' },
    ],
    trivia: [
      { q: 'What is on the roof of Nagoya Castle?', options: ['Golden tiger-fish (shachihoko)', 'A giant cat', 'Solar panels'], answer: 0 },
      { q: 'Which big car company comes from the Nagoya area?', options: ['Toyota', 'Ferrari', 'Volvo'], answer: 0 },
    ],
    souvenir: { name: 'Uiro rice sweet', jp: 'ういろう', emoji: '🍡', cost: 20 },
  },
  kyoto: {
    spots: [
      { name: 'Kiyomizu-dera', tags: ['heritage'], jp: '{清水寺|きよみずでら}', emoji: '🏯', about: 'A wooden temple whose huge veranda stands on tall pillars without a single nail.' },
      { name: 'Fushimi Inari', jp: '{伏見稲荷|ふしみいなり}', emoji: '⛩️', about: 'Thousands of vermilion torii gates — and fox statues, the messengers of the rice god Inari.' },
      { name: 'Kinkaku-ji', tags: ['heritage'], jp: '{金閣寺|きんかくじ}', emoji: '✨', about: 'The Golden Pavilion, covered in gold leaf, shines over a mirror-like pond.' },
      { name: 'Arashiyama bamboo grove', jp: '{嵐山|あらしやま}', emoji: '🎋', about: 'Towering bamboo stalks creak and sway in the wind along a narrow path.' },
    ],
    trivia: [
      { q: 'What animal statues guard Fushimi Inari shrine?', options: ['Foxes', 'Cats', 'Dragons'], answer: 0 },
      { q: 'For how long was Kyoto the capital?', options: ['About 10 years', 'Over 1,000 years', 'It never was'], answer: 1 },
    ],
    souvenir: { name: 'Yatsuhashi cinnamon sweet', jp: 'やつはし', emoji: '🍥', cost: 25 },
  },
  osaka: {
    spots: [
      { name: 'Dotonbori', jp: '{道頓堀|どうとんぼり}', emoji: '🌃', about: 'A canal lined with giant neon signs, a mechanical crab, and the famous Glico running man.' },
      { name: 'Osaka Castle', tags: ['castle'], jp: '{大阪城|おおさかじょう}', emoji: '🏯', about: 'Built for Toyotomi Hideyoshi, the leader who unified Japan in the 1500s.' },
      { name: 'Takoyaki stand', jp: 'たこやき', emoji: '🐙', about: 'Batter balls with octopus inside, flipped with picks in a special dimpled pan.' },
    ],
    trivia: [
      { q: 'What is inside takoyaki?', options: ['Octopus', 'Chocolate', 'Cheese only'], answer: 0 },
      { q: 'Osaka’s famous motto “kuidaore” means…', options: ['Work hard', 'Eat until you drop', 'Sleep early'], answer: 1 },
    ],
    souvenir: { name: 'Takoyaki keychain', jp: 'たこやき', emoji: '🐙', cost: 20 },
  },
  nara: {
    spots: [
      { name: 'Horyu-ji', tags: ['heritage'], jp: '{法隆寺|ほうりゅうじ}', emoji: '🛕', about: 'Home to some of the oldest wooden buildings in the world, from around 1,300 years ago.' },
      { name: 'Nara Park', jp: '{奈良公園|ならこうえん}', emoji: '🦌', about: 'Wild deer roam freely; buy shika-senbei crackers and they may bow to you.' },
      { name: 'Todai-ji', tags: ['heritage'], jp: '{東大寺|とうだいじ}', emoji: '🛕', about: 'A giant bronze Buddha in one of the largest wooden buildings in the world.' },
      { name: 'Kasuga Taisha', tags: ['heritage'], jp: '{春日大社|かすがたいしゃ}', emoji: '🏮', about: 'A shrine with thousands of stone and bronze lanterns.' },
    ],
    trivia: [
      { q: 'What do Nara’s deer famously do for crackers?', options: ['Bow', 'Sing', 'Dance'], answer: 0 },
      { q: 'Nara was Japan’s capital around…', options: ['710', '1945', '2000'], answer: 0 },
    ],
    souvenir: { name: 'Deer crackers', jp: 'しかせんべい', emoji: '🍘', cost: 15 },
  },
  himeji: {
    spots: [
      { name: 'Himeji Castle', tags: ['castle', 'heritage'], jp: '{姫路城|ひめじじょう}', emoji: '🏰', about: 'The White Heron Castle — an original castle that survived wars and earthquakes.' },
      { name: 'Koko-en Garden', jp: '{好古園|こうこえん}', emoji: '🌿', about: 'Nine connected Japanese gardens beside the castle, with koi ponds and tea houses.' },
    ],
    trivia: [
      { q: 'Himeji Castle’s nickname is…', options: ['White Heron Castle', 'Black Crow Castle', 'Golden Cat Castle'], answer: 0 },
      { q: 'Why are castle paths twisty?', options: ['To confuse attackers', 'For fun', 'To save money'], answer: 0 },
    ],
    souvenir: { name: 'Castle postcard', jp: 'はがき', emoji: '🏯', cost: 15 },
  },
  hiroshima: {
    spots: [
      { name: 'Peace Memorial Park', tags: ['heritage'], jp: '{平和記念公園|へいわきねんこうえん}', emoji: '🕊️', about: 'A park for remembering and for wishing for peace. Visitors fold paper cranes as a symbol of peace.' },
      { name: 'Itsukushima Shrine', tags: ['heritage'], jp: '{厳島神社|いつくしまじんじゃ}', emoji: '⛩️', about: 'On Miyajima island, its big torii gate seems to float on the sea at high tide.' },
      { name: 'Okonomiyaki', jp: 'お{好|この}み{焼|や}き', emoji: '🥞', about: 'Hiroshima-style is layered: batter, cabbage, noodles, egg, and sauce.' },
    ],
    trivia: [
      { q: 'Paper cranes (orizuru) are a symbol of…', options: ['Peace', 'Money', 'Winter'], answer: 0 },
      { q: 'Hiroshima-style okonomiyaki includes…', options: ['Noodles', 'Ice cream', 'Rice only'], answer: 0 },
    ],
    souvenir: { name: 'Momiji manju (maple cake)', jp: 'もみじまんじゅう', emoji: '🍁', cost: 20 },
  },
  matsuyama: {
    spots: [
      { name: 'Dogo Onsen', jp: '{道後温泉|どうごおんせん}', emoji: '♨️', about: 'A grand old wooden bathhouse in one of Japan’s oldest hot spring towns.' },
      { name: 'Matsuyama Castle', tags: ['castle'], jp: '{松山城|まつやまじょう}', emoji: '🏯', about: 'Ride a chairlift up the hill to an original castle overlooking the city.' },
      { name: 'Aoshima (cat island)', jp: '{青島|あおしま}', emoji: '🐈', about: 'A tiny island with dozens of cats and only a handful of people.' },
    ],
    trivia: [
      { q: 'Ehime Prefecture is famous for…', options: ['Mikan oranges', 'Penguins', 'Skyscrapers'], answer: 0 },
      { q: 'On Aoshima there are more… than people.', options: ['Cats', 'Cars', 'Castles'], answer: 0 },
    ],
    souvenir: { name: 'Mikan juice', jp: 'みかんジュース', emoji: '🍊', cost: 20 },
  },
  fukuoka: {
    spots: [
      { name: 'Fukuoka Castle ruins', tags: ['castle'], jp: '{福岡城|ふくおかじょう}', emoji: '🌸', about: 'Huge stone walls in Maizuru Park — a favorite spot for cherry blossom picnics.' },
      { name: 'Yatai food stalls', jp: '{屋台|やたい}', emoji: '🏮', about: 'Tiny open-air stalls where strangers squeeze together for ramen and skewers.' },
      { name: 'Dazaifu Tenmangu', jp: '{太宰府天満宮|だざいふてんまんぐう}', emoji: '📚', about: 'Students visit this shrine to pray for good exam results.' },
    ],
    trivia: [
      { q: 'Hakata ramen soup is made from…', options: ['Pork bones (tonkotsu)', 'Chocolate', 'Seaweed only'], answer: 0 },
      { q: 'Katakana is mostly used for…', options: ['Foreign loanwords and names', 'Grammar endings', 'Numbers'], answer: 0 },
    ],
    souvenir: { name: 'Mentaiko (spicy cod roe)', jp: 'めんたいこ', emoji: '🌶️', cost: 25 },
  },
  nagasaki: {
    spots: [
      { name: 'Dejima', jp: '{出島|でじま}', emoji: '⚓', about: 'A small fan-shaped island where Dutch traders lived during Japan’s centuries of isolation.' },
      { name: 'Glover Garden', tags: ['heritage'], jp: 'グラバー{園|えん}', emoji: '🌹', about: 'Western-style houses on a hill overlooking the harbor.' },
      { name: 'Megane Bridge', jp: '{眼鏡橋|めがねばし}', emoji: '👓', about: 'An old stone bridge whose reflection in the river looks like a pair of glasses.' },
    ],
    trivia: [
      { q: 'Castella cake came to Nagasaki from…', options: ['Portugal', 'Brazil', 'Egypt'], answer: 0 },
      { q: 'Megane-bashi means “Glasses Bridge” because…', options: ['Its reflection looks like glasses', 'It sells glasses', 'It is made of glass'], answer: 0 },
    ],
    souvenir: { name: 'Castella cake', jp: 'カステラ', emoji: '🍰', cost: 25 },
  },
  kumamoto: {
    spots: [
      { name: 'Kumamoto Castle', tags: ['castle'], jp: '{熊本城|くまもとじょう}', emoji: '🏯', about: 'Its curved stone walls, called musha-gaeshi, were made to stop warriors climbing up.' },
      { name: 'Mount Aso', jp: '{阿蘇山|あそさん}', emoji: '🌋', about: 'An active volcano inside an enormous caldera with towns and farms in it.' },
      { name: 'Kumamon Square', jp: 'くまモンスクエア', emoji: '🐻', about: 'Meet the famous black-bear mascot with rosy cheeks.' },
    ],
    trivia: [
      { q: 'Kumamon is a…', options: ['Black bear mascot', 'Robot', 'Fish'], answer: 0 },
      { q: 'Mount Aso is a…', options: ['Volcano', 'Glacier', 'Waterfall'], answer: 0 },
    ],
    souvenir: { name: 'Kumamon plush', jp: 'くまモン', emoji: '🧸', cost: 40 },
  },
  kagoshima: {
    spots: [
      { name: 'Sakurajima', jp: '{桜島|さくらじま}', emoji: '🌋', about: 'An active volcano across the bay. Locals check the “ash forecast” like a weather report!' },
      { name: 'Ibusuki sand bath', jp: '{砂蒸|すなむ}し', emoji: '🏖️', about: 'Get buried in warm volcanic sand on the beach — it’s like a hot spring without water.' },
      { name: 'Sengan-en', tags: ['heritage'], jp: '{仙巌園|せんがんえん}', emoji: '🌳', about: 'A lord’s garden that uses the volcano and bay as “borrowed scenery”.' },
    ],
    trivia: [
      { q: 'What falls from the sky in Kagoshima sometimes?', options: ['Volcanic ash', 'Frogs', 'Candy'], answer: 0 },
      { q: 'Kagoshima is famous for…', options: ['Sweet potatoes', 'Penguins', 'Maple syrup'], answer: 0 },
    ],
    souvenir: { name: 'Roasted sweet potato', jp: 'やきいも', emoji: '🍠', cost: 15 },
  },
  okinawa: {
    spots: [
      { name: 'Shuri Castle', tags: ['castle', 'heritage'], jp: '{首里城|しゅりじょう}', emoji: '🏯', about: 'The red palace of the Ryukyu Kingdom, being carefully rebuilt after a 2019 fire.' },
      { name: 'Churaumi Aquarium', jp: '{美|ちゅ}ら{海水族館|うみすいぞくかん}', emoji: '🦈', about: 'Whale sharks glide through one of the world’s largest aquarium tanks.' },
      { name: 'Kokusai Street', jp: '{国際通|こくさいどお}り', emoji: '🌺', about: 'A lively street of shops selling shisa statues, sea salt and purple sweet-potato tarts.' },
    ],
    trivia: [
      { q: 'Which martial art was born in Okinawa?', options: ['Karate', 'Sumo', 'Kendo'], answer: 0 },
      { q: 'Shisa statues on roofs are…', options: ['Lion-dog guardians', 'Weather vanes', 'Mailboxes'], answer: 0 },
    ],
    souvenir: { name: 'Mini shisa pair', jp: 'シーサー', emoji: '🦁', cost: 35 },
  },
  sendai: {
    spots: [
      { name: 'Aoba Castle ruins', tags: ['castle'], jp: '{青葉城|あおばじょう}', emoji: '🐎', about: 'Date Masamune’s hilltop castle site, guarded by a statue of him on horseback.' },
      { name: 'Zuihoden', jp: '{瑞鳳殿|ずいほうでん}', emoji: '⛩️', about: 'The colorful mausoleum of Date Masamune, the one-eyed samurai lord who founded Sendai.' },
      { name: 'Matsushima Bay', jp: '{松島|まつしま}', emoji: '🏝️', about: 'Over 200 pine-covered islets — one of Japan’s “Three Great Views”.' },
      { name: 'Tanabata Festival', jp: '{七夕|たなばた}', emoji: '🎋', about: 'People write wishes on paper strips and hang them on bamboo.' },
    ],
    trivia: [
      { q: 'At Tanabata, people write… on paper strips.', options: ['Wishes', 'Shopping lists', 'Train times'], answer: 0 },
      { q: 'Sendai’s famous food is…', options: ['Grilled beef tongue', 'Pizza', 'Fried ice'], answer: 0 },
    ],
    souvenir: { name: 'Zunda mochi (edamame)', jp: 'ずんだもち', emoji: '🟢', cost: 20 },
  },
  tashiro: {
    spots: [
      { name: 'Cat shrine', jp: '{猫神社|ねこじんじゃ}', emoji: '⛩️', about: 'A small shrine where people pray for the island’s cats and leave cat figurines.' },
      { name: 'Fishing harbor', jp: '{漁港|ぎょこう}', emoji: '🎣', about: 'Fishermen long believed watching the cats could predict the weather and the catch.' },
      { name: 'Manga Island', jp: 'マンガアイランド', emoji: '🏕️', about: 'Cat-shaped cabins designed by manga artists — you can stay the night!' },
    ],
    trivia: [
      { q: 'On Tashirojima, who outnumbers the people?', options: ['Cats', 'Dogs', 'Robots'], answer: 0 },
      { q: 'Fishermen believed the cats brought…', options: ['Good luck', 'Rain', 'Bad luck'], answer: 0 },
    ],
    souvenir: { name: 'Lucky cat charm', jp: 'おまもり', emoji: '🧧', cost: 30 },
  },
  sapporo: {
    spots: [
      { name: 'Snow Festival', jp: '{雪|ゆき}まつり', emoji: '☃️', about: 'Every February, Odori Park fills with giant snow and ice sculptures.' },
      { name: 'Ramen Alley', jp: 'ラーメン{横丁|よこちょう}', emoji: '🍜', about: 'A narrow alley packed with tiny shops serving buttery miso ramen.' },
      { name: 'Clock Tower', jp: '{時計台|とけいだい}', emoji: '🕰️', about: 'A wooden clock tower from 1878, one of Sapporo’s oldest buildings.' },
    ],
    trivia: [
      { q: 'Sapporo invented which ramen?', options: ['Miso ramen', 'Tonkotsu ramen', 'Cold ramen'], answer: 0 },
      { q: 'The Sapporo Snow Festival happens in…', options: ['February', 'July', 'October'], answer: 0 },
    ],
    souvenir: { name: 'White chocolate cookies', jp: 'しろいこいびと', emoji: '🍪', cost: 30 },
  },
  hakodate: {
    spots: [
      { name: 'Goryokaku', tags: ['castle'], jp: '{五稜郭|ごりょうかく}', emoji: '⭐', about: 'A star-shaped Western-style fort from the 1860s, pink with cherry blossoms in spring.' },
      { name: 'Morning Market', jp: '{朝市|あさいち}', emoji: '🦑', about: 'Stalls of crab, sea urchin and squid you can fish for yourself.' },
      { name: 'Mount Hakodate', jp: '{函館山|はこだてやま}', emoji: '🌃', about: 'Take the ropeway up for a sparkling night view of the city between two bays.' },
    ],
    trivia: [
      { q: 'What shape is Goryokaku fort?', options: ['A star', 'A circle', 'A cat'], answer: 0 },
      { q: 'Hakodate is on which island?', options: ['Hokkaido', 'Kyushu', 'Okinawa'], answer: 0 },
    ],
    souvenir: { name: 'Squid snack', jp: 'いかめし', emoji: '🦑', cost: 25 },
  },
  aomori: {
    spots: [
      { name: 'Nebuta Museum', jp: 'ねぶたの{家|いえ}', emoji: '🏮', about: 'See the giant glowing paper floats from the Nebuta Festival up close.' },
      { name: 'Apple orchards', jp: 'りんご{園|えん}', emoji: '🍎', about: 'Aomori grows about half of Japan’s apples.' },
      { name: 'Hirosaki Castle', tags: ['castle'], jp: '{弘前城|ひろさきじょう}', emoji: '🌸', about: 'One of Japan’s most famous cherry blossom spots, with petals carpeting the moat.' },
    ],
    trivia: [
      { q: 'Aomori is famous for growing…', options: ['Apples', 'Bananas', 'Coffee'], answer: 0 },
      { q: 'The Seikan Tunnel goes…', options: ['Under the sea', 'Through a volcano', 'Over a lake'], answer: 0 },
    ],
    souvenir: { name: 'Apple juice', jp: 'りんごジュース', emoji: '🧃', cost: 20 },
  },
  akita: {
    spots: [
      { name: 'Kakunodate', jp: '{角館|かくのだて}', emoji: '🏯', about: 'A samurai street with black wooden walls and weeping cherry trees.' },
      { name: 'Namahage Museum', jp: 'なまはげ{館|かん}', emoji: '👹', about: 'Meet the straw-cloaked “demons” who visit homes on New Year’s Eve.' },
      { name: 'Akita dog village', jp: '{秋田犬|あきたいぬ}', emoji: '🐕', about: 'Fluffy, loyal Akita dogs — Hachiko is the most famous of all.' },
    ],
    trivia: [
      { q: 'Hachiko was what kind of dog?', options: ['Akita', 'Shiba', 'Poodle'], answer: 0 },
      { q: 'Namahage visit homes on…', options: ['New Year’s Eve', 'Halloween', 'Birthdays'], answer: 0 },
    ],
    souvenir: { name: 'Kiritanpo rice sticks', jp: 'きりたんぽ', emoji: '🍢', cost: 25 },
  },
  nikko: {
    spots: [
      { name: 'Sleeping Cat carving', tags: ['heritage'], jp: '{眠|ねむ}り{猫|ねこ}', emoji: '😴', about: 'A tiny carved cat asleep above a gate at Toshogu — a National Treasure!' },
      { name: 'Three Wise Monkeys', tags: ['heritage'], jp: '{三猿|さんざる}', emoji: '🙈', about: 'See no evil, hear no evil, speak no evil — carved on the sacred stable.' },
      { name: 'Kegon Falls', jp: '{華厳滝|けごんのたき}', emoji: '💦', about: 'A roaring waterfall nearly 100 m tall.' },
    ],
    trivia: [
      { q: 'What animal is the famous Nemuri carving?', options: ['A sleeping cat', 'A dragon', 'A fox'], answer: 0 },
      { q: 'The three wise monkeys cover their eyes, ears and…', options: ['Mouth', 'Tail', 'Feet'], answer: 0 },
    ],
    souvenir: { name: 'Sleeping-cat charm', jp: 'ねむりねこ', emoji: '😺', cost: 35 },
  },
  kanazawa: {
    spots: [
      { name: 'Kanazawa Castle Park', tags: ['castle'], jp: '{金沢城|かなざわじょう}', emoji: '🏯', about: 'White castle walls with lead roof tiles, right next to Kenroku-en.' },
      { name: 'Kenroku-en', jp: '{兼六園|けんろくえん}', emoji: '🌲', about: 'A grand garden where ropes hold up tree branches against winter snow (yukitsuri).' },
      { name: 'Higashi Chaya', jp: 'ひがし{茶屋街|ちゃやがい}', emoji: '🍵', about: 'An old teahouse district with wooden lattice fronts.' },
      { name: 'Omicho Market', jp: '{近江町市場|おうみちょういちば}', emoji: '🦀', about: 'Fresh seafood, crab, and sushi rice bowls piled high.' },
    ],
    trivia: [
      { q: 'Kanazawa makes almost all of Japan’s…', options: ['Gold leaf', 'Chopsticks', 'Robots'], answer: 0 },
      { q: 'Kenroku-en is one of Japan’s three great…', options: ['Gardens', 'Bridges', 'Mountains'], answer: 0 },
    ],
    souvenir: { name: 'Gold-leaf ice cream', jp: 'きんぱくアイス', emoji: '🍦', cost: 30 },
  },
  shirakawa: {
    spots: [
      { name: 'Gassho farmhouses', tags: ['heritage'], jp: '{合掌造|がっしょうづく}り', emoji: '🛖', about: 'Huge thatched roofs built without nails, steep like hands in prayer.' },
      { name: 'Ogimachi viewpoint', jp: '{展望台|てんぼうだい}', emoji: '🔭', about: 'Look down on the whole village nestled in the valley.' },
    ],
    trivia: [
      { q: 'Why are the roofs so steep?', options: ['So snow slides off', 'For decoration', 'To catch rain for drinking'], answer: 0 },
      { q: 'Gassho-zukuri means roofs shaped like…', options: ['Hands in prayer', 'Cat ears', 'Boats'], answer: 0 },
    ],
    souvenir: { name: 'Mini thatched house', jp: 'がっしょうづくり', emoji: '🏡', cost: 30 },
  },
  takayama: {
    spots: [
      { name: 'Sanmachi old town', jp: '{古|ふる}い{町並|まちな}み', emoji: '🏘️', about: 'Dark wooden houses, sake breweries and little craft shops.' },
      { name: 'Morning markets', jp: '{朝市|あさいち}', emoji: '🧺', about: 'Farmers sell pickles, vegetables and flowers by the river.' },
      { name: 'Festival floats', jp: '{屋台|やたい}', emoji: '🎎', about: 'Ornate festival floats with mechanical puppets come out in spring and autumn.' },
    ],
    trivia: [
      { q: 'Sarubobo dolls are…', options: ['Lucky red “baby monkeys”', 'Scary masks', 'Kites'], answer: 0 },
      { q: 'How do you ask “How much is it?”', options: ['いくらですか', 'なんじですか', 'だれですか'], answer: 0 },
    ],
    souvenir: { name: 'Sarubobo doll', jp: 'さるぼぼ', emoji: '🧸', cost: 25 },
  },
  ise: {
    spots: [
      { name: 'Ise Jingu', jp: '{伊勢神宮|いせじんぐう}', emoji: '⛩️', about: 'Japan’s holiest shrine, built of plain cypress wood and rebuilt every 20 years.' },
      { name: 'Okage Yokocho', jp: 'おかげ{横丁|よこちょう}', emoji: '🏮', about: 'An old-style street for snacks like akafuku mochi and Ise udon.' },
      { name: 'Meoto Iwa', jp: '{夫婦岩|めおといわ}', emoji: '🪨', about: 'Two “married rocks” in the sea, joined by a thick rope.' },
    ],
    trivia: [
      { q: 'Ise Jingu’s main buildings are rebuilt every…', options: ['20 years', '2 years', '200 years'], answer: 0 },
      { q: 'The particle で can mean…', options: ['By means of (でんしゃで)', 'Who', 'Yesterday'], answer: 0 },
    ],
    souvenir: { name: 'Akafuku mochi', jp: 'あかふく', emoji: '🍡', cost: 25 },
  },
  kobe: {
    spots: [
      { name: 'Harborland', jp: 'ハーバーランド', emoji: '🎡', about: 'A waterfront with a Ferris wheel and the red Kobe Port Tower.' },
      { name: 'Kitano Ijinkan', jp: '{北野異人館|きたのいじんかん}', emoji: '🏡', about: 'Western-style homes built by foreign traders in the 1800s.' },
      { name: 'Nankinmachi', jp: '{南京町|なんきんまち}', emoji: '🥟', about: 'Kobe’s lively Chinatown.' },
    ],
    trivia: [
      { q: 'Kobe is famous for which beef?', options: ['Kobe beef', 'Texas beef', 'No beef'], answer: 0 },
      { q: 'For living things you say…', options: ['います', 'あります', 'です'], answer: 0 },
    ],
    souvenir: { name: 'Kobe pudding', jp: 'プリン', emoji: '🍮', cost: 25 },
  },
  kochi: {
    spots: [
      { name: 'Hirome Market', jp: 'ひろめ{市場|いちば}', emoji: '🔥', about: 'A food hall where bonito is seared over roaring straw flames.' },
      { name: 'Katsurahama', jp: '{桂浜|かつらはま}', emoji: '🏖️', about: 'A beach with a statue of the samurai Sakamoto Ryoma gazing out to sea.' },
      { name: 'Shimanto River', jp: '{四万十川|しまんとがわ}', emoji: '🏞️', about: 'Crossed by low “sinking bridges” with no railings that let floods pass over.' },
    ],
    trivia: [
      { q: 'Katsuo no tataki is bonito that is…', options: ['Seared over straw fire', 'Frozen', 'Fried in chocolate'], answer: 0 },
      { q: 'たべました means…', options: ['ate', 'will eat', 'don’t eat'], answer: 0 },
    ],
    souvenir: { name: 'Yuzu drink', jp: 'ゆずジュース', emoji: '🍋', cost: 20 },
  },
  beppu: {
    spots: [
      { name: 'Hells of Beppu', jp: '{地獄|じごく}めぐり', emoji: '🌋', about: 'Tour boiling pools of cobalt blue, blood red and bubbling mud.' },
      { name: 'Steam cooking', jp: '{地獄蒸|じごくむ}し', emoji: '🥟', about: 'Cook eggs and vegetables in baskets over natural hot spring steam.' },
      { name: 'Sand bath', jp: '{砂湯|すなゆ}', emoji: '🏖️', about: 'Be buried in naturally heated sand by the sea.' },
    ],
    trivia: [
      { q: 'The “Hells” of Beppu are…', options: ['Colorful hot pools', 'Haunted houses', 'Spicy foods'], answer: 0 },
      { q: 'はいりたい means…', options: ['want to enter', 'entered', 'won’t enter'], answer: 0 },
    ],
    souvenir: { name: 'Hot-spring pudding', jp: 'じごくプリン', emoji: '🍮', cost: 25 },
  },
  yakushima: {
    spots: [
      { name: 'Jomon Sugi', tags: ['heritage'], jp: '{縄文杉|じょうもんすぎ}', emoji: '🌲', about: 'A giant ancient cedar, reached by a long day hike through the forest.' },
      { name: 'Shiratani Unsuikyo', tags: ['heritage'], jp: '{白谷雲水峡|しらたにうんすいきょう}', emoji: '🍃', about: 'A mossy ravine said to have inspired the forest in Princess Mononoke.' },
      { name: 'Turtle beach', jp: 'ウミガメ', emoji: '🐢', about: 'Sea turtles come ashore to lay eggs on Yakushima’s beaches in summer.' },
    ],
    trivia: [
      { q: 'Yakushima is famous for its very old…', options: ['Cedar trees', 'Skyscrapers', 'Cats only'], answer: 0 },
      { q: 'まって ください means…', options: ['Please wait', 'Please eat', 'Thank you'], answer: 0 },
    ],
    souvenir: { name: 'Cedar coaster', jp: 'やくすぎ', emoji: '🪵', cost: 30 },
  },
  hikone: {
    spots: [
      { name: 'Hikone Castle', tags: ['castle'], jp: '{彦根城|ひこねじょう}', emoji: '🏯', about: 'An original 1600s castle keep — one of five National Treasure castles.' },
      { name: 'Genkyu-en Garden', jp: '{玄宮園|げんきゅうえん}', emoji: '🌿', about: 'A lord’s strolling garden with a pond, tea house and castle view.' },
      { name: 'Lake Biwa', jp: '{琵琶湖|びわこ}', emoji: '🏞️', about: 'Japan’s largest lake, right next to the castle.' },
    ],
    trivia: [
      { q: 'What does Hikonyan wear on its head?', options: ['A red samurai helmet', 'A crown', 'A straw hat'], answer: 0 },
      { q: 'Lake Biwa is Japan’s…', options: ['Largest lake', 'Deepest sea', 'Longest river'], answer: 0 },
    ],
    souvenir: { name: 'Hikonyan plush', jp: 'ひこにゃん', emoji: '🐱', cost: 40 },
  },
  uji: {
    spots: [
      { name: 'Byodo-in', tags: ['heritage'], jp: '{平等院|びょうどういん}', emoji: '🪙', about: 'The Phoenix Hall seems to float on its pond — look for it on a 10-yen coin.' },
      { name: 'Tea street', jp: 'お{茶|ちゃ}の{道|みち}', emoji: '🍵', about: 'Shops roast tea leaves on the street — the air smells sweet and toasty.' },
      { name: 'Uji Bridge', jp: '{宇治橋|うじばし}', emoji: '🌉', about: 'One of Japan’s oldest bridges, first built over 1,300 years ago.' },
    ],
    trivia: [
      { q: 'Which coin shows Byodo-in’s Phoenix Hall?', options: ['10 yen', '100 yen', '500 yen'], answer: 0 },
      { q: 'Uji is especially famous for…', options: ['Green tea', 'Beef', 'Snow'], answer: 0 },
    ],
    souvenir: { name: 'Matcha sweets', jp: 'まっちゃスイーツ', emoji: '🍵', cost: 30 },
  },
  koyasan: {
    spots: [
      { name: 'Okunoin', tags: ['heritage'], jp: '{奥之院|おくのいん}', emoji: '🏮', about: 'A two-kilometer path of mossy graves and lanterns under giant cedars.' },
      { name: 'Danjo Garan', tags: ['heritage'], jp: '{壇上伽藍|だんじょうがらん}', emoji: '🛕', about: 'A bright vermilion pagoda at the heart of Kukai’s temple complex.' },
      { name: 'Temple lodging', jp: '{宿坊|しゅくぼう}', emoji: '🛏️', about: 'Sleep at a temple, eat shojin ryori and join the monks’ morning prayers.' },
    ],
    trivia: [
      { q: 'Who founded Koyasan?', options: ['The monk Kukai', 'A shogun', 'A cat'], answer: 0 },
      { q: 'Shojin ryori is…', options: ['Buddhist vegetarian food', 'Grilled eel', 'Fried chicken'], answer: 0 },
    ],
    souvenir: { name: 'Sesame tofu', jp: 'ごまどうふ', emoji: '⬜', cost: 25 },
  },
  okayama: {
    spots: [
      { name: 'Okayama Castle', tags: ['castle'], jp: '{岡山城|おかやまじょう}', emoji: '🏯', about: 'Black-walled “Crow Castle” standing over the Asahi River.' },
      { name: 'Korakuen', jp: '{後楽園|こうらくえん}', emoji: '🌳', about: 'One of Japan’s three great gardens, with lawns, ponds and a tea field.' },
      { name: 'Kurashiki canal', jp: '{倉敷|くらしき}', emoji: '🛶', about: 'Willows and white storehouses line a calm canal in the merchant quarter.' },
    ],
    trivia: [
      { q: 'Momotaro was born from a…', options: ['Peach', 'Melon', 'Bamboo stalk'], answer: 0 },
      { q: 'Which animals helped Momotaro?', options: ['Dog, monkey, pheasant', 'Cat, owl, fox', 'Bear, deer, crane'], answer: 0 },
    ],
    souvenir: { name: 'Kibi dango', jp: 'きびだんご', emoji: '🍡', cost: 20 },
  },
  tottori: {
    spots: [
      { name: 'Tottori Sand Dunes', jp: '{鳥取砂丘|とっとりさきゅう}', emoji: '🏜️', about: 'Huge rolling dunes by the sea — ride a camel or try sandboarding.' },
      { name: 'Mizuki Shigeru Road', jp: '{水木|みずき}しげるロード', emoji: '👻', about: 'Over 170 bronze yokai statues line this street in Sakaiminato.' },
      { name: 'Sand Museum', jp: '{砂|すな}の{美術館|びじゅつかん}', emoji: '🗿', about: 'Giant sculptures made entirely of sand, rebuilt each year with a new theme.' },
    ],
    trivia: [
      { q: 'What can you ride at the Tottori dunes?', options: ['A camel', 'An elephant', 'A train'], answer: 0 },
      { q: 'Tottori is Japan’s prefecture with the fewest…', options: ['People', 'Trees', 'Cats'], answer: 0 },
    ],
    souvenir: { name: 'Nijisseiki pear', jp: 'なし', emoji: '🍐', cost: 25 },
  },
  matsue: {
    spots: [
      { name: 'Matsue Castle', tags: ['castle'], jp: '{松江城|まつえじょう}', emoji: '🏯', about: 'One of the five National Treasure castles, ringed by a moat you can tour by boat.' },
      { name: 'Izumo Taisha', jp: '{出雲大社|いずもたいしゃ}', emoji: '⛩️', about: 'A grand shrine with an enormous straw rope; people pray here for good relationships.' },
      { name: 'Iwami Ginzan', tags: ['heritage'], jp: '{石見銀山|いわみぎんざん}', emoji: '⛏️', about: 'An old silver mine that once produced a large share of the world’s silver.' },
    ],
    trivia: [
      { q: 'In October, who is said to gather at Izumo?', options: ['Japan’s gods', 'All the cats', 'The emperors'], answer: 0 },
      { q: 'Iwami Ginzan was a mine for…', options: ['Silver', 'Coal', 'Diamonds'], answer: 0 },
    ],
    souvenir: { name: 'Wagashi tea sweet', jp: 'わがし', emoji: '🍡', cost: 25 },
  },
  matsumoto: {
    spots: [
      { name: 'Matsumoto Castle', tags: ['castle'], jp: '{松本城|まつもとじょう}', emoji: '🏯', about: 'A black National Treasure castle reflected in its moat, with the Alps behind.' },
      { name: 'Nawate Street', jp: 'ナワテ{通|どお}り', emoji: '🐸', about: 'A riverside street full of frog statues and little shops.' },
      { name: 'Kamikochi', jp: '{上高地|かみこうち}', emoji: '🏔️', about: 'A clear river valley in the Northern Alps, crossed by the Kappa Bridge.' },
    ],
    trivia: [
      { q: 'Matsumoto Castle’s nickname is…', options: ['Crow Castle', 'Swan Castle', 'Cat Castle'], answer: 0 },
      { q: 'できます means…', options: ['can do', 'must do', 'did'], answer: 0 },
    ],
    souvenir: { name: 'Shinshu apple', jp: 'りんご', emoji: '🍎', cost: 20 },
  },
  nagano: {
    spots: [
      { name: 'Jigokudani Monkey Park', jp: '{地獄谷|じごくだに}', emoji: '🐒', about: 'Snow monkeys relax in a steaming hot spring surrounded by snow.' },
      { name: 'Zenko-ji', jp: '{善光寺|ぜんこうじ}', emoji: '🛕', about: 'Walk through a pitch-dark tunnel under the main hall to touch the “key to paradise”.' },
    ],
    trivia: [
      { q: 'What do the Jigokudani monkeys do in winter?', options: ['Bathe in hot springs', 'Go skiing', 'Fly south'], answer: 0 },
      { q: 'Nagano hosted the Winter Olympics in…', options: ['1998', '1964', '2020'], answer: 0 },
    ],
    souvenir: { name: 'Oyaki dumpling', jp: 'おやき', emoji: '🥟', cost: 20 },
  },
  kusatsu: {
    spots: [
      { name: 'Yubatake', jp: '{湯畑|ゆばたけ}', emoji: '🌫️', about: 'A steaming “hot water field” where spring water cools in wooden channels.' },
      { name: 'Yumomi show', jp: '{湯|ゆ}もみ', emoji: '🪵', about: 'Performers sing and stir the hot water with long boards to cool it.' },
      { name: 'Tomioka Silk Mill', tags: ['heritage'], jp: '{富岡製糸場|とみおかせいしじょう}', emoji: '🧵', about: 'A brick silk factory from 1872 that helped modernize Japan (also in Gunma).' },
    ],
    trivia: [
      { q: 'Why do people stir Kusatsu’s water with boards?', options: ['To cool it down', 'To catch fish', 'To make soup'], answer: 0 },
      { q: 'ので is used to give…', options: ['A reason', 'A question', 'A wish'], answer: 0 },
    ],
    souvenir: { name: 'Onsen manju', jp: 'おんせんまんじゅう', emoji: '🍥', cost: 20 },
  },
  hiraizumi: {
    spots: [
      { name: 'Chuson-ji Golden Hall', tags: ['heritage'], jp: '{金色堂|こんじきどう}', emoji: '✨', about: 'A small hall covered in gold leaf, protected inside a larger building.' },
      { name: 'Motsu-ji Garden', tags: ['heritage'], jp: '{毛越寺|もうつうじ}', emoji: '🌊', about: 'A Pure Land garden with a large pond meant to look like paradise.' },
    ],
    trivia: [
      { q: 'The Konjikido is covered in…', options: ['Gold leaf', 'Seashells', 'Snow'], answer: 0 },
      { q: 'Which poet wrote a haiku in Hiraizumi?', options: ['Basho', 'Shakespeare', 'Kukai'], answer: 0 },
    ],
    souvenir: { name: 'Wanko soba bowl', jp: 'わんこそば', emoji: '🍜', cost: 30 },
  },
  yamagata: {
    spots: [
      { name: 'Yamadera', jp: '{山寺|やまでら}', emoji: '⛰️', about: 'Climb about 1,000 steps through cedars to temples clinging to the cliffs.' },
      { name: 'Zao snow monsters', jp: '{樹氷|じゅひょう}', emoji: '🌲', about: 'Trees coated in thick ice and snow look like giant monsters in winter.' },
      { name: 'Ginzan Onsen', jp: '{銀山温泉|ぎんざんおんせん}', emoji: '🏮', about: 'Old wooden inns line a river, glowing with gas lamps at night.' },
    ],
    trivia: [
      { q: 'Yamagata grows most of Japan’s…', options: ['Cherries', 'Bananas', 'Coffee'], answer: 0 },
      { q: 'Zao’s “snow monsters” are…', options: ['Frozen trees', 'Big snowmen', 'Polar bears'], answer: 0 },
    ],
    souvenir: { name: 'Sakuranbo cherries', jp: 'さくらんぼ', emoji: '🍒', cost: 30 },
  },
  kawagoe: {
    spots: [
      { name: 'Toki no Kane bell tower', jp: '{時|とき}の{鐘|かね}', emoji: '🔔', about: 'A wooden bell tower that still rings out the time four times a day.' },
      { name: 'Kurazukuri Street', jp: '{蔵造|くらづく}り', emoji: '🏚️', about: 'Black clay-walled storehouses built to resist fire.' },
      { name: 'Candy Alley', jp: '{菓子屋横丁|かしやよこちょう}', emoji: '🍬', about: 'A lane of shops selling old-style dagashi sweets.' },
    ],
    trivia: [
      { q: 'Kawagoe is nicknamed…', options: ['Little Edo', 'Little Kyoto', 'Little Paris'], answer: 0 },
      { q: 'つもりです expresses…', options: ['An intention / plan', 'A memory', 'A comparison'], answer: 0 },
    ],
    souvenir: { name: 'Sweet potato chips', jp: 'いもチップス', emoji: '🍠', cost: 20 },
  },
  inuyama: {
    spots: [
      { name: 'Inuyama Castle', tags: ['castle'], jp: '{犬山城|いぬやまじょう}', emoji: '🏯', about: 'A National Treasure keep above the Kiso River — walk the balcony around its top floor.' },
      { name: 'Ukai on the Kiso River', jp: '{鵜飼|うか}い', emoji: '🐦', about: 'Fishermen with torches guide trained cormorants to catch sweetfish at night.' },
      { name: 'Uraku-en', jp: '{有楽苑|うらくえん}', emoji: '🍵', about: 'A garden with Jo-an, a National Treasure tea house.' },
    ],
    trivia: [
      { q: 'In ukai fishing, what catches the fish?', options: ['Trained cormorant birds', 'Cats', 'Nets only'], answer: 0 },
      { q: '〜ようになる describes…', options: ['A gradual change', 'A command', 'The past'], answer: 0 },
    ],
    souvenir: { name: 'Dengaku tofu skewer', jp: 'でんがく', emoji: '🍢', cost: 20 },
  },
  gujo: {
    spots: [
      { name: 'Gujo Odori', jp: '{郡上|ぐじょう}おどり', emoji: '💃', about: 'Anyone can join the summer street dances — some nights they go until sunrise.' },
      { name: 'Food sample workshop', jp: '{食品|しょくひん}サンプル', emoji: '🍤', about: 'Make your own super-realistic plastic tempura and lettuce.' },
      { name: 'Gujo Hachiman Castle', tags: ['castle'], jp: '{郡上八幡城|ぐじょうはちまんじょう}', emoji: '🏯', about: 'A wooden hilltop castle that seems to float above the morning mist.' },
    ],
    trivia: [
      { q: 'What does Gujo Hachiman make a lot of?', options: ['Plastic food samples', 'Cars', 'Pianos'], answer: 0 },
      { q: 'けんこうの ために means…', options: ['for one’s health', 'because of the rain', 'by bus'], answer: 0 },
    ],
    souvenir: { name: 'Mini food sample', jp: 'しょくひんサンプル', emoji: '🍣', cost: 40 },
  },
  tsumago: {
    spots: [
      { name: 'Tsumago-juku', jp: '{妻籠宿|つまごじゅく}', emoji: '🏚️', about: 'A preserved Edo-period post town with wooden inns and latticed shops.' },
      { name: 'Nakasendo trail', jp: '{中山道|なかせんどう}', emoji: '🥾', about: 'An old highway through cedar forest and past waterfalls to Magome.' },
    ],
    trivia: [
      { q: 'The Nakasendo once connected Edo with…', options: ['Kyoto', 'Sapporo', 'Okinawa'], answer: 0 },
      { q: 'Why do hikers carry bells on the trail?', options: ['To warn bears away', 'To call taxis', 'For fun only'], answer: 0 },
    ],
    souvenir: { name: 'Gohei mochi', jp: 'ごへいもち', emoji: '🍡', cost: 20 },
  },
  toyama: {
    spots: [
      { name: 'Snow Corridor', jp: '{雪|ゆき}の{大谷|おおたに}', emoji: '🧱', about: 'Walk between towering walls of snow on the Alpine Route in spring.' },
      { name: 'Kurobe Gorge Railway', jp: '{黒部峡谷|くろべきょうこく}', emoji: '🚃', about: 'A little open-air train rattles through Japan’s deepest V-shaped gorge.' },
      { name: 'Gokayama villages', tags: ['heritage'], jp: '{五箇山|ごかやま}', emoji: '🛖', about: 'Thatched gassho-zukuri farmhouses — part of the same World Heritage site as Shirakawa-go.' },
    ],
    trivia: [
      { q: 'What lines the road on the Alpine Route in spring?', options: ['Walls of snow', 'Cherry trees', 'Volcanoes'], answer: 0 },
      { q: 'おいしそう means…', options: ['looks delicious', 'was delicious', 'not delicious'], answer: 0 },
    ],
    souvenir: { name: 'Masu-zushi (trout sushi)', jp: 'ますずし', emoji: '🍣', cost: 30 },
  },
  sado: {
    spots: [
      { name: 'Sado Gold Mines', tags: ['heritage'], jp: '{佐渡金山|さどきんざん}', emoji: '⛏️', about: 'Tunnels dug by hand for centuries — a World Heritage site since 2024.' },
      { name: 'Tarai-bune', jp: 'たらい{舟|ぶね}', emoji: '🛶', about: 'Round wooden tub boats once used to gather seaweed and shellfish.' },
      { name: 'Toki Forest Park', jp: 'トキの{森公園|もりこうえん}', emoji: '🦩', about: 'See the rare crested ibis, brought back from the edge of extinction in Japan.' },
    ],
    trivia: [
      { q: 'Sado is famous for an old…', options: ['Gold mine', 'Rocket base', 'Desert'], answer: 0 },
      { q: 'Tarai-bune boats are shaped like…', options: ['Round tubs', 'Swans', 'Bananas'], answer: 0 },
    ],
    souvenir: { name: 'Gold-leaf chopsticks', jp: 'きんぱくのはし', emoji: '🥢', cost: 45 },
  },
  aizu: {
    spots: [
      { name: 'Tsuruga Castle', tags: ['castle'], jp: '{鶴ヶ城|つるがじょう}', emoji: '🏯', about: 'The only castle in Japan with red-glazed roof tiles.' },
      { name: 'Iimoriyama', jp: '{飯盛山|いいもりやま}', emoji: '⛩️', about: 'A hill with memorials to the young Byakkotai samurai, and a unique spiral wooden pagoda.' },
      { name: 'Ouchi-juku', jp: '{大内宿|おおうちじゅく}', emoji: '🛖', about: 'A thatched-roof post town where soba is eaten with a long green onion instead of chopsticks.' },
    ],
    trivia: [
      { q: 'What is an akabeko?', options: ['A red cow toy with a nodding head', 'A red fish', 'A red castle'], answer: 0 },
      { q: 'At Ouchi-juku, people eat soba using…', options: ['A long green onion', 'Their paws', 'A spoon'], answer: 0 },
    ],
    souvenir: { name: 'Akabeko', jp: 'あかべこ', emoji: '🐂', cost: 35 },
  },
  otaru: {
    spots: [
      { name: 'Otaru Canal', jp: '{小樽運河|おたるうんが}', emoji: '🛶', about: 'Stone warehouses and gas lamps reflected in the canal at dusk.' },
      { name: 'Music Box Museum', jp: 'オルゴール{堂|どう}', emoji: '🎶', about: 'Thousands of music boxes, with a steam clock ticking outside.' },
      { name: 'Glass street', jp: 'ガラス{工房|こうぼう}', emoji: '🍷', about: 'Watch artisans blow glass and pick a glass bead to take home.' },
    ],
    trivia: [
      { q: 'Otaru is famous for…', options: ['Glass and music boxes', 'Deserts', 'Pyramids'], answer: 0 },
      { q: '〜ながら means…', options: ['while doing', 'after doing', 'before doing'], answer: 0 },
    ],
    souvenir: { name: 'Glass wind chime', jp: 'ガラスのふうりん', emoji: '🎐', cost: 35 },
  },
  shiretoko: {
    spots: [
      { name: 'Shiretoko Five Lakes', tags: ['heritage'], jp: '{知床五湖|しれとこごこ}', emoji: '🏞️', about: 'Boardwalks over wild lakes with mountains behind — watch for bears!' },
      { name: 'Drift ice walk', tags: ['heritage'], jp: '{流氷|りゅうひょう}ウォーク', emoji: '🧊', about: 'Float in the icy sea among drift ice wearing a dry suit.' },
      { name: 'Furepe Falls', jp: 'フレペの{滝|たき}', emoji: '💦', about: 'Spring water pours straight from a sea cliff — the “Maiden’s Tears”.' },
    ],
    trivia: [
      { q: 'What floats into Shiretoko’s sea in winter?', options: ['Drift ice', 'Coconuts', 'Lanterns'], answer: 0 },
      { q: '〜はずです means…', options: ['should be (expected)', 'want to', 'must not'], answer: 0 },
    ],
    souvenir: { name: 'Salmon jerky', jp: 'さけとば', emoji: '🐟', cost: 30 },
  },
  naoshima: {
    spots: [
      { name: 'Yellow Pumpkin', jp: '{黄|き}かぼちゃ', emoji: '🎃', about: 'Yayoi Kusama’s polka-dot pumpkin on a pier — an island icon.' },
      { name: 'Chichu Art Museum', jp: '{地中美術館|ちちゅうびじゅつかん}', emoji: '🖼️', about: 'A museum built mostly underground, lit by natural sunlight.' },
      { name: 'I♥湯 bathhouse', jp: 'アイラブユー', emoji: '♨️', about: 'A colorful public bath that is also a work of art.' },
    ],
    trivia: [
      { q: 'What famous artwork sits on Naoshima’s pier?', options: ['A polka-dot pumpkin', 'A giant cat', 'A golden fish'], answer: 0 },
      { q: 'Kagawa is famous for which noodle?', options: ['Sanuki udon', 'Hakata ramen', 'Soba only'], answer: 0 },
    ],
    souvenir: { name: 'Pumpkin figure', jp: 'かぼちゃ', emoji: '🎃', cost: 40 },
  },
  tokushima: {
    spots: [
      { name: 'Awa Odori', jp: '{阿波|あわ}おどり', emoji: '💃', about: 'Dance troupes fill the streets with shamisen, flutes and drums every August.' },
      { name: 'Naruto Whirlpools', jp: '{鳴門|なると}の{渦潮|うずしお}', emoji: '🌀', about: 'Some of the world’s largest tidal whirlpools — watch from a glass-floor walkway.' },
      { name: 'Iya Vine Bridge', jp: 'かずら{橋|ばし}', emoji: '🌉', about: 'A wobbly bridge woven from mountain vines over a deep valley.' },
    ],
    trivia: [
      { q: 'What spins in the Naruto Strait?', options: ['Whirlpools', 'Windmills', 'Dancers'], answer: 0 },
      { q: 'Tokushima is famous for which dye?', options: ['Indigo', 'Gold', 'Purple'], answer: 0 },
    ],
    souvenir: { name: 'Indigo tenugui', jp: 'あいぞめ', emoji: '🟦', cost: 30 },
  },
  takachiho: {
    spots: [
      { name: 'Takachiho Gorge', jp: '{高千穂峡|たかちほきょう}', emoji: '🏞️', about: 'Row a boat beneath a waterfall between towering basalt cliffs.' },
      { name: 'Amano Iwato Shrine', jp: '{天岩戸|あまのいわと}', emoji: '⛩️', about: 'Linked to the cave where the sun goddess Amaterasu hid.' },
      { name: 'Night kagura', jp: '{夜神楽|よかぐら}', emoji: '🎭', about: 'Masked sacred dances retelling Japan’s myths.' },
    ],
    trivia: [
      { q: 'Who hid in a cave in the myth?', options: ['The sun goddess Amaterasu', 'A tanuki', 'A samurai'], answer: 0 },
      { q: 'やすませて ください means…', options: ['Please let me rest', 'Please rest', 'I rested'], answer: 0 },
    ],
    souvenir: { name: 'Kagura mask charm', jp: 'かぐらめん', emoji: '🎭', cost: 35 },
  },
  iriomote: {
    spots: [
      { name: 'Wildcat habitat', jp: 'イリオモテヤマネコ', emoji: '🐆', about: 'The island’s rare wildcat lives only here — drivers slow down at cat-crossing signs.' },
      { name: 'Mangrove canoeing', jp: 'マングローブ', emoji: '🛶', about: 'Paddle through Japan’s largest mangrove forests.' },
      { name: 'Star Sand Beach', jp: '{星砂|ほしずな}の{浜|はま}', emoji: '⭐', about: 'The “sand” here is made of tiny star-shaped shells.' },
    ],
    trivia: [
      { q: 'About how many Iriomote wildcats live in the wild?', options: ['About 100', 'About 10,000', 'Over a million'], answer: 0 },
      { q: 'ついた ばかり means…', options: ['just arrived', 'will arrive', 'never arrived'], answer: 0 },
    ],
    souvenir: { name: 'Star sand bottle', jp: 'ほしずな', emoji: '⭐', cost: 30 },
  },
  hirosaki: {
    spots: [
      { name: 'Hirosaki Castle', tags: ['castle'], jp: '{弘前城|ひろさきじょう}', emoji: '🏯', about: 'One of twelve original castle keeps — slid 70 m on rails in 2015 so its stone walls could be rebuilt.' },
      { name: 'Hanaikada on the moat', jp: '{花筏|はないかだ}', emoji: '🌸', about: 'In late April, fallen cherry petals cover the moat in a pink “raft”.' },
      { name: 'Apple orchards', jp: 'りんご{園|えん}', emoji: '🍎', about: 'Pick apples in autumn — Aomori grows over half of Japan’s apples.' },
    ],
    trivia: [
      { q: 'Why was Hirosaki Castle’s keep moved in 2015?', options: ['To repair the stone walls under it', 'To get a better view', 'It was sold'], answer: 0 },
      { q: 'きれいな わけだ means…', options: ['No wonder it’s beautiful', 'It isn’t beautiful', 'It will be beautiful'], answer: 0 },
    ],
    souvenir: { name: 'Apple pie', jp: 'アップルパイ', emoji: '🥧', cost: 30 },
  },
  matsushima: {
    spots: [
      { name: 'Matsushima Bay cruise', jp: '{松島湾|まつしまわん}', emoji: '⛴️', about: 'Sail among 260 pine-covered islands — one of the Three Views of Japan.' },
      { name: 'Zuigan-ji', jp: '{瑞巌寺|ずいがんじ}', emoji: '🛕', about: 'A Zen temple rebuilt by the warlord Date Masamune, with National Treasure halls.' },
      { name: 'Godaidō', jp: '{五大堂|ごだいどう}', emoji: '🌉', about: 'A tiny temple hall on an islet, reached by red “see-through” bridges.' },
    ],
    trivia: [
      { q: 'Which famous poet travelled to Matsushima in 1689?', options: ['Matsuo Bashō', 'Murasaki Shikibu', 'Natsume Sōseki'], answer: 0 },
      { q: 'わたしに とって means…', options: ['for me / to me', 'by me', 'instead of me'], answer: 0 },
    ],
    souvenir: { name: 'Grilled oysters', jp: 'やきがき', emoji: '🦪', cost: 35 },
  },
  gunkanjima: {
    spots: [
      { name: 'Hashima (Battleship Island)', tags: ['heritage'], jp: '{軍艦島|ぐんかんじま}', emoji: '🏚️', about: 'An abandoned coal-mining island of concrete apartments — part of the Meiji Industrial Revolution World Heritage site.' },
      { name: 'Glover Garden', tags: ['heritage'], jp: 'グラバー{園|えん}', emoji: '🏡', about: 'Western-style merchant houses on a Nagasaki hillside, also in the Meiji Industrial heritage group.' },
      { name: 'Nagasaki night view', jp: '{夜景|やけい}', emoji: '🌃', about: 'From Mt. Inasa, the harbour lights are called a “ten-million-dollar view”.' },
    ],
    trivia: [
      { q: 'What was mined on Gunkanjima?', options: ['Coal', 'Gold', 'Salt'], answer: 0 },
      { q: 'てんきに よって means…', options: ['depending on the weather', 'despite the weather', 'thanks to the weather'], answer: 0 },
    ],
    souvenir: { name: 'Castella cake', jp: 'カステラ', emoji: '🍰', cost: 30 },
  },
  arita: {
    spots: [
      { name: 'Tozan Shrine', jp: '{陶山神社|とうざんじんじゃ}', emoji: '⛩️', about: 'A shrine whose torii gate and guardian lions are made of Arita porcelain.' },
      { name: 'Tonbai-bei walls', jp: 'トンバイ{塀|べい}', emoji: '🧱', about: 'Lanes lined with walls made from old kiln bricks and broken pottery.' },
      { name: 'Kyushu Ceramic Museum', jp: '{陶磁|とうじ}{文化館|ぶんかかん}', emoji: '🏺', about: 'See the blue-and-white and colourful porcelain that once filled European palaces.' },
    ],
    trivia: [
      { q: 'What is Arita famous for?', options: ['Porcelain', 'Pearls', 'Paper lanterns'], answer: 0 },
      { q: 'しごとに たいして しんけんだ means…', options: ['serious about work', 'tired of work', 'late for work'], answer: 0 },
    ],
    souvenir: { name: 'Arita-ware teacup', jp: 'ありたやき', emoji: '🍵', cost: 60 },
  },
  hagi: {
    spots: [
      { name: 'Shōka Sonjuku', tags: ['heritage'], jp: '{松下村塾|しょうかそんじゅく}', emoji: '📜', about: 'The tiny school where Yoshida Shōin taught the young samurai who helped modernise Japan.' },
      { name: 'Hagi reverberatory furnace', tags: ['heritage'], jp: '{反射炉|はんしゃろ}', emoji: '🔥', about: 'An experimental furnace for casting iron cannons, from the 1850s.' },
      { name: 'Hagi Castle ruins', tags: ['castle'], jp: '{萩城|はぎじょう}{跡|あと}', emoji: '🏯', about: 'Stone walls and a moat by the sea where the Mōri lords once ruled.' },
    ],
    trivia: [
      { q: 'Hagi’s young samurai helped bring about…', options: ['The Meiji Restoration', 'The Heian period', 'The Tokyo Olympics'], answer: 0 },
      { q: 'ちいさい ものの means…', options: ['although it is small', 'because it is small', 'it must be small'], answer: 0 },
    ],
    souvenir: { name: 'Natsumikan jelly', jp: 'なつみかんゼリー', emoji: '🍊', cost: 25 },
  },
  iwakuni: {
    spots: [
      { name: 'Kintai Bridge', jp: '{錦帯橋|きんたいきょう}', emoji: '🌉', about: 'Five wooden arches over the Nishiki River, rebuilt by hand after a 1950 flood.' },
      { name: 'Iwakuni Castle', tags: ['castle'], jp: '{岩国城|いわくにじょう}', emoji: '🏯', about: 'Take the ropeway up for a view of the bridge far below.' },
      { name: 'White snake museum', jp: '{白蛇|しろへび}', emoji: '🐍', about: 'Meet the rare white snakes that are a lucky symbol of the town.' },
    ],
    trivia: [
      { q: 'What is special about Kintai Bridge’s construction?', options: ['Wooden arches built without nails', 'It is made of glass', 'It floats'], answer: 0 },
      { q: 'こどもばかりか おとなも means…', options: ['not only children but adults too', 'only children', 'children instead of adults'], answer: 0 },
    ],
    souvenir: { name: 'Iwakuni sushi', jp: 'いわくにずし', emoji: '🍱', cost: 35 },
  },
  kotohira: {
    spots: [
      { name: 'Kotohiragū (Konpira-san)', jp: '{金刀比羅宮|ことひらぐう}', emoji: '⛩️', about: '785 stone steps up to a shrine for sailors — 1,368 to the inner shrine.' },
      { name: 'Kanamaru-za', jp: '{金丸座|かなまるざ}', emoji: '🎭', about: 'Japan’s oldest surviving kabuki theatre, still used every spring.' },
      { name: 'Udon school', jp: 'うどん{学校|がっこう}', emoji: '🍜', about: 'Knead Sanuki udon dough with your feet, then cut and eat it.' },
    ],
    trivia: [
      { q: 'Who did Konpira-san protect?', options: ['Sailors at sea', 'Farmers', 'Miners'], answer: 0 },
      { q: 'つかれたに ちがいない means…', options: ['you must be tired', 'you are not tired', 'try not to get tired'], answer: 0 },
    ],
    souvenir: { name: 'Sanuki udon', jp: 'さぬきうどん', emoji: '🍜', cost: 25 },
  },
  kurashiki: {
    spots: [
      { name: 'Bikan Historical Quarter', jp: '{美観地区|びかんちく}', emoji: '🛶', about: 'White-walled storehouses and willows along a canal — ride a little boat.' },
      { name: 'Ivy Square', jp: 'アイビースクエア', emoji: '🧶', about: 'A red-brick cotton mill from 1889, now covered in ivy.' },
      { name: 'Ohara Museum of Art', jp: '{大原美術館|おおはらびじゅつかん}', emoji: '🖼️', about: 'Japan’s first museum of Western art, with works by El Greco and Monet.' },
    ],
    trivia: [
      { q: 'Nearby Kojima is famous for making…', options: ['Denim jeans', 'Pianos', 'Robots'], answer: 0 },
      { q: 'はたらく ことに なった means…', options: ['it was decided that I’d work', 'I decided not to work', 'I must work'], answer: 0 },
    ],
    souvenir: { name: 'Muscat grapes', jp: 'マスカット', emoji: '🍇', cost: 45 },
  },
  amanohashidate: {
    spots: [
      { name: 'Amanohashidate sandbar', jp: '{天橋立|あまのはしだて}', emoji: '🌲', about: 'A 3.6 km strip of pines across the bay — walk or cycle across it.' },
      { name: 'Matanozoki at Kasamatsu Park', jp: '{股|また}のぞき', emoji: '🙃', about: 'Look upside down through your legs and the sandbar becomes a bridge to heaven.' },
      { name: 'Ine boathouses', jp: '{伊根|いね}の{舟屋|ふなや}', emoji: '🛥️', about: 'Homes where boats park inside the ground floor, right on the water.' },
    ],
    trivia: [
      { q: 'How do visitors traditionally view Amanohashidate?', options: ['Upside down between their legs', 'From a submarine', 'With their eyes closed'], answer: 0 },
      { q: 'はれた おかげで means…', options: ['thanks to the clear weather', 'because of the bad weather', 'in place of sun'], answer: 0 },
    ],
    souvenir: { name: 'Chie no mochi', jp: 'ちえのもち', emoji: '🍡', cost: 20 },
  },
  yoshino: {
    spots: [
      { name: 'Hitome Senbon', tags: ['heritage'], jp: '{一目千本|ひとめせんぼん}', emoji: '🌸', about: '“A thousand trees at a glance” — cherry blossoms climbing the mountain in waves.' },
      { name: 'Kinpusen-ji', tags: ['heritage'], jp: '{金峯山寺|きんぷせんじ}', emoji: '🛕', about: 'A huge wooden hall at the heart of Shugendō mountain worship (Kii UNESCO site).' },
      { name: 'Yoshino Mizumaki Shrine', tags: ['heritage'], jp: '{吉水神社|よしみずじんじゃ}', emoji: '⛩️', about: 'Where Emperor Go-Daigo lived in hiding during the Southern Court era.' },
    ],
    trivia: [
      { q: 'About how many cherry trees grow on Mt. Yoshino?', options: ['30,000', '300', '3 million'], answer: 0 },
      { q: 'くるまの かわりに means…', options: ['instead of a car', 'because of a car', 'by car'], answer: 0 },
    ],
    souvenir: { name: 'Kuzumochi', jp: 'くずもち', emoji: '🍮', cost: 25 },
  },
  kumano: {
    spots: [
      { name: 'Kumano Kodō trail', tags: ['heritage'], jp: '{熊野古道|くまのこどう}', emoji: '🥾', about: 'Mossy stone paths through cedar forest, walked by pilgrims for over 1,000 years.' },
      { name: 'Nachi Falls', tags: ['heritage'], jp: '{那智|なち}の{滝|たき}', emoji: '💧', about: 'A 133 m waterfall beside a red pagoda — worshipped as a god itself.' },
      { name: 'Kumano Hongū Taisha', tags: ['heritage'], jp: '{熊野本宮大社|くまのほんぐうたいしゃ}', emoji: '⛩️', about: 'The head shrine of Kumano, near Japan’s largest torii gate.' },
    ],
    trivia: [
      { q: 'Which other pilgrimage route shares UNESCO status with Kumano Kodō?', options: ['Camino de Santiago', 'The Silk Road', 'Route 66'], answer: 0 },
      { q: 'やすまずに means…', options: ['without resting', 'after resting', 'while resting'], answer: 0 },
    ],
    souvenir: { name: 'Mehari-zushi', jp: 'めはりずし', emoji: '🍙', cost: 25 },
  },
  asakusa: {
    spots: [
      { name: 'Kaminarimon & Nakamise', jp: '{雷門|かみなりもん}', emoji: '🏮', about: 'Walk under the giant lantern and down 250 m of snack and souvenir stalls.' },
      { name: 'Rickshaw ride', jp: '{人力車|じんりきしゃ}', emoji: '🛺', about: 'A puller in split-toe tabi runs you around the old downtown streets.' },
      { name: 'Sumida River fireworks', jp: '{隅田川|すみだがわ}{花火|はなび}', emoji: '🎆', about: 'One of Japan’s oldest firework festivals, every July.' },
    ],
    trivia: [
      { q: 'What hangs in the Kaminarimon gate?', options: ['A giant red lantern', 'A huge bell', 'A golden cat'], answer: 0 },
      { q: 'とおかったにも かかわらず means…', options: ['despite being far', 'because it was far', 'it must be far'], answer: 0 },
    ],
    souvenir: { name: 'Ningyo-yaki', jp: 'にんぎょうやき', emoji: '🧁', cost: 25 },
  },
};
