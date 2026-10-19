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

export const sfx = {
  correct(): void {
    tone(660, 0, 0.12, 'triangle');
    tone(880, 0.1, 0.18, 'triangle');
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
  tap(): void {
    tone(440, 0, 0.05, 'square', 0.04);
  },
  coin(): void {
    tone(988, 0, 0.07, 'square', 0.06);
    tone(1319, 0.07, 0.18, 'square', 0.06);
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
