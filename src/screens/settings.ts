import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { hasJapaneseVoice, speak, sfx } from '../core/audio';
import type { FuriganaMode } from '../core/store';

export function settingsScreen(app: App): Screen {
  const d = app.store.data;
  const toggle = (label: string, key: 'sound' | 'speech' | 'romaji' | 'reduceMotion') =>
    h('label', { class: 'setting' }, h('span', null, label), h('input', { type: 'checkbox', checked: d.settings[key], onChange: (e: Event) => app.store.update((s) => { s.settings[key] = (e.target as HTMLInputElement).checked; }) }));
  const furi = (['always', 'tap', 'off'] as FuriganaMode[]).map((m) =>
    h('button', { class: `chip ${d.settings.furigana === m ? 'on' : ''}`, onClick: () => { app.store.update((s) => { s.settings.furigana = m; }); app.render(); } }, { always: 'Always', tap: 'Tap to show', off: 'Off' }[m]),
  );
  const el = h(
    'div',
    { class: 'screen settings' },
    h('h2', null, '⚙️ Settings'),
    toggle('Sound effects', 'sound'),
    toggle('Japanese voice (text-to-speech)', 'speech'),
    toggle('Show romaji', 'romaji'),
    toggle('Reduce motion', 'reduceMotion'),
    h('label', { class: 'setting' }, h('span', null, 'Voice speed'), h('input', { type: 'range', min: '0.5', max: '1.2', step: '0.05', value: d.settings.speechRate, onChange: (e: Event) => app.store.update((s) => { s.settings.speechRate = Number((e.target as HTMLInputElement).value); }) })),
    h('div', { class: 'setting col' }, h('span', null, 'Furigana (reading aids over kanji)'), h('div', { class: 'chips' }, furi)),
    h('div', { class: 'setting col' }, h('button', { class: 'btn ghost', onClick: () => { sfx.meow(); void speak('こんにちは'); } }, '🔊 Test voice'), h('small', null, hasJapaneseVoice() ? 'Japanese voice found ✔' : 'No Japanese voice found. Add one in your device’s text-to-speech settings.')),
    h('div', { class: 'setting col' }, h('strong', null, 'Your progress'), h('small', null, `${d.stats.correct} right · ${d.stats.wrong} wrong · ${d.stats.rounds} rounds played`), h('small', null, 'Saved only on this device.')),
    h('button', { class: 'btn danger', onClick: () => { if (confirm('Erase all progress on this device?')) { app.store.reset(); app.go('welcome'); } } }, 'Erase progress'),
    h('p', { class: 'hint' }, 'Catakana v0.1 · works offline · made with 🐾'),
  );
  return { el };
}
