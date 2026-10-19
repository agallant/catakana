/** Adjective conjugation for Verb Kitchen: い-adjectives (たかい) and な-adjectives (しずか), plain forms. */
export type AdjKind = 'i' | 'na';
export type AdjForm = 'neg' | 'past' | 'pastneg' | 'te' | 'adv';

export interface Adjective {
  /** kana reading, dictionary form (な-adjectives without な) */
  reading: string;
  /** written form with {kanji|kana} furigana markup */
  jp: string;
  kind: AdjKind;
  en: string;
  emoji: string;
}

export const ADJ_FORM_LABEL: Record<AdjForm, string> = {
  neg: 'negative (not …)',
  past: 'past (was …)',
  pastneg: 'past negative (wasn’t …)',
  te: 'て-form (… and)',
  adv: 'adverb (…ly)',
};

/** Forms the learner has met by journey stop, after adjectives arrive at Akita. */
export const ADJ_FORM_UNLOCK: Record<AdjForm, string> = {
  neg: 'kobe',
  past: 'kobe',
  pastneg: 'beppu',
  te: 'yakushima',
  adv: 'hikone',
};

const I = (reading: string, jp: string, en: string, emoji: string): Adjective => ({ reading, jp, kind: 'i', en, emoji });
const NA = (reading: string, jp: string, en: string, emoji: string): Adjective => ({ reading, jp, kind: 'na', en, emoji });

export const ADJECTIVES: Adjective[] = [
  I('ちいさい', '{小|ちい}さい', 'small', '🐭'),
  I('おおきい', '{大|おお}きい', 'big', '🐘'),
  I('ながい', '{長|なが}い', 'long', '📏'),
  I('たかい', '{高|たか}い', 'tall / expensive', '🗼'),
  I('やすい', '{安|やす}い', 'cheap', '🏷️'),
  I('ふるい', '{古|ふる}い', 'old (things)', '🏚️'),
  I('いい', 'いい', 'good', '👍'),
  I('わるい', '{悪|わる}い', 'bad', '👎'),
  I('さむい', '{寒|さむ}い', 'cold (weather)', '🥶'),
  I('あつい', '{暑|あつ}い', 'hot (weather)', '🥵'),
  I('おいしい', 'おいしい', 'delicious', '😋'),
  I('たのしい', '{楽|たの}しい', 'fun', '🎉'),
  I('むずかしい', '{難|むずか}しい', 'difficult', '🧩'),
  I('はやい', '{早|はや}い', 'early / fast', '⚡'),
  NA('しずか', '{静|しず}か', 'quiet', '🤫'),
  NA('きれい', 'きれい', 'pretty / clean', '✨'),
  NA('げんき', '{元気|げんき}', 'healthy / energetic', '💪'),
  NA('すき', '{好|す}き', 'liked', '❤️'),
  NA('ゆうめい', '{有名|ゆうめい}', 'famous', '🌟'),
  NA('にぎやか', 'にぎやか', 'lively', '🏮'),
  NA('ひま', 'ひま', 'free (not busy)', '😺'),
  NA('べんり', '{便利|べんり}', 'convenient', '🧰'),
];

const I_ENDINGS: Record<AdjForm, string> = { neg: 'くない', past: 'かった', pastneg: 'くなかった', te: 'くて', adv: 'く' };
const NA_ENDINGS: Record<AdjForm, string> = { neg: 'じゃない', past: 'だった', pastneg: 'じゃなかった', te: 'で', adv: 'に' };

export function conjugateAdj(adj: Adjective, form: AdjForm): string {
  if (adj.kind === 'na') return adj.reading + NA_ENDINGS[form];
  // いい conjugates from its old form よい
  const stem = adj.reading === 'いい' ? 'よ' : adj.reading.slice(0, -1);
  return stem + I_ENDINGS[form];
}

/** Classic slips: treating one kind like the other (きれくない, たかいじゃない), いくない, and the other forms. */
export function wrongAdjForms(adj: Adjective, form: AdjForm): string[] {
  const right = conjugateAdj(adj, form);
  const out = new Set<string>();
  if (adj.kind === 'i') {
    out.add(adj.reading + NA_ENDINGS[form]);
    if (adj.reading === 'いい') out.add('い' + I_ENDINGS[form]);
    if (form === 'past') out.add(adj.reading + 'でした');
  } else if (adj.reading.endsWith('い')) {
    out.add(adj.reading.slice(0, -1) + I_ENDINGS[form]);
  } else {
    out.add(adj.reading + I_ENDINGS[form]);
  }
  for (const f of Object.keys(I_ENDINGS) as AdjForm[]) if (f !== form) out.add(conjugateAdj(adj, f));
  out.delete(right);
  return [...out];
}
