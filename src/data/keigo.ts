/**
 * Keigo (respectful language) for the Ryokan Manners game.
 * Sonkeigo raises the other person when THEY act; kenjōgo lowers yourself when YOU act.
 * Text uses {kanji|kana} furigana markup; ＿＿ marks the blank in an example.
 */
export type KeigoDir = 'sonkei' | 'kenjo';

export interface KeigoUse {
  /** the respectful/humble form, polite non-past */
  form: string;
  /** example with ＿＿ where the form goes */
  ex: string;
  en: string;
}

export interface KeigoVerb {
  id: string;
  /** dictionary form */
  plain: string;
  /** plain polite form, used as a tempting distractor */
  masu: string;
  en: string;
  /** stop id from which this verb's keigo appears */
  from: string;
  sonkei?: KeigoUse;
  kenjo?: KeigoUse;
}

/** Special keigo verbs from the end of N4; the rest arrive with the N2 season. */
const BASIC = 'kawagoe';
const MORE = 'hirosaki';

export const KEIGO: KeigoVerb[] = [
  {
    id: 'iku', plain: '{行|い}く', masu: '{行|い}きます', en: 'go', from: BASIC,
    sonkei: { form: 'いらっしゃいます', ex: 'お{客|きゃく}さまは {明日|あした} {京都|きょうと}へ ＿＿か。', en: 'Are you (the guest) going to Kyoto tomorrow?' },
    kenjo: { form: '{参|まい}ります', ex: '{明日|あした}、わたしが そちらへ ＿＿。', en: 'I will go over there tomorrow.' },
  },
  {
    id: 'kuru', plain: '{来|く}る', masu: '{来|き}ます', en: 'come', from: BASIC,
    sonkei: { form: 'お{見|み}えになります', ex: 'お{客|きゃく}さまは もうすぐ ＿＿。', en: 'The guest will arrive soon.' },
    kenjo: { form: '{参|まい}ります', ex: '{三時|さんじ}に また ＿＿。', en: 'I will come again at three.' },
  },
  {
    id: 'iru', plain: 'いる', masu: 'います', en: 'be (somewhere)', from: BASIC,
    sonkei: { form: 'いらっしゃいます', ex: '{先生|せんせい}は いま お{部屋|へや}に ＿＿か。', en: 'Is the teacher in the room now?' },
    kenjo: { form: 'おります', ex: 'わたしは {毎日|まいにち} この {宿|やど}に ＿＿。', en: 'I am at this inn every day.' },
  },
  {
    id: 'taberu', plain: '{食|た}べる', masu: '{食|た}べます', en: 'eat', from: BASIC,
    sonkei: { form: '{召|め}し{上|あ}がります', ex: '{朝|あさ}ごはんは {何時|なんじ}に ＿＿か。', en: 'What time will you have breakfast?' },
    kenjo: { form: 'いただきます', ex: 'では、えんりょなく ＿＿。', en: 'Then I will gladly have some.' },
  },
  {
    id: 'iu', plain: '{言|い}う', masu: '{言|い}います', en: 'say', from: BASIC,
    sonkei: { form: 'おっしゃいます', ex: '{先生|せんせい}は いつも そう ＿＿。', en: 'The teacher always says so.' },
    kenjo: { form: '{申|もう}します', ex: 'はじめまして。モチと ＿＿。', en: 'Nice to meet you. My name is Mochi.' },
  },
  {
    id: 'suru', plain: 'する', masu: 'します', en: 'do', from: BASIC,
    sonkei: { form: 'なさいます', ex: '{週末|しゅうまつ}は {何|なに}を ＿＿か。', en: 'What will you do this weekend?' },
    kenjo: { form: 'いたします', ex: 'お{部屋|へや}まで ご{案内|あんない} ＿＿。', en: 'I will show you to your room.' },
  },
  {
    id: 'miru', plain: '{見|み}る', masu: '{見|み}ます', en: 'see, look', from: MORE,
    sonkei: { form: 'ご{覧|らん}になります', ex: 'こちらの {写真|しゃしん}を ＿＿か。', en: 'Would you like to look at this photo?' },
    kenjo: { form: '{拝見|はいけん}します', ex: 'わたしが お{客|きゃく}さまの きっぷを ＿＿。', en: 'I will check your ticket.' },
  },
  {
    id: 'shitteiru', plain: '{知|し}っている', masu: '{知|し}っています', en: 'know', from: MORE,
    sonkei: { form: 'ご{存|ぞん}じです', ex: 'この お{寺|てら}を ＿＿か。', en: 'Do you know this temple?' },
    kenjo: { form: '{存|ぞん}じております', ex: 'はい、その {話|はなし}は よく ＿＿。', en: 'Yes, I know that story well.' },
  },
  {
    id: 'au', plain: '{会|あ}う', masu: '{会|あ}います', en: 'meet', from: MORE,
    sonkei: { form: 'お{会|あ}いになります', ex: '{明日|あした}、{社長|しゃちょう}に ＿＿か。', en: 'Will you meet the company president tomorrow?' },
    kenjo: { form: 'お{目|め}にかかります', ex: '{来週|らいしゅう}、また ＿＿。', en: 'I will see you again next week.' },
  },
  {
    id: 'kiku', plain: '{聞|き}く', masu: '{聞|き}きます', en: 'hear, ask', from: MORE,
    sonkei: { form: 'お{聞|き}きになります', ex: 'この あと、ガイドの {話|はなし}を ＿＿か。', en: 'Will you listen to the guide’s talk after this?' },
    kenjo: { form: '{伺|うかが}います', ex: 'ちょっと ＿＿が、{駅|えき}は どちらですか。', en: 'May I ask — which way is the station?' },
  },
  {
    id: 'kureru', plain: 'くれる', masu: 'くれます', en: 'give (to me)', from: MORE,
    sonkei: { form: 'くださいます', ex: 'お{客|きゃく}さまが いつも お{手紙|てがみ}を ＿＿。', en: 'The guest always sends me letters.' },
  },
  {
    id: 'morau', plain: 'もらう', masu: 'もらいます', en: 'receive', from: MORE,
    kenjo: { form: 'いただきます', ex: '{先生|せんせい}から {本|ほん}を ＿＿。', en: 'I receive a book from the teacher.' },
  },
  {
    id: 'ageru', plain: 'あげる', masu: 'あげます', en: 'give (to someone)', from: MORE,
    kenjo: { form: '{差|さ}し{上|あ}げます', ex: 'お{客|きゃく}さまに {地図|ちず}を ＿＿。', en: 'I will give the guest a map.' },
  },
  {
    id: 'neru', plain: '{寝|ね}る', masu: '{寝|ね}ます', en: 'sleep', from: MORE,
    sonkei: { form: 'お{休|やす}みになります', ex: '{今夜|こんや}は {何時|なんじ}ごろ ＿＿か。', en: 'Around what time will you go to bed tonight?' },
  },
  {
    id: 'kiru', plain: '{着|き}る', masu: '{着|き}ます', en: 'wear', from: MORE,
    sonkei: { form: 'お{召|め}しになります', ex: 'ゆかたを ＿＿か。', en: 'Will you wear a yukata?' },
  },
  {
    id: 'matsu', plain: '{待|ま}つ', masu: '{待|ま}ちます', en: 'wait', from: MORE,
    sonkei: { form: 'お{待|ま}ちになります', ex: 'どなたを ＿＿か。', en: 'Whom are you waiting for?' },
    kenjo: { form: 'お{待|ま}ちします', ex: '{駅|えき}の {前|まえ}で ＿＿。', en: 'I will wait for you in front of the station.' },
  },
  {
    id: 'motsu', plain: '{持|も}つ', masu: '{持|も}ちます', en: 'carry, hold', from: MORE,
    kenjo: { form: 'お{持|も}ちします', ex: 'お{荷物|にもつ}を ＿＿。', en: 'Let me carry your luggage.' },
  },
];

