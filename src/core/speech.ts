import { toHiragana } from '../data/kana';

/** Normalise Japanese text for loose comparison: hiragana, no spaces, punctuation or long-vowel marks. */
export function normalizeJa(s: string): string {
  return toHiragana(s)
    .replace(/[\s、。，．,.!?！？「」『』・ー〜~]/g, '')
    .toLowerCase();
}

export function levenshtein(a: string, b: string): number {
  const A = [...a];
  const B = [...b];
  const row = Array.from({ length: B.length + 1 }, (_, j) => j);
  for (let i = 1; i <= A.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= B.length; j++) {
      const tmp = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (A[i - 1] === B[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[B.length]!;
}

/** 0..1 similarity between what was heard and any accepted form. */
export function speechScore(heard: string, accepted: string[]): number {
  const h = normalizeJa(heard);
  if (!h) return 0;
  let best = 0;
  for (const a of accepted) {
    const t = normalizeJa(a);
    if (!t) continue;
    const d = levenshtein(h, t);
    best = Math.max(best, 1 - d / Math.max(h.length, t.length));
  }
  return best;
}

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
};

function recognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

let recognitionAllowed = true;

/** Browsers send speech-recognition audio to an online service, so young learner mode turns it off. */
export function allowRecognition(on: boolean): void {
  recognitionAllowed = on;
}

export function recognitionSupported(): boolean {
  return recognitionAllowed && typeof window !== 'undefined' && recognitionCtor() !== null;
}

/** Listen once for Japanese speech; resolves with candidate transcripts (empty on failure). */
export function recognizeOnce(timeoutMs = 7000): Promise<string[]> {
  return new Promise((resolve) => {
    const Ctor = recognitionCtor();
    if (!Ctor) return resolve([]);
    let done = false;
    const finish = (r: string[]): void => {
      if (done) return;
      done = true;
      resolve(r);
    };
    try {
      const rec = new Ctor();
      rec.lang = 'ja-JP';
      rec.interimResults = false;
      rec.maxAlternatives = 5;
      rec.onresult = (e) => {
        const first = e.results[0];
        const out: string[] = [];
        if (first) for (let i = 0; i < first.length; i++) out.push(first[i]!.transcript);
        finish(out);
      };
      rec.onerror = () => finish([]);
      rec.onend = () => finish([]);
      rec.start();
      setTimeout(() => {
        try {
          rec.stop();
        } catch {
          /* already stopped */
        }
        finish([]);
      }, timeoutMs);
    } catch {
      finish([]);
    }
  });
}

/** Record from the microphone for up to `ms`; resolves with a blob URL (or null if unavailable/denied). */
export async function recordClip(ms = 4000, onStart?: () => void): Promise<string | null> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return null;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    const stopped = new Promise<void>((r) => (rec.onstop = () => r()));
    rec.start();
    onStart?.();
    setTimeout(() => rec.state !== 'inactive' && rec.stop(), ms);
    await stopped;
    stream.getTracks().forEach((t) => t.stop());
    return URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
  } catch {
    return null;
  }
}
