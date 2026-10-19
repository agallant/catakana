import type { GameDef } from './types';
import { sushiGame } from './sushi';
import { pairsGame } from './pairs';
import { traceGame } from './trace';
import { listenGame } from './listen';
import { yarnGame } from './yarn';
import { typingGame } from './typing';
import { stationGame } from './station';
import { trainGame } from './train';
import { cafeGame } from './cafe';
import { shadowGame } from './shadow';
import { kitchenGame } from './kitchen';
import { storyGame } from './story';

export const GAMES: GameDef[] = [sushiGame, pairsGame, traceGame, listenGame, yarnGame, typingGame, stationGame, trainGame, cafeGame, shadowGame, kitchenGame, storyGame];
export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));
