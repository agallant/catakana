import { describe, expect, it } from 'vitest';
import { applyKidPreset, breakDue, checkGate, makeGate, startingLives, BREAK_EVERY_MS } from '../src/core/kid';
import { Store, defaultSave } from '../src/core/store';
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
    expect(defaultSave().settings.bigText).toBe(false);
    const old = JSON.stringify({ v: 1, name: 'Mochi', settings: { furigana: 'tap', sound: false } });
    const st = new Map([['catakana.save.v1', old]]);
    const s = new Store({ getItem: (k) => st.get(k) ?? null, setItem: (k, v) => void st.set(k, v) });
    expect(s.data.settings).toMatchObject({ furigana: 'tap', sound: false, bigText: false, kid: false });
  });
});

describe('young learner mode: speech recognition in progress', () => {
  it('is stopped the moment recognition is switched off', async () => {
    let stopped = 0;
    class FakeRecognizer {
      lang = '';
      interimResults = false;
      maxAlternatives = 1;
      onresult = null;
      onerror = null;
      onend = null;
      start(): void {}
      stop(): void {
        stopped++;
      }
    }
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = FakeRecognizer;
    const { recognizeOnce } = await import('../src/core/speech');
    const pending = recognizeOnce(60_000);
    allowRecognition(false);
    expect(await pending).toEqual([]);
    expect(stopped).toBe(1);
    allowRecognition(true);
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
  });
});
