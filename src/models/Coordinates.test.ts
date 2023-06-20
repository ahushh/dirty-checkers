import { assert, expect, test } from 'vitest'
import { Board } from './Board'
import { Coordinates } from './Coordinates'

test('Coordinates.getFriendlyCoordinates works with Cell and cell coordinates', async () => {
  const board = new Board()
  let cell = board.cells[0][0]
  expect(Coordinates.getFriendlyCoordinates(cell)).toEqual('a8');
  expect(Coordinates.getFriendlyCoordinates(cell.coordinates)).toEqual('a8');
  cell = board.cells[4][4]
  expect(Coordinates.getFriendlyCoordinates(cell)).toEqual('e4');
  expect(Coordinates.getFriendlyCoordinates(cell.coordinates)).toEqual('e4');

  expect(Coordinates.getFriendlyCoordinates({ x: 3, y: 2 })).toEqual('d6');
  expect(Coordinates.getFriendlyCoordinates({ x: 1, y: 2 })).toEqual('b6');
}); 

test('Coordinates.getFriendlyCoordinates throws with invalid coordinates', async () => {
  expect(() => Coordinates.getFriendlyCoordinates({ z: 1, c: 2} as any)).toThrowError(/Wrong argument/)
})

test('Coordinates.fromFriendlyCoordinates', async () => {
  expect(Coordinates.fromFriendlyCoordinates('a8')).toEqual({ x: 0, y: 0});
  expect(Coordinates.fromFriendlyCoordinates('e4')).toEqual({ x: 4, y: 4 });
  expect(Coordinates.fromFriendlyCoordinates('b6')).toEqual({ x: 1, y: 2 });
  expect(Coordinates.fromFriendlyCoordinates('d6')).toEqual({ x: 3, y: 2 });
});

test('Coordinates.getFriendlyCoordinates and fromFriendlyCoordinates matches', async () => {
  const c = Coordinates.fromFriendlyCoordinates('b4');
  expect(Coordinates.getFriendlyCoordinates(c)).toEqual('b4');
})

test('Coordinates.contains', async () => {
  let a = [] as any;
  let c = { x: 1, y: 2};
  expect(Coordinates.contains(a, c)).toEqual(false)
  c = { lol: 'kek', ubek: 2 } as any;
  expect(Coordinates.contains(a, c)).toEqual(false)
  a = [{ x: 2, y: 2}];
  c = { x: 1, y: 2 };
  expect(Coordinates.contains(a, c)).toEqual(false)
  a = [{ x: 2, y: 2 }];
  c = { x: 2, y: 2 };
  expect(Coordinates.contains(a, c)).toEqual(true)
});

test('Coordinates.tostring', async () => {
  expect(Coordinates.toString({ x: 0, y: 0})).toEqual('x=0;y=0')
})