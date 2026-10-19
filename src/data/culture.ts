/** Sightseeing, souvenirs and trivia for each stop: the "learn about Japan" side of the journey. */

export interface Spot {
  name: string;
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
      { name: 'Mount Fuji', jp: '{富士山|ふじさん}', emoji: '🗻', about: 'Japan’s tallest peak at 3,776 m — an active volcano and a sacred mountain.' },
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
      { name: 'Nagoya Castle', jp: '{名古屋城|なごやじょう}', emoji: '🏯', about: 'Golden shachihoko — mythical tiger-headed fish — guard the roof.' },
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
      { name: 'Fushimi Inari', jp: '{伏見稲荷|ふしみいなり}', emoji: '⛩️', about: 'Thousands of vermilion torii gates — and fox statues, the messengers of the rice god Inari.' },
      { name: 'Kinkaku-ji', jp: '{金閣寺|きんかくじ}', emoji: '✨', about: 'The Golden Pavilion, covered in gold leaf, shines over a mirror-like pond.' },
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
      { name: 'Osaka Castle', jp: '{大阪城|おおさかじょう}', emoji: '🏯', about: 'Built for Toyotomi Hideyoshi, the leader who unified Japan in the 1500s.' },
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
      { name: 'Nara Park', jp: '{奈良公園|ならこうえん}', emoji: '🦌', about: 'Wild deer roam freely; buy shika-senbei crackers and they may bow to you.' },
      { name: 'Todai-ji', jp: '{東大寺|とうだいじ}', emoji: '🛕', about: 'A giant bronze Buddha in one of the largest wooden buildings in the world.' },
      { name: 'Kasuga Taisha', jp: '{春日大社|かすがたいしゃ}', emoji: '🏮', about: 'A shrine with thousands of stone and bronze lanterns.' },
    ],
    trivia: [
      { q: 'What do Nara’s deer famously do for crackers?', options: ['Bow', 'Sing', 'Dance'], answer: 0 },
      { q: 'Nara was Japan’s capital around…', options: ['710', '1945', '2000'], answer: 0 },
    ],
    souvenir: { name: 'Deer crackers', jp: 'しかせんべい', emoji: '🍘', cost: 15 },
  },
  himeji: {
    spots: [
      { name: 'Himeji Castle', jp: '{姫路城|ひめじじょう}', emoji: '🏰', about: 'The White Heron Castle — an original castle that survived wars and earthquakes.' },
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
      { name: 'Peace Memorial Park', jp: '{平和記念公園|へいわきねんこうえん}', emoji: '🕊️', about: 'A park for remembering and for wishing for peace. Visitors fold paper cranes as a symbol of peace.' },
      { name: 'Itsukushima Shrine', jp: '{厳島神社|いつくしまじんじゃ}', emoji: '⛩️', about: 'On Miyajima island, its big torii gate seems to float on the sea at high tide.' },
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
      { name: 'Matsuyama Castle', jp: '{松山城|まつやまじょう}', emoji: '🏯', about: 'Ride a chairlift up the hill to an original castle overlooking the city.' },
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
      { name: 'Glover Garden', jp: 'グラバー{園|えん}', emoji: '🌹', about: 'Western-style houses on a hill overlooking the harbor.' },
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
      { name: 'Kumamoto Castle', jp: '{熊本城|くまもとじょう}', emoji: '🏯', about: 'Its curved stone walls, called musha-gaeshi, were made to stop warriors climbing up.' },
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
      { name: 'Sengan-en', jp: '{仙巌園|せんがんえん}', emoji: '🌳', about: 'A lord’s garden that uses the volcano and bay as “borrowed scenery”.' },
    ],
    trivia: [
      { q: 'What falls from the sky in Kagoshima sometimes?', options: ['Volcanic ash', 'Frogs', 'Candy'], answer: 0 },
      { q: 'Kagoshima is famous for…', options: ['Sweet potatoes', 'Penguins', 'Maple syrup'], answer: 0 },
    ],
    souvenir: { name: 'Roasted sweet potato', jp: 'やきいも', emoji: '🍠', cost: 15 },
  },
  okinawa: {
    spots: [
      { name: 'Shuri Castle', jp: '{首里城|しゅりじょう}', emoji: '🏯', about: 'The red palace of the Ryukyu Kingdom, being carefully rebuilt after a 2019 fire.' },
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
      { name: 'Goryokaku', jp: '{五稜郭|ごりょうかく}', emoji: '⭐', about: 'A star-shaped Western-style fort from the 1860s, pink with cherry blossoms in spring.' },
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
      { name: 'Hirosaki Castle', jp: '{弘前城|ひろさきじょう}', emoji: '🌸', about: 'One of Japan’s most famous cherry blossom spots, with petals carpeting the moat.' },
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
      { name: 'Sleeping Cat carving', jp: '{眠|ねむ}り{猫|ねこ}', emoji: '😴', about: 'A tiny carved cat asleep above a gate at Toshogu — a National Treasure!' },
      { name: 'Three Wise Monkeys', jp: '{三猿|さんざる}', emoji: '🙈', about: 'See no evil, hear no evil, speak no evil — carved on the sacred stable.' },
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
      { name: 'Gassho farmhouses', jp: '{合掌造|がっしょうづく}り', emoji: '🛖', about: 'Huge thatched roofs built without nails, steep like hands in prayer.' },
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
      { name: 'Jomon Sugi', jp: '{縄文杉|じょうもんすぎ}', emoji: '🌲', about: 'A giant ancient cedar, reached by a long day hike through the forest.' },
      { name: 'Shiratani Unsuikyo', jp: '{白谷雲水峡|しらたにうんすいきょう}', emoji: '🍃', about: 'A mossy ravine said to have inspired the forest in Princess Mononoke.' },
      { name: 'Turtle beach', jp: 'ウミガメ', emoji: '🐢', about: 'Sea turtles come ashore to lay eggs on Yakushima’s beaches in summer.' },
    ],
    trivia: [
      { q: 'Yakushima is famous for its very old…', options: ['Cedar trees', 'Skyscrapers', 'Cats only'], answer: 0 },
      { q: 'まって ください means…', options: ['Please wait', 'Please eat', 'Thank you'], answer: 0 },
    ],
    souvenir: { name: 'Cedar coaster', jp: 'やくすぎ', emoji: '🪵', cost: 30 },
  },
};
