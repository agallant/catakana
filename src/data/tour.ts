import { N5_CONTENT, type N5StopContent } from './n5';
import { N4_CONTENT } from './n4';
import type { Tier } from './vocab';

export type TourContent = N5StopContent;

/** Grammar, vocabulary and sentences for every post-kana stop, with the tier each belongs to. */
export const TOUR: { tier: Tier; content: Record<string, TourContent> }[] = [
  { tier: 'N5', content: N5_CONTENT },
  { tier: 'N4', content: N4_CONTENT },
];

export const TOUR_CONTENT: Record<string, TourContent> = Object.assign({}, ...TOUR.map((t) => t.content));
