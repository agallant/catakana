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

/** How long: hours, weeks, months and years (よじかん, いっしゅうかん, ろっかげつ, よねん). */
export type DurationUnit = 'hour' | 'week' | 'month' | 'year';

export const DURATION_UNITS: DurationUnit[] = ['hour', 'week', 'month', 'year'];

/** Max count per unit, and how each is written after the number. */
export const DURATION_MAX: Record<DurationUnit, number> = { hour: 12, week: 10, month: 10, year: 10 };
export const DURATION_KANJI: Record<DurationUnit, string> = { hour: '時間', week: '週間', month: 'か月', year: '年' };

/** 1, 6, 8 and 10 shrink to a small っ before か and し (いっかげつ, ろっかげつ, はっしゅうかん). */
const GEM_DUR: Record<number, string[]> = { 1: ['いっ'], 6: ['ろっ'], 8: ['はっ', 'はち'], 10: ['じゅっ', 'じっ'] };

/** Every accepted reading of `n` units, main one first (ろっかげつ; はっしゅうかん / はちしゅうかん). */
export function durationReadings(unit: DurationUnit, n: number): string[] {
  switch (unit) {
    case 'hour':
      return hourReadings(n).map((r) => r + 'かん');
    case 'week':
    case 'month': {
      const suffix = unit === 'week' ? 'しゅうかん' : 'かげつ';
      // ろくしゅうかん keeps its く; ろっかげつ doesn't
      const nums = n === 6 && unit === 'week' ? ['ろく'] : n === 7 ? ['なな', 'しち'] : GEM_DUR[n] ?? [NUMS[n]!];
      return nums.map((x) => x + suffix);
    }
    case 'year':
      return n === 4 ? ['よねん'] : n === 7 ? ['ななねん', 'しちねん'] : n === 9 ? ['きゅうねん', 'くねん'] : [NUMS[n] + 'ねん'];
  }
}

/**
 * Wrong durations that teach: the plain number (いちかげつ, よんじかん), the clock time or month name
 * without the duration ending (よじ, さんがつ), and neighbouring numbers.
 */
export function durationDistractors(unit: DurationUnit, n: number): string[] {
  const right = durationReadings(unit, n);
  const cands: (string | undefined)[] = [];
  if (unit === 'hour') {
    cands.push(NUMS[n] + 'じかん', hourReadings(n)[0]);
  } else if (unit === 'week') {
    cands.push(NUMS[n] + 'しゅうかん', NUMS[n] + 'しゅう', n === 6 ? 'ろっしゅうかん' : undefined);
  } else if (unit === 'month') {
    cands.push(NUMS[n] + 'かげつ', monthReading(n), n === 6 ? 'ろくかげつ' : undefined);
  } else {
    cands.push(NUMS[n] + 'ねん', n === 4 ? 'しねん' : undefined, n === 10 ? 'とおねん' : undefined);
  }
  for (const m of [n + 1, n - 1, n + 2, n - 2, n + 3]) if (m >= 1 && m <= DURATION_MAX[unit]) cands.push(durationReadings(unit, m)[0]);
  return uniq(right, cands);
}
