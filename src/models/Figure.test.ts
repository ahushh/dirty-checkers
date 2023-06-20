import { expect, test } from 'vitest'
import { FIGURE_COLORS, Figure } from './Figure';
import { Coordinates } from './Coordinates';

test('Figure constructor works with coordinates as arguments', async () => {
  const f = new Figure(0, 0, FIGURE_COLORS.White)
  expect(f.coordinates).toEqual({ x: 0, y: 0})
});

test('Figure constructor works with TCoordinates', async () => {
  const f = new Figure({ x: 0, y: 0 }, FIGURE_COLORS.White)
  expect(f.coordinates).toEqual({ x: 0, y: 0 })
});

test('Figure constructor works with TFriendlyCoordinates', async () => {
  const f = new Figure('e4', FIGURE_COLORS.White)
  expect(f.coordinates).toEqual({ x:4, y: 4 })
});

test('Figure coordinates setter', async () => {
  const f = new Figure('e4', FIGURE_COLORS.White);
  f.coordinates = { x: 0, y: 0};
  expect(f.coordinates).toEqual({ x: 0, y: 0 })
})

test('Figure constructor throws an error in case of bad arguments', async () => {
  expect(() => new (Figure as any)('e4')).toThrowError(/Wrong number/)
  expect(() => new (Figure as any)({ x: 0, z: 0 }, FIGURE_COLORS.White)).toThrowError(/Wrong argument/)
  expect(() => new (Figure as any)(23, FIGURE_COLORS.White)).toThrowError(/Wrong argument/)
  expect(() => new (Figure as any)({ }, FIGURE_COLORS.White)).toThrowError(/Wrong argument/)
})

test('Figure check board edge', async () => {
  const f = new Figure('e4', FIGURE_COLORS.White);
  expect((f as any).areCoordinatesWithinBoard({ x: 0, y: 0})).toEqual(true);
  expect((f as any).areCoordinatesWithinBoard({ x: 0, y: -1 })).toEqual(false);
  expect((f as any).areCoordinatesWithinBoard({ x: -1, y: -1 })).toEqual(false);
  expect((f as any).areCoordinatesWithinBoard({ x: 7, y: 7 })).toEqual(true);
  expect((f as any).areCoordinatesWithinBoard({ x: 7, y: 8 })).toEqual(false);
  expect((f as any).areCoordinatesWithinBoard({ x: 8, y: 7 })).toEqual(false);
  expect((f as any).areCoordinatesWithinBoard({ x: -1, y: 8 })).toEqual(false);
})

test('Figure oppositeColor', () => {
  let f = new Figure('e4', FIGURE_COLORS.White);
  expect(f.oppositeColor).toEqual(FIGURE_COLORS.Black);
  f = new Figure('e4', FIGURE_COLORS.Black);
  expect(f.oppositeColor).toEqual(FIGURE_COLORS.White);
})

test('Figure cant move to the same cell', () => {
  const f = new Figure(3, 3, FIGURE_COLORS.White);
  expect(f.canMove({ x: 3, y: 3 })).toEqual(false);
  expect(f.canMove({ x: 2, y: 2 })).toEqual(true);
});

test('Upgrade to dame', () => {
  const white = () => {
    const { x, y } = Coordinates.fromFriendlyCoordinates('b8');
    const f = new Figure(x, y, FIGURE_COLORS.White);
    f.upgradeToDameIfNeeded()
    expect(f.isDame).toEqual(true)
  };
  const black = () => {
    const { x, y } = Coordinates.fromFriendlyCoordinates('a1');
    const f = new Figure(x, y, FIGURE_COLORS.Black);
    f.upgradeToDameIfNeeded()
    expect(f.isDame).toEqual(true)
  }
  white();
  black();
})