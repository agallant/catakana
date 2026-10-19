import type { ShopItem } from './shop';

/** Japanese seasonal events, matched against the player's real calendar date. */
export interface SeasonEvent {
  id: string;
  name: string;
  /** Japanese name, may use {kanji|kana} furigana markup */
  jp: string;
  emoji: string;
  /** inclusive [month, day] range; may wrap past the new year */
  from: [number, number];
  to: [number, number];
  about: string;
  /** a limited-time Neko Market treat, only sold during the event */
  treat: ShopItem;
}

const treat = (id: string, name: string, jp: string, emoji: string, cost: number, about: string): ShopItem => ({ id: `season:${id}`, kind: 'food', name, jp, emoji, cost, about });

export const EVENTS: SeasonEvent[] = [
  {
    id: 'shogatsu', name: 'New Year (Shōgatsu)', jp: 'お{正月|しょうがつ}', emoji: '🎍', from: [1, 1], to: [1, 7],
    about: 'The biggest holiday of the year. Families visit shrines (hatsumōde), send New Year cards and give children otoshidama money.',
    treat: treat('ozoni', 'Ozōni', 'お{雑煮|ぞうに}', '🍲', 30, 'Soup with mochi, eaten on New Year’s morning — every region makes it differently.'),
  },
  {
    id: 'setsubun', name: 'Setsubun', jp: '{節分|せつぶん}', emoji: '👹', from: [2, 1], to: [2, 4],
    about: 'People throw roasted beans shouting “Oni wa soto! Fuku wa uchi!” — demons out, luck in!',
    treat: treat('ehomaki', 'Ehōmaki', '{恵方巻|えほうまき}', '🍣', 30, 'A thick sushi roll eaten in silence while facing the year’s lucky direction.'),
  },
  {
    id: 'hinamatsuri', name: 'Hinamatsuri', jp: 'ひなまつり', emoji: '🎎', from: [3, 1], to: [3, 3],
    about: 'The Doll Festival: families display tiers of dolls dressed as the imperial court and wish for girls’ health and happiness.',
    treat: treat('hinaarare', 'Hina-arare', 'ひなあられ', '🍬', 20, 'Pastel puffed-rice crackers in spring colours.'),
  },
  {
    id: 'hanami', name: 'Cherry blossom season', jp: 'お{花見|はなみ}', emoji: '🌸', from: [3, 20], to: [4, 15],
    about: 'Friends picnic under blooming cherry trees. TV news even tracks the “cherry blossom front” moving north.',
    treat: treat('sakuramochi', 'Sakura mochi', '{桜|さくら}もち', '🌸', 25, 'Pink mochi with sweet bean paste, wrapped in a salted cherry leaf.'),
  },
  {
    id: 'kodomo', name: 'Children’s Day', jp: 'こどもの{日|ひ}', emoji: '🎏', from: [5, 1], to: [5, 5],
    about: 'Carp streamers (koinobori) fly from poles — carp swim upstream, a symbol of strength.',
    treat: treat('kashiwamochi', 'Kashiwa mochi', 'かしわもち', '🍃', 25, 'Mochi wrapped in an oak leaf, which stays on the tree until new leaves grow — a wish for family to continue.'),
  },
  {
    id: 'tsuyu', name: 'Rainy season', jp: '{梅雨|つゆ}', emoji: '☔', from: [6, 1], to: [6, 30],
    about: 'Weeks of drizzle bring hydrangeas into bloom. Children hang teru-teru bōzu dolls to wish for sunshine.',
    treat: treat('minazuki', 'Minazuki', '{水無月|みなづき}', '🔺', 25, 'A triangle of white jelly topped with red beans, eaten in Kyoto on 30 June to ward off bad luck.'),
  },
  {
    id: 'tanabata', name: 'Tanabata', jp: '{七夕|たなばた}', emoji: '🎋', from: [7, 1], to: [7, 7],
    about: 'The Star Festival: two star lovers meet once a year. People write wishes on paper strips and hang them on bamboo.',
    treat: treat('somen', 'Sōmen', 'そうめん', '🍜', 20, 'Thin cold noodles, said to look like the Milky Way.'),
  },
  {
    id: 'natsumatsuri', name: 'Summer festivals', jp: '{夏祭|なつまつ}り', emoji: '🎆', from: [7, 8], to: [8, 12],
    about: 'Fireworks, yukata, bon-odori dancing and street stalls on warm summer nights.',
    treat: treat('ringoame', 'Ringo-ame', 'りんごあめ', '🍎', 20, 'A whole apple coated in shiny red candy, sold at festival stalls.'),
  },
  {
    id: 'obon', name: 'Obon', jp: 'お{盆|ぼん}', emoji: '🏮', from: [8, 13], to: [8, 16],
    about: 'Families return home to welcome their ancestors’ spirits, then send them off with floating lanterns.',
    treat: treat('suika', 'Watermelon', 'スイカ', '🍉', 20, 'Chilled watermelon — at the beach people play suikawari, smashing one blindfolded!'),
  },
  {
    id: 'tsukimi', name: 'Moon viewing', jp: 'お{月見|つきみ}', emoji: '🎑', from: [9, 15], to: [10, 5],
    about: 'People admire the harvest moon with pampas grass. In Japan, they say a rabbit pounds mochi on the moon.',
    treat: treat('tsukimidango', 'Tsukimi dango', '{月見|つきみ}だんご', '🍡', 25, 'White dumplings stacked in a pyramid as an offering to the moon.'),
  },
  {
    id: 'momiji', name: 'Autumn leaves', jp: '{紅葉|もみじ}', emoji: '🍁', from: [10, 15], to: [11, 30],
    about: 'Maple leaves turn red and gold. Momiji-gari — “hunting” for autumn colours — is a favourite outing.',
    treat: treat('momijimanju', 'Momiji manjū', 'もみじまんじゅう', '🍁', 25, 'Maple-leaf-shaped cakes filled with bean paste, from Miyajima.'),
  },
  {
    id: 'christmas', name: 'Christmas in Japan', jp: 'クリスマス', emoji: '🎄', from: [12, 20], to: [12, 25],
    about: 'Not a holiday, but a fun one: couples go on dates, streets glow with illuminations, and many families eat fried chicken.',
    treat: treat('christmascake', 'Christmas cake', 'クリスマスケーキ', '🍰', 30, 'Strawberry shortcake with whipped cream — the classic Japanese Christmas dessert.'),
  },
  {
    id: 'omisoka', name: 'New Year’s Eve', jp: '{大晦日|おおみそか}', emoji: '🔔', from: [12, 29], to: [12, 31],
    about: 'Temple bells ring 108 times at midnight to clear away the year’s 108 worldly desires.',
    treat: treat('toshikoshisoba', 'Toshikoshi soba', '{年越|としこ}しそば', '🍜', 25, 'Long buckwheat noodles eaten on New Year’s Eve for a long life.'),
  },
];

