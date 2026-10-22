import { h, ruby, sleep } from '../ui/dom';
import { speak } from '../core/audio';
import type { GameDef, GameContext, Item } from './types';
import { recordAnswer, sessionItems, shell, startingLives } from './common';
import { sample, shuffle } from '../core/srs';
import { conjugate, FORM_LABEL, FORM_UNLOCK, formMakesSense, isVerbEntry, wrongForms, type Form } from '../core/conjugate';
import { STOPS } from '../data/journey';
import { romajiToHiragana } from '../data/kana';
import { ADJECTIVES, ADJ_FORM_LABEL, ADJ_FORM_UNLOCK, conjugateAdj, wrongAdjForms, type AdjForm } from '../core/adjectives';

export function formsAt(stopIndex: number): Form[] {
  return (Object.keys(FORM_UNLOCK) as Form[]).filter((f) => {
    const at = STOPS.findIndex((s) => s.id === FORM_UNLOCK[f]);
    return at >= 0 && at <= stopIndex;
  });
}

export function adjFormsAt(stopIndex: number): AdjForm[] {
  return (Object.keys(ADJ_FORM_UNLOCK) as AdjForm[]).filter((f) => {
    const at = STOPS.findIndex((s) => s.id === ADJ_FORM_UNLOCK[f]);
    return at >= 0 && at <= stopIndex;
  });
}

/** One dish to cook: the word shown, the form asked for, the answer and tempting wrong answers. */
interface Dish {
  id: string;
  word: Item;
  /** furigana markup or plain text for the prompt */
  shown: string;
  label: string;
  answer: string;
  wrongs: string[];
}

function verbDish(verb: Item, forms: Form[]): Dish {
  // prefer the newest forms a bit more often
  const usable = forms.filter((f) => formMakesSense(verb.reading, f));
  const form = usable.length ? (Math.random() < 0.5 ? usable[usable.length - 1]! : sample(usable)) : 'masu';
  return { id: `conj:${verb.reading}:${form}`, word: verb, shown: verb.text, label: FORM_LABEL[form], answer: conjugate(verb.reading, form), wrongs: wrongForms(verb.reading, form) };
}

function adjDish(forms: AdjForm[]): Dish {
  const adj = sample(ADJECTIVES);
  const form = sample(forms);
  const word: Item = { id: `adj:${adj.reading}`, kind: 'word', text: adj.reading, reading: adj.reading, romaji: '', en: adj.en, emoji: adj.emoji };
  const kind = adj.kind === 'i' ? 'い-adj' : 'な-adj';
  return { id: `adj:${adj.reading}:${form}`, word, shown: adj.jp, label: `${kind}: ${ADJ_FORM_LABEL[form]}`, answer: conjugateAdj(adj, form), wrongs: wrongAdjForms(adj, form) };
}

const isVerb = (i: Item): boolean => i.kind === 'word' && isVerbEntry(i.reading, i.en ?? '');

/** Verb Kitchen: cook verbs and adjectives into the right form, like a cat chef. */
export const kitchenGame: GameDef = {
  id: 'kitchen',
  name: 'Verb Kitchen',
  jp: 'どうしキッチン',
  emoji: '🍳',
  blurb: 'Cook verbs and adjectives into the right form — ます, て, た, ない, くない and more.',
  kinds: ['word'],
  skill: 'writing',
  available: (stopIndex) => stopIndex === undefined || formsAt(stopIndex).length + adjFormsAt(stopIndex).length > 0,
  start(ctx: GameContext) {
    const sh = shell(ctx, 'Verb Kitchen 🍳');
    const forms = formsAt(ctx.stopIndex);
    const adjForms = adjFormsAt(ctx.stopIndex);
    const verbs = ctx.wide.filter(isVerb);
    const picked = sessionItems(ctx, 10, ['word']).filter(isVerb);
    const verbRounds = forms.length ? [...picked, ...shuffle(verbs)].filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i) : [];
    // a few adjective dishes once adjective forms are on the menu
    const nAdj = adjForms.length ? (verbRounds.length ? 3 : 8) : 0;
    const rounds: Dish[] = shuffle([
      ...verbRounds.slice(0, 8 - nAdj).map((v) => verbDish(v, forms)),
      ...Array.from({ length: nAdj }, () => adjDish(adjForms)),
    ]);
    if (!rounds.length) return ctx.quit();
    let idx = 0;
    let correct = 0;
    let lives = startingLives(ctx.store.data.settings);
    sh.setLives(lives);

    const next = (): void => {
      if (idx >= rounds.length || lives <= 0) {
        sh.destroy();
        return ctx.finish({ correct, total: rounds.length });
      }
      sh.setProgress(idx, rounds.length);
      const dish = rounds[idx]!;
      const { answer } = dish;
      let locked = false;
      const done = async (ok: boolean): Promise<void> => {
        locked = true;
        recordAnswer(ctx, { ...dish.word, id: dish.id }, ok, sh);
        if (ok) correct++;
        else {
          lives--;
          sh.setLives(lives);
        }
        reveal.textContent = `${dish.word.reading} → ${answer}`;
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
        h('div', { class: 'prompt-jp jp kitchen-verb' }, ruby(dish.shown, ctx.store.data.settings.furigana)),
        h('div', { class: 'prompt-romaji' }, `${dish.word.emoji ?? ''} ${dish.word.en ?? ''}`),
        h('div', { class: 'form-chip' }, `→ ${dish.label}`),
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
        const options = shuffle([answer, ...shuffle(dish.wrongs).slice(0, ctx.level === 1 ? 2 : 3)]);
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
        sh.body.replaceChildren(prompt, h('div', { class: options.some((o) => o.length > 6) ? 'choices one-col' : 'choices' }, buttons), reveal);
      }
    };
    sh.say('Chef cat, cook this word!', 'think');
    next();
  },
};
