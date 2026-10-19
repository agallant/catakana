import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { catSvg, FUR_PRESETS } from '../ui/cat';
import { sfx } from '../core/audio';
import type { CatLook } from '../core/store';

const EYES = ['#3d85c6', '#6aa84f', '#e6b800', '#8e44ad', '#cc4125'];
const NAMES = ['Mochi', 'Tama', 'Sora', 'Kuro', 'Momo', 'Nori', 'Chibi', 'Miso'];

export function welcomeScreen(app: App): Screen {
  const look: CatLook = { ...app.store.data.look };
  let name = app.store.data.name;
  const preview = h('div', { class: 'welcome-cat' });
  const redraw = (): void => preview.replaceChildren(catSvg(look, 'happy', 180));
  redraw();

  const furs = FUR_PRESETS.map((p) => {
    const b = h('button', { class: 'swatch', style: `background:${p.fur};border-color:${p.accent}`, 'aria-label': `Fur ${p.fur}` });
    b.addEventListener('click', () => {
      Object.assign(look, { fur: p.fur, accent: p.accent, pattern: p.pattern });
      sfx.tap();
      redraw();
    });
    return b;
  });
  const eyes = EYES.map((c) => {
    const b = h('button', { class: 'swatch round', style: `background:${c}`, 'aria-label': `Eyes ${c}` });
    b.addEventListener('click', () => {
      look.eyes = c;
      sfx.tap();
      redraw();
    });
    return b;
  });
  const input = h('input', { class: 'type-input', type: 'text', value: name, maxlength: 14, 'aria-label': 'Cat name' });
  input.addEventListener('input', () => (name = input.value));
  const start = (): void => {
    app.store.update((d) => {
      d.name = (name.trim() || 'Mochi').slice(0, 14);
      d.look = look;
      d.started = true;
    });
    sfx.meow();
    app.go('travel/tokyo');
  };
  const el = h(
    'div',
    { class: 'screen welcome' },
    h('h1', { class: 'logo' }, 'Cat', h('span', null, 'a'), 'kana'),
    h('p', { class: 'tag' }, 'キャタカナ — a cat’s adventure through Japan'),
    preview,
    h('p', { class: 'lead' }, 'Nya! Pick your travel cat, then hop on a plane to Tokyo. You will learn Japanese on the way — one station at a time.'),
    h('label', { class: 'field' }, 'Your cat’s name', input),
    h('div', { class: 'field' }, h('div', { class: 'label' }, 'Fur'), h('div', { class: 'swatches' }, furs)),
    h('div', { class: 'field' }, h('div', { class: 'label' }, 'Eyes'), h('div', { class: 'swatches' }, eyes)),
    h('button', { class: 'btn ghost small', onClick: () => { name = NAMES[Math.floor(Math.random() * NAMES.length)]!; input.value = name; sfx.tap(); } }, '🎲 Random name'),
    h('button', { class: 'btn primary big', onClick: start }, 'Start the journey ✈️'),
    h(
      'button',
      {
        class: 'btn ghost',
        onClick: () => {
          app.store.update((d) => {
            d.name = (name.trim() || 'Mochi').slice(0, 14);
            d.look = look;
          });
          app.go('placement');
        },
      },
      'Already know some kana? Take a placement test',
    ),
  );
  return { el };
}
