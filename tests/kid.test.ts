import { describe, expect, it } from 'vitest';
import { applyKidPreset, breakDue, checkGate, makeGate, startingLives, BREAK_EVERY_MS } from '../src/core/kid';
import { defaultSave } from '../src/core/store';
import { allowRecognition, recognitionSupported } from '../src/core/speech';

describe('young learner mode', () => {
  it('is off by default and the preset turns on the helpful settings', () => {
    const s = defaultSave().settings;
    s.furigana = 'off';
    s.romaji = false;
    expect(s.kid).toBe(false);
    applyKidPreset(s);
    expect(s).toMatchObject({ kid: true, furigana: 'always', romaji: true, speech: true });
  });
  it('gives young learners lives that never run out', () => {
    const s = defaultSave().settings;
    expect(startingLives(s)).toBe(3);
    s.kid = true;
    expect(startingLives(s)).toBeGreaterThan(40);
  });
  it('asks a sum a grown-up can answer', () => {
    for (const r of [0, 0.5, 0.999]) {
      const g = makeGate(() => r);
      expect(g.answer).toBeGreaterThanOrEqual(11);
      expect(g.answer).toBeLessThanOrEqual(21);
      expect(checkGate(g, String(g.answer))).toBe(true);
      expect(checkGate(g, ` ${g.answer} `)).toBe(true);
      expect(checkGate(g, String(g.answer + 1))).toBe(false);
      expect(checkGate(g, null)).toBe(false);
      expect(checkGate(g, '')).toBe(false);
    }
  });
  it('reminds about a break every 20 minutes', () => {
    expect(breakDue(0, BREAK_EVERY_MS - 1)).toBe(false);
    expect(breakDue(0, BREAK_EVERY_MS)).toBe(true);
    expect(breakDue(BREAK_EVERY_MS, BREAK_EVERY_MS * 2 - 1)).toBe(false);
  });
  it('turns off online speech recognition', () => {
    allowRecognition(false);
    expect(recognitionSupported()).toBe(false);
    allowRecognition(true);
  });
  it('keeps old saves working: the setting is merged in with a default', () => {
    expect(defaultSave().settings.kid).toBe(false);
  });
});
