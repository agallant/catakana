import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

/** A stand-in for WebAudio that records what the player asks of it and lets a test suspend and resume it. */
class FakeContext {
  state: 'running' | 'suspended' = 'running';
  currentTime = 0;
  destination = {};
  oscillators = 0;
  resumes = 0;
  onstatechange: (() => void) | null = null;
  private node(): Record<string, unknown> {
    const n: Record<string, unknown> = {
      gain: { value: 1, setValueAtTime: () => undefined, linearRampToValueAtTime: () => undefined, exponentialRampToValueAtTime: () => undefined, cancelScheduledValues: () => undefined },
      frequency: { value: 0 },
      connect: (to: unknown) => to ?? n,
      disconnect: () => undefined,
      start: () => undefined,
      stop: () => undefined,
    };
    return n;
  }
  createGain(): unknown {
    return this.node();
  }
  createBiquadFilter(): unknown {
    return this.node();
  }
  createOscillator(): unknown {
    this.oscillators += 1;
    return this.node();
  }
  resume(): Promise<void> {
    this.resumes += 1;
    return Promise.resolve();
  }
}

describe('theme music playback', () => {
  let fake: FakeContext;
  beforeAll(() => {
    fake = new FakeContext();
    (window as unknown as { AudioContext: unknown }).AudioContext = function () {
      return fake;
    };
  });
  afterAll(() => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    vi.restoreAllMocks();
  });

  it('starts over when the browser suspends the audio, and plays again once it can', async () => {
    const { music, MENU_THEMES } = await import('../src/core/music');
    music.configure({ on: true, volume: 0.5 });
    music.play(MENU_THEMES.map!);
    expect(fake.oscillators).toBeGreaterThan(0);

    // an interruption (a phone call, Siri) leaves the audio suspended while the page stays visible
    fake.state = 'suspended';
    const before = fake.oscillators;
    music.sync();
    expect(fake.resumes).toBeGreaterThan(0);
    expect(fake.oscillators).toBe(before);
    // a volume change must not pretend the music is still playing
    music.configure({ on: true, volume: 0.6 });
    expect(fake.oscillators).toBe(before);

    // when the audio can run again, the music comes back by itself
    fake.state = 'running';
    fake.onstatechange?.();
    expect(fake.oscillators).toBeGreaterThan(before);

    music.play(null);
  });
});
