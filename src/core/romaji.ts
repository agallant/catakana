import type { SaveData } from './store';

/**
 * Romaji is training wheels: shown as hints only for the first few stops (and only if enabled).
 * After that, prompts rely on kana, meaning (English/emoji) and sound.
 */
export const ROMAJI_FADE_STOP = 6;

export function romajiHints(save: Pick<SaveData, 'settings'>, stopIndex: number): boolean {
  return save.settings.romaji && stopIndex < ROMAJI_FADE_STOP;
}
