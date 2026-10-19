import { describe, expect, it } from 'vitest';
import { dayDistractors, dayReadings, monthDistractors, monthReading, minuteReadings, timeDistractors, timeReadings } from '../src/data/time';

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
import { timetableGame, TIME_FROM, DATE_FROM } from '../src/games/timetable';
import { romajiToHiragana } from '../src/data/kana';
describe('timetable game', () => {
  it('unlocks with clock times in the N5 tour', () => {
    const at = STOPS.findIndex((s) => s.id === TIME_FROM);
    expect(at).toBeGreaterThan(0);
    expect(STOPS.findIndex((s) => s.id === DATE_FROM)).toBeGreaterThan(at);
    expect(timetableGame.available!(at - 1)).toBe(false);
    expect(timetableGame.available!(at)).toBe(true);
  });
  it('accepts typed romaji answers', () => {
    expect(romajiToHiragana('yojijuppun')).toBe('よじじゅっぷん');
    expect(romajiToHiragana('shigatsutsuitachi')).toBe('しがつついたち');
  });
});