export interface Season {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  jp: string;
  emoji: string;
  about: string;
}

export const SEASONS: Record<Season['id'], Season> = {
  spring: { id: 'spring', name: 'Spring', jp: '{春|はる}', emoji: '🌷', about: 'The school and work year starts in April, so spring is a time of new beginnings.' },
  summer: { id: 'summer', name: 'Summer', jp: '{夏|なつ}', emoji: '🎐', about: 'Hot and humid — wind chimes (fūrin) tinkle to make it feel cooler.' },
  autumn: { id: 'autumn', name: 'Autumn', jp: '{秋|あき}', emoji: '🍠', about: 'The season of appetite, reading and sport. Street carts sell roasted sweet potatoes.' },
  winter: { id: 'winter', name: 'Winter', jp: '{冬|ふゆ}', emoji: '⛄', about: 'Families gather under the kotatsu, a heated table with a blanket — cats love it too.' },
};

export const SEASONAL_TREATS: ShopItem[] = EVENTS.map((e) => e.treat);

const md = (m: number, d: number): number => m * 100 + d;

export function isDuring(date: Date, e: SeasonEvent): boolean {
  const t = md(date.getMonth() + 1, date.getDate());
  const a = md(...e.from);
  const b = md(...e.to);
  return a <= b ? t >= a && t <= b : t >= a || t <= b;
}

/** The seasonal event happening on this date (by the player's local calendar), if any. */
export function eventFor(date: Date): SeasonEvent | undefined {
  return EVENTS.find((e) => isDuring(date, e));
}

export function seasonFor(date: Date): Season {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return SEASONS.spring;
  if (m >= 6 && m <= 8) return SEASONS.summer;
  if (m >= 9 && m <= 11) return SEASONS.autumn;
  return SEASONS.winter;
}

/** Which event sells this treat. */
export function eventOfTreat(id: string): SeasonEvent | undefined {
  return EVENTS.find((e) => e.treat.id === id);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function eventDates(e: SeasonEvent): string {
  const f = (x: [number, number]) => `${MONTHS[x[0] - 1]} ${x[1]}`;
  return `${f(e.from)} – ${f(e.to)}`;
}
