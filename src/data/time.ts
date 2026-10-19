/** Reading clock times and calendar dates, with their irregular forms and the classic slips. */
const NUMS = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];

/** 1–99 in Sino-Japanese (じゅうご, にじゅういち…). */
export function number(n: number): string {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const t = tens === 0 ? '' : tens === 1 ? 'じゅう' : NUMS[tens] + 'じゅう';
  return t + NUMS[ones];
}

const HOURS = ['', 'いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ'];

/** Hour on a 12-hour clock: よじ, しちじ, くじ are the irregular ones. */
export function hourReadings(h: number): string[] {
  return h === 7 ? ['しちじ', 'ななじ'] : [HOURS[h]!];
}

/** ～ふん / ～ぷん for one digit 1–10. */
const MIN_ONES: string[][] = [
  [],
  ['いっぷん'],
  ['にふん'],
  ['さんぷん'],
  ['よんぷん'],
  ['ごふん'],
  ['ろっぷん'],
  ['ななふん'],
  ['はっぷん', 'はちふん'],
  ['きゅうふん'],
  ['じゅっぷん', 'じっぷん'],
];

/** Minutes 1–59 (0 means on the hour). 30 can also be はん. */
export function minuteReadings(m: number): string[] {
  if (m === 0) return [''];
  const tens = Math.floor(m / 10);
  const ones = m % 10;
  let out: string[];
  if (m <= 10) out = MIN_ONES[m]!;
  else if (ones === 0) out = [NUMS[tens] + 'じゅっぷん', NUMS[tens] + 'じっぷん'];
  else out = MIN_ONES[ones]!.map((r) => number(tens * 10) + r);
  return m === 30 ? [...out, 'はん'] : out;
}

export function timeReadings(h: number, m: number): string[] {
  return hourReadings(h).flatMap((hr) => minuteReadings(m).map((mr) => hr + mr));
}

const SPECIAL_DAYS: Record<number, string[]> = {
  1: ['ついたち'],
  2: ['ふつか'],
  3: ['みっか'],
  4: ['よっか'],
  5: ['いつか'],
  6: ['むいか'],
  7: ['なのか', 'なぬか'],
  8: ['ようか'],
  9: ['ここのか'],
  10: ['とおか'],
  14: ['じゅうよっか'],
  17: ['じゅうしちにち', 'じゅうななにち'],
  19: ['じゅうくにち'],
  20: ['はつか'],
  24: ['にじゅうよっか'],
  27: ['にじゅうしちにち', 'にじゅうななにち'],
  29: ['にじゅうくにち'],
};

/** Day of the month 1–31. */
export function dayReadings(d: number): string[] {
  return SPECIAL_DAYS[d] ?? [number(d) + 'にち'];
}

const MONTH_NUM: Record<number, string> = { 4: 'し', 7: 'しち', 9: 'く' };

/** Months: しがつ, しちがつ, くがつ are the irregular ones. */
export function monthReading(mo: number): string {
  return (MONTH_NUM[mo] ?? number(mo)) + 'がつ';
}

const uniq = (right: string[], cands: (string | undefined)[]): string[] => {
  const out: string[] = [];
  for (const c of cands) if (c && !right.includes(c) && !out.includes(c)) out.push(c);
  return out;
};

/** The plain number + ふん/ぷん, ignoring the sound changes (さんふん, ろくふん, じゅうふん). */
function minuteSlips(m: number): string[] {
  return m === 0 ? [] : [number(m) + 'ふん', number(m) + 'ぷん'];
}

export function timeDistractors(h: number, m: number): string[] {
  const right = timeReadings(h, m);
  const hr = hourReadings(h)[0]!;
  const min = minuteReadings(m)[0]!;
  // よじ and くじ are irregular: the plain numbers are the classic slip
  const naiveHour = ({ 4: 'よんじ', 9: 'きゅうじ' } as Record<number, string>)[h];
  const cands: (string | undefined)[] = [naiveHour && naiveHour + min];
  for (const slip of minuteSlips(m)) cands.push(hr + slip);
  // neighbouring hour and minute
  cands.push(hourReadings((h % 12) + 1)[0]! + min);
  if (m > 0 && m < 59) cands.push(hr + minuteReadings(m + 1)[0]!);
  // on the hour: half past, or the hour before
  if (m === 0) cands.push(hr + 'はん', hourReadings(h === 1 ? 12 : h - 1)[0]!);
  return uniq(right, cands);
}

/** Wrong dates: the regular にち form (いちにち means “one day”!), look-alikes (よっか/ようか, はつか) and neighbours. */
export function dayDistractors(d: number): string[] {
  const right = dayReadings(d);
  const look: Record<number, string[]> = { 4: ['ようか'], 8: ['よっか'], 9: ['ここのつ'], 10: ['とお'], 20: ['にじゅうにち'], 14: ['じゅうようか'], 24: ['にじゅうようか'], 1: ['いちにち', 'ひとつ'], 2: ['ふたつ'], 7: ['ななか'] };
  const cands: (string | undefined)[] = [number(d) + 'にち', ...(look[d] ?? [])];
  for (const n of [d - 1, d + 1, d + 2, d - 2, d - 3]) if (n >= 1 && n <= 31) cands.push(dayReadings(n)[0]);
  return uniq(right, cands);
}

export function monthDistractors(mo: number): string[] {
  const naive = ({ 4: 'よんがつ', 9: 'きゅうがつ' } as Record<number, string>)[mo];
  const cands: (string | undefined)[] = [naive, monthReading((mo % 12) + 1), monthReading(mo === 1 ? 12 : mo - 1), mo <= 10 ? monthReading(mo + 2) : monthReading(mo - 2)];
  return uniq([monthReading(mo)], cands);
}
