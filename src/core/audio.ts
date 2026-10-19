/** Sound effects synthesised with WebAudio (no asset downloads) + Japanese speech via speechSynthesis. */
let ctx: AudioContext | null = null;
let enabled = true;
let speechOn = true;
let rate = 0.85;

export function configureAudio(opts: { sound: boolean; speech: boolean; rate: number }): void {
  enabled = opts.sound;
  speechOn = opts.speech;
  rate = opts.rate;
}

function ac(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.15, endFreq?: number): void {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t0 = c.currentTime + start;
  o.frequency.setValueAtTime(freq, t0);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

/** Pentatonic scale (C major pentatonic) used for cheerful, never-clashing melodies. */
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];

function melody(notes: [number, number, number?][], type: OscillatorType = 'triangle', gain = 0.1): void {
  // [frequency, start, duration]
  for (const [f, start, dur = 0.18] of notes) tone(f, start, dur, type, gain);
}

export type TransportSound = 'plane' | 'train' | 'shinkansen' | 'bus' | 'ferry';

export const sfx = {
  /** Rises a little with each answer in a row, so streaks feel good. */
  correct(streak = 0): void {
    const step = Math.min(streak, 6);
    const a = PENTA[step % PENTA.length]!;
    const b = PENTA[Math.min(step + 2, PENTA.length - 1)]!;
    tone(a, 0, 0.12, 'triangle');
    tone(b, 0.1, 0.18, 'triangle');
  },
  wrong(): void {
    tone(220, 0, 0.22, 'sawtooth', 0.08, 150);
  },
  meow(): void {
    tone(520, 0, 0.35, 'triangle', 0.12, 900);
    tone(900, 0.3, 0.3, 'triangle', 0.1, 560);
  },
  purr(): void {
    for (let i = 0; i < 8; i++) tone(70 + (i % 2) * 8, i * 0.07, 0.07, 'sawtooth', 0.05);
  },
  win(): void {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.2, 'triangle', 0.14));
  },
  /** Achievement / quest unlock: a bright arpeggio landing on a chord. */
  fanfare(): void {
    melody([[PENTA[0]!, 0, 0.12], [PENTA[2]!, 0.1, 0.12], [PENTA[3]!, 0.2, 0.12], [PENTA[5]!, 0.3, 0.45]], 'triangle', 0.12);
    tone(PENTA[2]!, 0.3, 0.45, 'sine', 0.06);
    tone(PENTA[3]!, 0.3, 0.45, 'sine', 0.06);
  },
  tap(): void {
    tone(660, 0, 0.05, 'triangle', 0.05);
  },
  coin(): void {
    tone(988, 0, 0.07, 'square', 0.05);
    tone(1319, 0.07, 0.18, 'square', 0.05);
  },
  /** A rubber eki stamp pressed onto paper: a soft low thump. */
  stamp(): void {
    tone(140, 0, 0.12, 'sine', 0.25, 60);
    tone(900, 0, 0.03, 'square', 0.03);
  },
  /** Departure jingles, in the spirit of Japan's station melodies (original tunes). */
  depart(kind: TransportSound): void {
    const p = PENTA;
    switch (kind) {
      case 'train':
        melody([[p[2]!, 0, 0.16], [p[4]!, 0.16, 0.16], [p[3]!, 0.32, 0.16], [p[5]!, 0.48, 0.16], [p[4]!, 0.64, 0.16], [p[2]!, 0.8, 0.16], [p[3]!, 0.96, 0.4]], 'sine', 0.1);
        break;
      case 'shinkansen':
        // the classic two-tone "pin-pon" before an announcement, then a rising phrase
        tone(p[7]!, 0, 0.35, 'sine', 0.1);
        tone(p[5]!, 0.3, 0.5, 'sine', 0.1);
        melody([[p[0]!, 0.9], [p[2]!, 1.05], [p[3]!, 1.2], [p[5]!, 1.35, 0.4]], 'triangle', 0.08);
        break;
      case 'bus':
        tone(1318.5, 0, 0.25, 'sine', 0.1);
        tone(1318.5, 0.3, 0.35, 'sine', 0.1);
        break;
      case 'ferry':
        tone(110, 0, 1.1, 'sawtooth', 0.06);
        tone(165, 0, 1.1, 'sine', 0.05);
        break;
      case 'plane':
        melody([[p[5]!, 0, 0.3], [p[3]!, 0.3, 0.3], [p[0]!, 0.6, 0.5]], 'sine', 0.09);
        break;
    }
  },
};

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let jaVoice: SpeechSynthesisVoice | null | undefined;

function pickVoice(): SpeechSynthesisVoice | null {
  if (jaVoice !== undefined && jaVoice !== null) return jaVoice;
  const voices = window.speechSynthesis.getVoices();
  const ja = voices.filter((v) => v.lang.toLowerCase().startsWith('ja'));
  jaVoice = ja.find((v) => v.localService) ?? ja[0] ?? null;
  return jaVoice;
}

/** Whether a Japanese voice appears to be installed (voices may load async). */
export function hasJapaneseVoice(): boolean {
  if (!speechSupported()) return false;
  return pickVoice() !== null;
}

/** Speak Japanese text. Resolves when finished (or immediately if unsupported). */
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}): Promise<boolean> {
  return new Promise((resolve) => {
    if (!speechOn || !speechSupported()) return resolve(false);
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = opts.rate ?? rate;
      if (opts.pitch !== undefined) u.pitch = opts.pitch;
      const v = pickVoice();
      if (v) u.voice = v;
      u.onend = () => resolve(true);
      u.onerror = () => resolve(false);
      synth.speak(u);
      // Some browsers never fire end; don't hang the UI (allow ~0.25s per character).
      setTimeout(() => resolve(true), Math.max(4000, text.length * 250));
    } catch {
      resolve(false);
    }
  });
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    jaVoice = undefined;
  });
}
