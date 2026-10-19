import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { recordAnswer, sessionItems, shell } from './common';
import { romajiToHiragana, toKatakana } from '../data/kana';

/** Type the romaji for the kana you see (and the kana for the picture) — keyboard fluency. */
export const typingGame: GameDef = {
  id: 'typing',
  name: 'Keyboard Cat',
  jp: 'タイピング',
  emoji: '⌨️',
  blurb: 'Type what you read — like a keyboard cat!',
  kinds: ['kana', 'word', 'kanji'],
  skill: 'writing',
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Keyboard Cat ⌨️');
    // dictation skips kanji (homophones)
    const items = sessionItems(ctx, undefined, ctx.level === 3 ? ['kana', 'word'] : undefined);
    let idx = 0;
    let correct = 0;
    let lives = 3;
    sh.setLives(lives);

    const matches = (input: string, reading: string, romaji: string): boolean => {
      const t = input.trim().toLowerCase().replace(/\s+/g, '');
      if (!t) return false;
      if (romaji && t === romaji.toLowerCase()) return true;
      const hira = romajiToHiragana(t);
      return hira === reading || toKatakana(hira) === reading || t === reading;
    };
    const accepts = (input: string, it: Item): boolean => [it.reading, ...(it.alts ?? [])].some((r) => matches(input, r, r === it.reading ? it.romaji : ''));

    const next = async (): Promise<void> => {
      if (idx >= items.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: items.length });
      }
      sh.setProgress(idx, items.length);
      const item = items[idx]!;
      // level 1: read kana → type romaji; level 2+: see picture/English → type romaji of the word
      const production = ctx.level === 2 && item.kind === 'word';
      const dictation = ctx.level === 3;
      const input = h('input', { class: 'type-input', type: 'text', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', spellcheck: 'false', inputmode: 'text', 'aria-label': 'Type romaji' });
      const preview = h('div', { class: 'type-preview jp' }, ' ');
      input.addEventListener('input', () => {
        const hira = romajiToHiragana(input.value.toLowerCase());
        preview.textContent = item.reading.match(/[゠-ヿ]/) ? toKatakana(hira) : hira;
      });
      let locked = false;
      const submit = async (): Promise<void> => {
        if (locked) return;
        locked = true;
        const ok = accepts(input.value, item);
        recordAnswer(ctx, item, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
          preview.textContent = `${item.text}  =  ${item.romaji}`;
        }
        input.disabled = true;
        input.classList.add(ok ? 'right' : 'wrong');
        void speak(item.reading);
        await sleep(ok ? 800 : 1700);
        idx++;
        void next();
      };
      input.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') void submit();
      });
      sh.body.replaceChildren(
        dictation
          ? h('div', { class: 'prompt' }, h('button', { class: 'btn primary', onClick: () => void speak(item.reading) }, '🔊 Listen'), h('div', { class: 'prompt-romaji' }, 'Type what you hear'))
          : production
          ? h('div', { class: 'prompt' }, h('div', { class: 'prompt-emoji' }, item.emoji ?? ''), h('div', { class: 'prompt-romaji' }, item.en ?? ''))
          : h('div', { class: 'prompt prompt-kana' }, h('div', { class: 'prompt-jp jp' }, item.text), item.en ? h('div', { class: 'prompt-romaji' }, `${item.emoji ?? ''} ${item.en}`) : null),
        preview,
        input,
        h('button', { class: 'btn primary', onClick: () => void submit() }, 'Enter ⏎'),
      );
      input.focus();
      if (dictation) void speak(item.reading);
    };
    sh.say(ctx.level === 3 ? 'Dictation: type what you hear!' : ctx.level === 2 ? 'Type the word for each picture!' : 'Type the romaji!', 'think');
    void next();
  },
};
