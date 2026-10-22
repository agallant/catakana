import type { App, Screen } from '../ui/app';
import { h } from '../ui/dom';
import { hasJapaneseVoice, speak, sfx } from '../core/audio';
import { Store, type FuriganaMode } from '../core/store';
import { applyKidPreset, checkGate, makeGate } from '../core/kid';

/** Ask a quick sum before anything a child should not do alone. */
function grownUp(app: App): boolean {
  if (!app.store.data.settings.kid) return true;
  const g = makeGate();
  return checkGate(g, prompt(g.question));
}

export function settingsScreen(app: App): Screen {
  const d = app.store.data;
  const toggle = (label: string, key: 'sound' | 'speech' | 'romaji' | 'reduceMotion' | 'bigText') =>
    h('label', { class: 'setting' }, h('span', null, label), h('input', { type: 'checkbox', checked: d.settings[key], onChange: (e: Event) => app.store.update((s) => { s.settings[key] = (e.target as HTMLInputElement).checked; }) }));
  const furi = (['always', 'tap', 'off'] as FuriganaMode[]).map((m) =>
    h('button', { class: `chip ${d.settings.furigana === m ? 'on' : ''}`, onClick: () => { app.store.update((s) => { s.settings.furigana = m; }); app.render(); } }, { always: 'Always', tap: 'Tap to show', off: 'Off' }[m]),
  );
  const el = h(
    'div',
    { class: 'screen settings' },
    h('h2', null, '⚙️ Settings'),
    playersSection(app),
    toggle('Sound effects', 'sound'),
    toggle('Japanese voice (text-to-speech)', 'speech'),
    toggle('Show romaji', 'romaji'),
    toggle('Larger text and buttons', 'bigText'),
    toggle('Reduce motion', 'reduceMotion'),
    h(
      'label',
      { class: 'setting' },
      h('span', null, '🧒 Young learner mode', h('br'), h('small', null, 'Bigger buttons, no game-over, kana help always on, a grown-up check for backups and erasing, no online speech recognition, and a break reminder every 20 minutes.')),
      h('input', {
        type: 'checkbox',
        checked: d.settings.kid,
        onChange: (e: Event) => {
          const on = (e.target as HTMLInputElement).checked;
          if (!on && !grownUp(app)) return void app.render();
          app.store.update((s) => { if (on) applyKidPreset(s.settings); else s.settings.kid = false; });
          app.render();
        },
      }),
    ),
    h('label', { class: 'setting' }, h('span', null, 'Voice speed'), h('input', { type: 'range', min: '0.5', max: '1.2', step: '0.05', value: d.settings.speechRate, onChange: (e: Event) => app.store.update((s) => { s.settings.speechRate = Number((e.target as HTMLInputElement).value); }) })),
    h('div', { class: 'setting col' }, h('span', null, 'Furigana (reading aids over kanji)'), h('div', { class: 'chips' }, furi)),
    h('div', { class: 'setting col' }, h('button', { class: 'btn ghost', onClick: () => { sfx.meow(); void speak('こんにちは'); } }, '🔊 Test voice'), h('small', null, hasJapaneseVoice() ? 'Japanese voice found ✔' : 'No Japanese voice found. Add one in your device’s text-to-speech settings.')),
    h('div', { class: 'setting col' }, h('strong', null, 'Your progress'), h('small', null, d.settings.kid ? `⭐ ${d.stats.correct} right answers` : `${d.stats.correct} right · ${d.stats.wrong} wrong · ${d.stats.rounds} rounds played`), h('small', null, 'Saved only on this device.')),
    h(
      'div',
      { class: 'setting col' },
      h('strong', null, 'Backup'),
      h('small', null, 'Progress lives only on this device. Save a backup file to move it to another device.'),
      h(
        'div',
        { class: 'row' },
        h('button', { class: 'btn ghost', onClick: () => { if (grownUp(app)) exportSave(app, false); } }, '💾 Export progress'),
        app.store.players().length > 1
          ? h('button', { class: 'btn ghost', onClick: () => { if (grownUp(app)) exportSave(app, true); } }, '💾 Export everyone')
          : null,
        importButton(app),
      ),
    ),
    h('button', { class: 'btn danger', onClick: () => { if (grownUp(app) && confirm(`Erase ${app.store.data.name}’s progress? Other players on this device are not affected.`)) { app.store.reset(); app.go('welcome'); } } }, 'Erase progress'),
    h('p', { class: 'hint' }, 'Catakana · works offline · made with 🐾'),
    h('p', { class: 'hint' }, 'Stroke order data from KanjiVG © Ulrich Apel (CC BY-SA 3.0).'),
  );
  return { el };
}

/** Each child (or grown-up) gets their own cat and progress on a shared device. */
function playersSection(app: App): HTMLElement {
  const store = app.store;
  const rows0 = store.players();
  const rows = rows0.map((p) =>
    h(
      'div',
      { class: 'row' },
      h('span', null, `🐱 ${p.name}${p.active ? ' ✔' : ''}`),
      p.active
        ? null
        : h('button', { class: 'btn ghost small', onClick: () => { store.switchPlayer(p.id); app.go(store.data.started ? 'map' : 'welcome'); } }, 'Play as'),
      rows0.length > 1
        ? h('button', { class: 'btn ghost small', onClick: () => removePlayer(app, p.id, p.name, p.active) }, 'Remove')
        : null,
    ),
  );
  return h(
    'div',
    { class: 'setting col' },
    h('strong', null, 'Players'),
    h('small', null, 'Everyone on this device gets their own cat and progress. Backups and erasing apply to the cat who is playing now.'),
    ...rows,
    h('button', { class: 'btn ghost small', onClick: () => { if (!grownUp(app)) return; if (store.addPlayer()) app.go('welcome'); else alert('This device already has the most players it can hold.'); } }, '➕ Add a player'),
  );
}

function removePlayer(app: App, id: string, name: string, active: boolean): void {
  if (!grownUp(app)) return;
  if (!confirm(`Remove ${name} and all of their progress? This cannot be undone.`)) return;
  if (!app.store.removePlayer(id)) return;
  if (active) app.go(app.store.data.started ? 'map' : 'welcome');
  else app.render();
}

function exportSave(app: App, everyone: boolean): void {
  const json = everyone ? app.store.exportAllJson() : app.store.exportJson();
  if (json === null) return alert('Some progress on this device could not be read, so no backup was made.');
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `catakana-${everyone ? 'everyone-' : ''}${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importSave(app: App, e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  // clear the picker so choosing the same file again (after a failed check or a cancel) still fires `change`
  input.value = '';
  if (!file || !grownUp(app)) return;
  const text = await file.text();
  if (Store.isAllBackup(text)) {
    if (!confirm('Add the players in this backup to this device? Nobody already here is changed.')) return;
    const n = app.store.importAllJson(text);
    if (n > 0) {
      alert(`Added ${n} player${n === 1 ? '' : 's'}.`);
      app.render();
    } else alert('Nothing was added. The file may not be a Catakana backup, this device may already have the most players it can hold, or it may be out of space.');
    return;
  }
  if (!confirm('Replace the progress on this device with this backup?')) return;
  if (app.store.importJson(text)) app.go('map');
  else alert('That file is not a Catakana backup.');
}

/** A real (keyboard-focusable) button that opens a hidden file picker. */
function importButton(app: App): HTMLElement {
  const input = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onChange: (e: Event) => void importSave(app, e) });
  return h('span', null, h('button', { class: 'btn ghost', onClick: () => input.click() }, '📂 Import'), input);
}
