import { expect, test } from 'vitest'
import { FIGURE_COLORS, Figure } from './Figure';
import { Coordinates } from './Coordinates';
import { Game } from './Game';

test.skip('Game to state', async () => {
  const game = new Game();
  game.start();
  const state = game.toState();
  console.log(state)
  expect(state).toEqual(false)
});

