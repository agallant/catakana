import type { GameDef } from './types';
import { sushiGame } from './sushi';
import { pairsGame } from './pairs';
import { traceGame } from './trace';
import { listenGame } from './listen';
import { yarnGame } from './yarn';
import { typingGame } from './typing';
import { stationGame } from './station';

export const GAMES: GameDef[] = [sushiGame, pairsGame, traceGame, listenGame, yarnGame, typingGame, stationGame];
export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));
