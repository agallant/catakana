import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Question } from '../src/core/placement';

const asked: Question[] = [];

vi.mock('../src/core/placement', async (orig) => {
  const m = await orig<typeof import('../src/core/placement')>();
  return {
    ...m,
    kanaQuestions: (...a: Parameters<typeof m.kanaQuestions>) => {
      const qs = m.kanaQuestions(...a);
      asked.push(...qs);
      return qs;
    },
    tierQuestions: (...a: Parameters<typeof m.tierQuestions>) => {
      const qs = m.tierQuestions(...a);
      asked.push(...qs);
      return qs;
    },
  };
});

import { placementScreen } from '../src/screens/placement';
import { Store } from '../src/core/store';
import type { App } from '../src/ui/app';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

const setup = () => {
  const store = new Store(mem());
  const go = vi.fn();
  const screen = placementScreen({ store, go } as unknown as App);
  document.body.replaceChildren(screen.el);
  return { store, go, el: screen.el };
};

const tick = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(1500);
};

/** Click the choice at `pick(question)` for every question until the result shows. */
async function play(el: HTMLElement, pick: (q: Question) => number | 'unsure', maxQuestions = 100): Promise<void> {
  el.querySelector<HTMLButtonElement>('.btn.primary.big')!.click();
  for (let n = 0; n < maxQuestions && !el.querySelector('.results'); n++) {
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('.choice')];
    // find the question on screen by its choices
    const shown = [...asked].reverse().find((x) => x.choices.length === buttons.length && x.choices.every((c, i) => buttons[i]!.textContent === c))!;
    const choice = pick(shown);
    if (choice === 'unsure') [...el.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent === 'I’m not sure')!.click();
    else buttons[choice]!.click();
    await tick();
  }
}

describe('placement screen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    asked.length = 0;
  });
  afterEach(() => vi.useRealTimers());

  it('runs through every level for a learner who knows it all', async () => {
    const { el, go, store } = setup();
    await play(el, (q) => q.answer);
    const text = el.querySelector('.results')!.textContent!;
    for (const area of ['Hiragana', 'Katakana', 'N5', 'N4', 'N3', 'N2', 'N1']) expect(text).toContain(area);
    expect(text).toContain('every level we check');
    expect(store.data.started).toBe(false);
    [...el.querySelectorAll('button')].find((b) => b.textContent?.startsWith('Skip ahead'))!.click();
    expect(store.data.started).toBe(true);
    expect(store.data.stops.tokyo).toBeGreaterThanOrEqual(1);
    expect(go).toHaveBeenCalledWith(expect.stringMatching(/^travel\//));
  });

  it('stops at the first level that is too hard and reports the one before', async () => {
    const { el } = setup();
    await play(el, (q) => (q.area === 'N3' ? (q.answer + 1) % q.choices.length : q.answer));
    const text = el.querySelector('.results')!.textContent!;
    expect(text).toContain('N4');
    expect(text).toContain('Next up is N3');
    expect(text).not.toContain('N2 ·');
    expect(asked.some((q) => q.area === 'N2')).toBe(false);
  });

  it('puts a learner who is unsure of everything at the very beginning', async () => {
    const { el, store, go } = setup();
    await play(el, () => 'unsure');
    expect(el.querySelector('.results')!.textContent).toContain('very beginning');
    expect(asked.every((q) => q.area === 'Hiragana')).toBe(true);
    [...el.querySelectorAll('button')].find((b) => b.textContent === 'Start from Tokyo')!.click();
    expect(store.data.started).toBe(true);
    expect(go).toHaveBeenCalledWith('travel/tokyo');
  });
});
