import type { Store } from '../core/store';
import type { Stop } from '../data/journey';
import type { Script } from '../data/kana';

export interface Item {
  id: string;
  kind: 'kana' | 'word';
  text: string; // as written in the lesson
  reading: string; // kana reading
  romaji: string;
  en?: string;
  emoji?: string;
  script?: Script;
}

export type Level = 1 | 2 | 3;

export interface GameContext {
  root: HTMLElement;
  store: Store;
  stop: Stop;
  stopIndex: number;
  level: Level;
  /** Show romaji training-wheel hints (only very early in the journey). */
  hints: boolean;
  /** Items eligible for this session (already includes review of earlier stops). */
  pool: Item[];
  /** Items first taught at this stop (preferred for drills). */
  focus: Item[];
  /** Ends the session and shows results. */
  finish(summary: Summary): void;
  /** Leave without results. */
  quit(): void;
}

export interface Summary {
  correct: number;
  total: number;
}

export interface GameDef {
  id: string;
  name: string;
  jp: string;
  emoji: string;
  blurb: string;
  /** which item kinds this game can use */
  kinds: ('kana' | 'word')[];
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  /** Return true if the game can run with this context (e.g. TTS available). */
  available?(stopIndex?: number): boolean;
  start(ctx: GameContext): void;
}
