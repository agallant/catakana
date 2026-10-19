export type Script = 'hiragana' | 'katakana';

export interface KanaChar {
  id: string; // e.g. "h:あ" / "k:ア"
  script: Script;
  char: string;
  romaji: string;
  group: string; // lesson group id
}

export interface KanaGroup {
  id: string;
  name: string;
  /** hiragana characters in this group; katakana is derived by offset */
  hira: string[];
  romaji: string[];
}

// Ordered teaching groups: vowels first, then consonant rows, voiced marks, then combos.
export const KANA_GROUPS: KanaGroup[] = [
  { id: 'a', name: 'Vowels', hira: ['あ', 'い', 'う', 'え', 'お'], romaji: ['a', 'i', 'u', 'e', 'o'] },
  { id: 'k', name: 'K-row', hira: ['か', 'き', 'く', 'け', 'こ'], romaji: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { id: 's', name: 'S-row', hira: ['さ', 'し', 'す', 'せ', 'そ'], romaji: ['sa', 'shi', 'su', 'se', 'so'] },
  { id: 't', name: 'T-row', hira: ['た', 'ち', 'つ', 'て', 'と'], romaji: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { id: 'n', name: 'N-row', hira: ['な', 'に', 'ぬ', 'ね', 'の'], romaji: ['na', 'ni', 'nu', 'ne', 'no'] },
  { id: 'h', name: 'H-row', hira: ['は', 'ひ', 'ふ', 'へ', 'ほ'], romaji: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { id: 'm', name: 'M-row', hira: ['ま', 'み', 'む', 'め', 'も'], romaji: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { id: 'y', name: 'Y-row', hira: ['や', 'ゆ', 'よ'], romaji: ['ya', 'yu', 'yo'] },
  { id: 'r', name: 'R-row', hira: ['ら', 'り', 'る', 'れ', 'ろ'], romaji: ['ra', 'ri', 'ru', 're', 'ro'] },
  { id: 'w', name: 'W-row & N', hira: ['わ', 'を', 'ん'], romaji: ['wa', 'wo', 'n'] },
  { id: 'g', name: 'G-row (゛)', hira: ['が', 'ぎ', 'ぐ', 'げ', 'ご'], romaji: ['ga', 'gi', 'gu', 'ge', 'go'] },
  { id: 'z', name: 'Z-row (゛)', hira: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], romaji: ['za', 'ji', 'zu', 'ze', 'zo'] },
  { id: 'd', name: 'D-row (゛)', hira: ['だ', 'ぢ', 'づ', 'で', 'ど'], romaji: ['da', 'ji', 'zu', 'de', 'do'] },
  { id: 'b', name: 'B-row (゛)', hira: ['ば', 'び', 'ぶ', 'べ', 'ぼ'], romaji: ['ba', 'bi', 'bu', 'be', 'bo'] },
  { id: 'p', name: 'P-row (゜)', hira: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], romaji: ['pa', 'pi', 'pu', 'pe', 'po'] },
  { id: 'ky', name: 'Combos K/G', hira: ['きゃ', 'きゅ', 'きょ', 'ぎゃ', 'ぎゅ', 'ぎょ'], romaji: ['kya', 'kyu', 'kyo', 'gya', 'gyu', 'gyo'] },
  { id: 'sh', name: 'Combos S/J/CH', hira: ['しゃ', 'しゅ', 'しょ', 'じゃ', 'じゅ', 'じょ', 'ちゃ', 'ちゅ', 'ちょ'], romaji: ['sha', 'shu', 'sho', 'ja', 'ju', 'jo', 'cha', 'chu', 'cho'] },
  { id: 'ny', name: 'Combos N/H/M/R', hira: ['にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ', 'りゃ', 'りゅ', 'りょ'], romaji: ['nya', 'nyu', 'nyo', 'hya', 'hyu', 'hyo', 'mya', 'myu', 'myo', 'rya', 'ryu', 'ryo'] },
  { id: 'by', name: 'Combos B/P', hira: ['びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ'], romaji: ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'] },
];

/** Convert a hiragana string to katakana (code-point offset 0x60). */
export function toKatakana(s: string): string {
  return [...s]
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code >= 0x3041 && code <= 0x3096 ? String.fromCodePoint(code + 0x60) : c;
    })
    .join('');
}

export function toHiragana(s: string): string {
  return [...s]
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : c;
    })
    .join('');
}

export function kanaId(script: Script, ch: string): string {
  return `${script === 'hiragana' ? 'h' : 'k'}:${ch}`;
}

export const ALL_KANA: KanaChar[] = KANA_GROUPS.flatMap((g) =>
  (['hiragana', 'katakana'] as const).flatMap((script) =>
    g.hira.map((h, i) => {
      const char = script === 'hiragana' ? h : toKatakana(h);
      return { id: kanaId(script, char), script, char, romaji: g.romaji[i]!, group: `${script === 'hiragana' ? 'h' : 'k'}-${g.id}` };
    }),
  ),
);

export const KANA_BY_ID = new Map(ALL_KANA.map((k) => [k.id, k]));

export function kanaGroupChars(script: Script, groupId: string): KanaChar[] {
  const prefix = script === 'hiragana' ? 'h' : 'k';
  return ALL_KANA.filter((k) => k.group === `${prefix}-${groupId}`);
}

/** Romaji → kana for a whole word (used by word-building games and typing). */
export function romajiToHiragana(input: string): string {
  const table = new Map<string, string>();
  for (const k of ALL_KANA) if (k.script === 'hiragana' && !table.has(k.romaji)) table.set(k.romaji, k.char);
  // alternates
  const alt: Record<string, string> = { si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', ji: 'じ', di: 'ぢ', du: 'づ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', sya: 'しゃ', syu: 'しゅ', syo: 'しょ', zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ' };
  for (const [k, v] of Object.entries(alt)) if (!table.has(k)) table.set(k, v);
  const vowels = 'aiueo';
  const s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    const next = s[i + 1];
    if (c === 'n' && (next === undefined || !vowels.includes(next) && next !== 'y')) {
      if (next === "'" ) i++;
      out += 'ん';
      i++;
      continue;
    }
    if (next && c === next && !vowels.includes(c) && c !== 'n') {
      out += 'っ';
      i++;
      continue;
    }
    let matched = false;
    for (const len of [3, 2, 1]) {
      const sub = s.slice(i, i + len);
      const hit = table.get(sub);
      if (hit) {
        out += hit;
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (c === '-') out += 'ー';
      else out += c;
      i++;
    }
  }
  return out;
}

/** Split a kana string into display units: combos (きゃ) stay together; っ and ー stand alone. */
export function splitKana(reading: string): string[] {
  const small = 'ゃゅょャュョ';
  const out: string[] = [];
  for (const c of reading) {
    if (small.includes(c) && out.length) out[out.length - 1] += c;
    else out.push(c);
  }
  return out;
}

/** Kana → romaji (Hepburn-ish, long vowels as written: とうきょう → toukyou). */
export function kanaToRomaji(input: string): string {
  const table = new Map<string, string>();
  for (const k of ALL_KANA) table.set(toHiragana(k.char), k.romaji);
  const units = splitKana(toHiragana(input));
  let out = '';
  let double = false;
  for (const u of units) {
    if (u === 'っ') {
      double = true;
      continue;
    }
    let r = u === 'ー' ? out.slice(-1) : table.get(u) ?? u;
    if (double) {
      r = (r.startsWith('ch') ? 't' : r[0]) + r;
      double = false;
    }
    out += r;
  }
  return out;
}
