/**
 * Japanese counters 1–10 with their sound changes (いっぴき, さんびき, ろっぽん…).
 * Each reading list is indexed by number - 1; the first spelling is the main one, others are also accepted.
 */
export interface Counter {
  id: string;
  /** counter suffix as written */
  kanji: string;
  /** what it counts, for the hint chip */
  what: string;
  /** stop id from which the counter appears */
  from: string;
  /** things to count: emoji + English noun (plural) */
  things: [string, string][];
  readings: string[][];
}

const NUM_KANJI = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export const numKanji = (n: number): string => NUM_KANJI[n - 1] ?? String(n);

/** Regular counters only change at the number itself (よん, なな, きゅう). */
const regular = (suffix: string, opts: { yo?: boolean; shichi?: boolean } = {}): string[][] => [
  [`いち${suffix}`],
  [`に${suffix}`],
  [`さん${suffix}`],
  opts.yo ? [`よ${suffix}`] : [`よん${suffix}`],
  [`ご${suffix}`],
  [`ろく${suffix}`],
  opts.shichi ? [`しち${suffix}`, `なな${suffix}`] : [`なな${suffix}`, `しち${suffix}`],
  [`はち${suffix}`],
  [`きゅう${suffix}`],
  [`じゅう${suffix}`],
];