export interface KeigoRound {
  id: string;
  verb: KeigoVerb;
  dir: KeigoDir;
  use: KeigoUse;
}

/** Every (verb, direction) pair as a playable round. */
export function keigoRounds(verbs: KeigoVerb[] = KEIGO): KeigoRound[] {
  const out: KeigoRound[] = [];
  for (const verb of verbs) {
    for (const dir of ['sonkei', 'kenjo'] as const) {
      const use = verb[dir];
      if (use) out.push({ id: `keigo:${verb.id}:${dir}`, verb, dir, use });
    }
  }
  return out;
}

/**
 * Wrong choices that teach: the same verb in the other direction (the classic mix-up),
 * the plain polite form, then forms of other verbs in the same direction.
 */
export function keigoDistractors(round: KeigoRound, n: number, verbs: KeigoVerb[] = KEIGO): string[] {
  const other = round.dir === 'sonkei' ? 'kenjo' : 'sonkei';
  const cands = [round.verb[other]?.form, round.verb.masu, ...verbs.filter((v) => v !== round.verb).map((v) => v[round.dir]?.form)];
  const out: string[] = [];
  for (const c of cands) {
    if (c && c !== round.use.form && !out.includes(c)) out.push(c);
    if (out.length >= n) break;
  }
  return out;
}
