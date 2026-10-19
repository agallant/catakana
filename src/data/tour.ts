import { N5_CONTENT, type N5StopContent } from './n5';
import { N4_CONTENT } from './n4';
import { N3_CONTENT } from './n3';
import { N2_CONTENT } from './n2';
import { N1_CONTENT } from './n1';
import type { Tier } from './vocab';

export type TourContent = N5StopContent;

/** Grammar, vocabulary and sentences for every post-kana stop, with the tier each belongs to. */
export const TOUR: { tier: Tier; content: Record<string, TourContent> }[] = [
  { tier: 'N5', content: N5_CONTENT },
  { tier: 'N4', content: N4_CONTENT },
  { tier: 'N3', content: N3_CONTENT },
  { tier: 'N2', content: N2_CONTENT },
  { tier: 'N1', content: N1_CONTENT },
];

export const TOUR_CONTENT: Record<string, TourContent> = Object.assign({}, ...TOUR.map((t) => t.content));