export const COUNTERS: Counter[] = [
  {
    id: 'tsu', kanji: 'つ', what: 'general things', from: 'aomori',
    things: [['🍙', 'rice balls'], ['🍊', 'mandarins'], ['🎁', 'presents']],
    readings: [['ひとつ'], ['ふたつ'], ['みっつ'], ['よっつ'], ['いつつ'], ['むっつ'], ['ななつ'], ['やっつ'], ['ここのつ'], ['とお']],
  },
  {
    id: 'nin', kanji: '人', what: 'people', from: 'aomori',
    things: [['🧑', 'people'], ['🧒', 'children'], ['🧳', 'travellers']],
    readings: [['ひとり'], ['ふたり'], ['さんにん'], ['よにん'], ['ごにん'], ['ろくにん'], ['ななにん', 'しちにん'], ['はちにん'], ['きゅうにん'], ['じゅうにん']],
  },
  {
    id: 'hiki', kanji: '匹', what: 'small animals', from: 'takayama',
    things: [['🐈', 'cats'], ['🐟', 'fish'], ['🐸', 'frogs']],
    readings: [['いっぴき'], ['にひき'], ['さんびき'], ['よんひき'], ['ごひき'], ['ろっぴき'], ['ななひき'], ['はっぴき', 'はちひき'], ['きゅうひき'], ['じゅっぴき', 'じっぴき']],
  },
  {
    id: 'hon', kanji: '本', what: 'long, thin things', from: 'takayama',
    things: [['🍡', 'dango skewers'], ['🌂', 'umbrellas'], ['🖊️', 'pens']],
    readings: [['いっぽん'], ['にほん'], ['さんぼん'], ['よんほん'], ['ごほん'], ['ろっぽん'], ['ななほん'], ['はっぽん', 'はちほん'], ['きゅうほん'], ['じゅっぽん', 'じっぽん']],
  },
  {
    id: 'mai', kanji: '枚', what: 'flat things', from: 'takayama',
    things: [['🎫', 'tickets'], ['🍘', 'rice crackers'], ['👕', 'T-shirts']],
    readings: regular('まい'),
  },
  {
    id: 'ko', kanji: '個', what: 'small objects', from: 'kochi',
    things: [['🍎', 'apples'], ['🥚', 'eggs'], ['🍬', 'candies']],
    readings: [['いっこ'], ['にこ'], ['さんこ'], ['よんこ'], ['ごこ'], ['ろっこ'], ['ななこ'], ['はっこ', 'はちこ'], ['きゅうこ'], ['じゅっこ', 'じっこ']],
  },
  {
    id: 'hai', kanji: '杯', what: 'cups and bowls', from: 'kochi',
    things: [['🍵', 'cups of tea'], ['🍜', 'bowls of ramen'], ['🍚', 'bowls of rice']],
    readings: [['いっぱい'], ['にはい'], ['さんばい'], ['よんはい'], ['ごはい'], ['ろっぱい'], ['ななはい'], ['はっぱい', 'はちはい'], ['きゅうはい'], ['じゅっぱい', 'じっぱい']],
  },
  {
    id: 'satsu', kanji: '冊', what: 'books', from: 'hikone',
    things: [['📕', 'books'], ['📓', 'notebooks'], ['📖', 'manga']],
    readings: [['いっさつ'], ['にさつ'], ['さんさつ'], ['よんさつ'], ['ごさつ'], ['ろくさつ'], ['ななさつ'], ['はっさつ'], ['きゅうさつ'], ['じゅっさつ', 'じっさつ']],
  },
  {
    id: 'dai', kanji: '台', what: 'machines and vehicles', from: 'hikone',
    things: [['🚗', 'cars'], ['🚲', 'bicycles'], ['📷', 'cameras']],
    readings: regular('だい'),
  },
  {
    id: 'kaidan', kanji: '階', what: 'floors of a building', from: 'inuyama',
    things: [['🏯', 'castle floors'], ['🏢', 'office floors'], ['🏨', 'hotel floors']],
    readings: [['いっかい'], ['にかい'], ['さんがい', 'さんかい'], ['よんかい'], ['ごかい'], ['ろっかい'], ['ななかい', 'しちかい'], ['はっかい', 'はちかい'], ['きゅうかい'], ['じゅっかい', 'じっかい']],
  },
  {
    id: 'soku', kanji: '足', what: 'pairs of footwear', from: 'gujo',
    things: [['🩴', 'pairs of geta'], ['👟', 'pairs of sneakers'], ['🧦', 'pairs of socks']],
    readings: [['いっそく'], ['にそく'], ['さんぞく'], ['よんそく'], ['ごそく'], ['ろくそく'], ['ななそく', 'しちそく'], ['はっそく', 'はちそく'], ['きゅうそく'], ['じゅっそく', 'じっそく']],
  },
  {
    id: 'ken', kanji: '軒', what: 'houses and shops', from: 'tsumago',
    things: [['🏠', 'houses'], ['🏪', 'shops'], ['🏮', 'inns']],
    readings: [['いっけん'], ['にけん'], ['さんげん', 'さんけん'], ['よんけん'], ['ごけん'], ['ろっけん'], ['ななけん', 'しちけん'], ['はっけん', 'はちけん'], ['きゅうけん'], ['じゅっけん', 'じっけん']],
  },
  {
    id: 'kai', kanji: '回', what: 'times (how often)', from: 'sado',
    things: [['🔔', 'rings of the bell'], ['🏊', 'laps of the pool'], ['🎯', 'tries']],
    readings: [['いっかい'], ['にかい'], ['さんかい'], ['よんかい'], ['ごかい'], ['ろっかい'], ['ななかい', 'しちかい'], ['はっかい', 'はちかい'], ['きゅうかい'], ['じゅっかい', 'じっかい']],
  },
  {
    id: 'tou', kanji: '頭', what: 'large animals', from: 'shiretoko',
    things: [['🐄', 'cows'], ['🐎', 'horses'], ['🦌', 'deer']],
    readings: [['いっとう'], ['にとう'], ['さんとう'], ['よんとう'], ['ごとう'], ['ろくとう'], ['ななとう', 'しちとう'], ['はっとう', 'はちとう'], ['きゅうとう'], ['じゅっとう', 'じっとう']],
  },
  {
    id: 'sai', kanji: '歳', what: 'years of age', from: 'hirosaki',
    things: [['🎂', 'years old (birthday cake)'], ['🐱', 'years old (a kitten growing up)']],
    readings: [['いっさい'], ['にさい'], ['さんさい'], ['よんさい'], ['ごさい'], ['ろくさい'], ['ななさい', 'しちさい'], ['はっさい', 'はちさい'], ['きゅうさい'], ['じゅっさい', 'じっさい']],
  },
  {
    id: 'seki', kanji: '隻', what: 'ships', from: 'gunkanjima',
    things: [['🚢', 'ships'], ['⛴️', 'ferries'], ['🛳️', 'warships']],
    readings: [['いっせき'], ['にせき'], ['さんせき'], ['よんせき'], ['ごせき'], ['ろくせき'], ['ななせき', 'しちせき'], ['はっせき', 'はちせき'], ['きゅうせき'], ['じゅっせき', 'じっせき']],
  },
  {
    id: 'mune', kanji: '棟', what: 'buildings', from: 'sannai',
    things: [['🛖', 'pit dwellings'], ['🏢', 'apartment blocks'], ['🏫', 'school buildings']],
    readings: [['いっとう'], ['にとう'], ['さんとう'], ['よんとう'], ['ごとう'], ['ろくとう'], ['ななとう', 'しちとう'], ['はっとう', 'はちとう'], ['きゅうとう'], ['じゅっとう', 'じっとう']],
  },
  {
    id: 'zen', kanji: '膳', what: 'pairs of chopsticks, bowls of rice', from: 'eiheiji',
    things: [['🥢', 'pairs of chopsticks'], ['🍚', 'bowls of rice']],
    readings: [['いちぜん'], ['にぜん'], ['さんぜん'], ['よんぜん'], ['ごぜん'], ['ろくぜん'], ['ななぜん', 'しちぜん'], ['はちぜん'], ['きゅうぜん'], ['じゅうぜん', 'じゅっぜん']],
  },
  {
    id: 'ki', kanji: '基', what: 'large fixed structures', from: 'sakai',
    things: [['⛰️', 'burial mounds (kofun)'], ['⛩️', 'torii gates'], ['🗼', 'towers']],
    readings: [['いっき'], ['にき'], ['さんき'], ['よんき'], ['ごき'], ['ろっき', 'ろくき'], ['ななき', 'しちき'], ['はっき', 'はちき'], ['きゅうき'], ['じゅっき', 'じっき']],
  },
  {
    id: 'shu', kanji: '首', what: 'waka and tanka poems', from: 'kinosaki',
    things: [['📜', 'waka poems'], ['🖌️', 'tanka poems']],
    readings: [['いっしゅ'], ['にしゅ'], ['さんしゅ'], ['よんしゅ'], ['ごしゅ'], ['ろくしゅ'], ['ななしゅ', 'しちしゅ'], ['はっしゅ', 'はちしゅ'], ['きゅうしゅ'], ['じゅっしゅ', 'じっしゅ']],
  },
];

