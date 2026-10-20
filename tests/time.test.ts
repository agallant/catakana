import { describe, expect, it } from 'vitest';
import {
  DURATION_MAX,
  DURATION_UNITS,
  dayDistractors,
  dayReadings,
  durationDistractors,
  durationReadings,
  monthDistractors,
  monthReading,
  minuteReadings,
  timeDistractors,
  timeReadings,
} from '../src/data/time';

describe('time and dates', () => {
  it('reads clock times', () => {
    expect(timeReadings(4, 0)).toEqual(['よじ']);
    expect(timeReadings(9, 1)).toEqual(['くじいっぷん']);
    expect(timeReadings(7, 3)).toContain('しちじさんぷん');
    expect(timeReadings(2, 30)).toContain('にじはん');
    expect(timeReadings(2, 30)).toContain('にじさんじゅっぷん');
    expect(minuteReadings(15)).toEqual(['じゅうごふん']);
    expect(minuteReadings(16)).toEqual(['じゅうろっぷん']);
    expect(minuteReadings(45)).toEqual(['よんじゅうごふん']);
    expect(minuteReadings(20)).toContain('にじゅっぷん');
  });
  it('reads dates', () => {
    expect(dayReadings(1)).toEqual(['ついたち']);
    expect(dayReadings(8)).toEqual(['ようか']);
    expect(dayReadings(14)).toEqual(['じゅうよっか']);
    expect(dayReadings(20)).toEqual(['はつか']);
    expect(dayReadings(21)).toEqual(['にじゅういちにち']);
    expect(dayReadings(17)).toContain('じゅうななにち');
    expect(dayReadings(27)).toContain('にじゅうななにち');
    expect(monthReading(4)).toBe('しがつ');
    expect(monthReading(9)).toBe('くがつ');
    expect(monthReading(12)).toBe('じゅうにがつ');
  });
  it('offer at least three wrong answers that are never right', () => {
    for (let h = 1; h <= 12; h++) {
      for (const m of [0, 1, 3, 5, 6, 8, 10, 15, 20, 30, 45]) {
        const d = timeDistractors(h, m);
        expect(d.length, `${h}:${m}`).toBeGreaterThanOrEqual(3);
        for (const x of d) expect(timeReadings(h, m)).not.toContain(x);
      }
    }
    for (let day = 1; day <= 31; day++) {
      const d = dayDistractors(day);
      expect(d.length, `day ${day}`).toBeGreaterThanOrEqual(3);
      for (const x of d) expect(dayReadings(day)).not.toContain(x);
    }
    for (let mo = 1; mo <= 12; mo++) expect(monthDistractors(mo).length, `month ${mo}`).toBeGreaterThanOrEqual(3);
    expect(timeDistractors(4, 0)).toContain('よんじ');
    expect(timeDistractors(1, 3)).toContain('いちじさんふん');
    expect(dayDistractors(8)).toContain('よっか');
    expect(dayDistractors(1)).toContain('いちにち');
  });
});

import { STOPS } from '../src/data/journey';
import { timetableGame, TIME_FROM, DATE_FROM, DURATION_FROM } from '../src/games/timetable';
import { romajiToHiragana } from '../src/data/kana';
describe('timetable game', () => {
  it('unlocks with clock times in the N5 tour', () => {
    const at = STOPS.findIndex((s) => s.id === TIME_FROM);
    expect(at).toBeGreaterThan(0);
    expect(STOPS.findIndex((s) => s.id === DATE_FROM)).toBeGreaterThan(at);
    expect(timetableGame.available!(at - 1)).toBe(false);
    expect(timetableGame.available!(at)).toBe(true);
    const dur = STOPS.findIndex((s) => s.id === DURATION_FROM);
    expect(STOPS[dur]!.tier).toBe('N4');
  });
  it('accepts typed romaji answers', () => {
    expect(romajiToHiragana('yojijuppun')).toBe('よじじゅっぷん');
    expect(romajiToHiragana('shigatsutsuitachi')).toBe('しがつついたち');
  });
});

describe('durations', () => {
  it('know the sound changes', () => {
    expect(durationReadings('hour', 4)).toEqual(['よじかん']);
    expect(durationReadings('hour', 9)).toEqual(['くじかん']);
    expect(durationReadings('week', 1)).toEqual(['いっしゅうかん']);
    expect(durationReadings('week', 6)).toEqual(['ろくしゅうかん']);
    expect(durationReadings('week', 8)).toContain('はっしゅうかん');
    expect(durationReadings('month', 6)).toEqual(['ろっかげつ']);
    expect(durationReadings('month', 10)).toContain('じゅっかげつ');
    expect(durationReadings('year', 4)).toEqual(['よねん']);
    expect(durationReadings('year', 9)).toContain('きゅうねん');
  });
  it('offer traps that teach', () => {
    expect(durationDistractors('hour', 4)).toEqual(expect.arrayContaining(['よんじかん', 'よじ']));
    expect(durationDistractors('month', 1)).toContain('いちかげつ');
    expect(durationDistractors('month', 3)).toContain('さんがつ');
    expect(durationDistractors('month', 6)).toContain('ろくかげつ');
    expect(durationDistractors('week', 6)).toContain('ろっしゅうかん');
    expect(durationDistractors('year', 4)).toContain('よんねん');
  });
  it('always have three distinct wrong answers', () => {
    for (const unit of DURATION_UNITS) {
      for (let n = 1; n <= DURATION_MAX[unit]; n++) {
        const right = durationReadings(unit, n);
        const wrong = durationDistractors(unit, n);
        expect(wrong.length, `${unit} ${n}`).toBeGreaterThanOrEqual(3);
        expect(new Set(wrong).size).toBe(wrong.length);
        for (const w of wrong) expect(right).not.toContain(w);
      }
    }
  });
});
