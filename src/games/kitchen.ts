import { h, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { recordAnswer, sessionItems, shell } from './common';
import { sample, shuffle } from '../core/srs';
import { conjugate, FORM_LABEL, FORM_UNLOCK, formMakesSense, isVerbEntry, wrongForms, type Form } from '../core/conjugate';
import { STOPS } from '../data/journey';
import { romajiToHiragana } from '../data/kana';

export function formsAt(stopIndex: number): Form[] {
  return (Object.keys(FORM_UNLOCK) as Form[]).filter((f) => {
    const at = STOPS.findIndex((s) => s.id === FORM_UNLOCK[f]);
    return at >= 0 && at <= stopIndex;
  });
}

const isVerb = (i: Item): boolean => i.kind === 'word' && isVerbEntry(i.reading, i.en ?? '');

/** Verb Kitchen: cook verbs into the right form, like a cat chef. */
export const kitchenGame: GameDef = {
  id: 'kitchen',
  name: 'Verb Kitchen',
  jp: 'どうしキッチン',
  emoji: '🍳',
  blurb: 'Cook verbs into the right form — ます, て, た, ない and more.',
  kinds: ['word'],
  skill: 'writing',
  available: (stopIndex) => stopIndex === undefined || formsAt(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Verb Kitchen 🍳');
    const forms = formsAt(ctx.stopIndex);
    const verbs = ctx.wide.filter(isVerb);
    const picked = sessionItems(ctx, 10, ['word']).filter(isVerb);
    const rounds = [...picked, ...shuffle(verbs)].filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i).slice(0, 8);
    if (!rounds.length || !forms.length) return ctx.quit();
    let idx = 0;
    let correct = 0;
    let lives = 3;
    sh.setLives(lives);

    const next = (): void => {
      if (idx >= rounds.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const verb = rounds[idx]!;
      // prefer the newest forms a bit more often
      const usable = forms.filter((f) => formMakesSense(verb.reading, f));
      const form = usable.length ? (Math.random() < 0.5 ? usable[usable.length - 1]! : sample(usable)) : 'masu';
      const answer = conjugate(verb.reading, form);
      const id = `conj:${verb.reading}:${form}`;
      let locked = false;
      const done = async (ok: boolean): Promise<void> => {
        locked = true;
        recordAnswer(ctx, { ...verb, id }, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        reveal.textContent = `${verb.reading} → ${answer}`;
        void speak(answer);
        await sleep(ok ? 900 : 1800);
        idx++;
        next();
      };
      const reveal = h('div', { class: 'type-preview jp' }, ' ');
      const prompt = h(
        'div',
        { class: 'prompt' },
        h('div', { class: 'prompt-emoji' }, '🍳'),
        h('div', { class: 'prompt-jp jp kitchen-verb' }, verb.text),
        h('div', { class: 'prompt-romaji' }, `${verb.emoji ?? ''} ${verb.en ?? ''}`),
        h('div', { class: 'form-chip' }, `→ ${FORM_LABEL[form]}`),
      );
      if (ctx.level === 3) {
        const input = h('input', { class: 'type-input', type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Type the form in romaji' });
        const preview = h('div', { class: 'type-preview jp' }, ' ');
        input.addEventListener('input', () => (preview.textContent = romajiToHiragana(input.value)));
        const submit = (): void => {
          if (locked) return;
          const typed = romajiToHiragana(input.value.trim().toLowerCase());
          void done(typed === answer || input.value.trim() === answer);
        };
        input.addEventListener('keydown', (e) => (e as KeyboardEvent).key === 'Enter' && submit());
        sh.body.replaceChildren(prompt, preview, input, h('button', { class: 'btn primary', onClick: submit }, 'Serve ⏎'), reveal);
        input.focus();
      } else {
        const options = shuffle([answer, ...shuffle(wrongForms(verb.reading, form)).slice(0, ctx.level === 1 ? 2 : 3)]);
        const buttons = options.map((o) => {
          const b = h('button', { class: 'choice text jp' }, o);
          b.addEventListener('click', () => {
            if (locked) return;
            const ok = o === answer;
            b.classList.add(ok ? 'right' : 'wrong');
            if (!ok) buttons[options.indexOf(answer)]!.classList.add('right');
            void done(ok);
          });
          return b;
        });
        sh.body.replaceChildren(prompt, h('div', { class: 'choices' }, buttons), reveal);
      }
    };
    sh.say('Chef cat, cook this verb!', 'think');
    next();
  },
};