/** The counter written with its number, e.g. 三匹. */
export function written(c: Counter, n: number): string {
  // ten is just 十 (とお), never 十つ
  if (c.id === 'tsu') return n === 10 ? numKanji(n) : `${numKanji(n)}つ`;
  return `${numKanji(n)}${c.kanji}`;
}

const NUMS = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
const BASE: Record<string, string> = { tsu: 'つ', nin: 'にん', hiki: 'ひき', hon: 'ほん', mai: 'まい', ko: 'こ', hai: 'はい', satsu: 'さつ', dai: 'だい', kai: 'かい', kaidan: 'かい', soku: 'そく', ken: 'けん', tou: 'とう', sai: 'さい', seki: 'せき', mune: 'とう', zen: 'ぜん', ki: 'き', shu: 'しゅ' };
/** Numbers that shrink to a small っ before some counters. */
const GEM: Record<number, string> = { 1: 'いっ', 6: 'ろっ', 8: 'はっ', 10: 'じゅっ' };
const ALT_NUMS: Record<number, string[]> = { 4: ['よ', 'し'], 7: ['しち'], 9: ['く'] };
const VOICE: Record<string, string> = { は: 'ば', ひ: 'び', ほ: 'ぼ', か: 'が', こ: 'ご', さ: 'ざ', そ: 'ぞ', け: 'げ', と: 'ど', せ: 'ぜ', し: 'じ', き: 'ぎ' };
const HALF: Record<string, string> = { は: 'ぱ', ひ: 'ぴ', ほ: 'ぽ' };

const swapFirst = (base: string, map: Record<string, string>): string | undefined => (map[base[0]!] ? map[base[0]!] + base.slice(1) : undefined);

/**
 * Wrong answers that teach: the naive reading (いちひき, さんほん), the sound changes applied
 * where they don't belong (よんぼん, いっまい, ろっさつ), and neighbouring numbers.
 */
export function counterDistractors(c: Counter, n: number): string[] {
  const right = new Set(c.readings[n - 1]);
  const base = BASE[c.id]!;
  const num = NUMS[n - 1]!;
  const cands: (string | undefined)[] = [num + base];
  const voiced = swapFirst(base, VOICE);
  if (voiced) cands.push(num + voiced);
  // つ and 人 use their own native readings, so the っ trap doesn't apply
  if (GEM[n] && c.id !== 'tsu' && c.id !== 'nin') cands.push(GEM[n] + (swapFirst(base, HALF) ?? base));
  // the other readings of 4, 7 and 9 (よんにん, しちだい, くにん)
  if (c.id !== 'tsu') for (const alt of ALT_NUMS[n] ?? []) cands.push(alt + base);
  // mixing in the native とお for ten (とおにん, とおまい)
  if (n === 10 && c.id !== 'tsu') cands.push('とお' + base);
  for (const m of [n - 1, n + 1, n + 2, n - 2]) if (m >= 1 && m <= 10) cands.push(c.readings[m - 1]![0]);
  const out: string[] = [];
  for (const x of cands) if (x && !right.has(x) && !out.includes(x)) out.push(x);
  return out;
}
