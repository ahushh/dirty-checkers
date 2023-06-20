import { expect, test } from 'vitest'
import { Board } from './Board'
import { CELL_COLORS } from './Cell'
import { Coordinates, TFriendlyCoordinates } from './Coordinates';

test('Board cells have correct colors', async () => {
  const board = new Board()
  const whites: TFriendlyCoordinates[] = [
    'a8', 'c8', 'e8', 'g8',
    'b7', 'd7', 'f7', 'h7',
    'a6', 'c6', 'e6', 'g6',
    'b5', 'd5', 'f5', 'h5',
    'a4', 'c4', 'e4', 'g4',
    'b3', 'd3', 'f3', 'h3',
    'a2', 'c2', 'e2', 'g2',
    'b1', 'd1', 'f1', 'h1',
  ];
  const blackies: TFriendlyCoordinates[] = [
    'b8', 'd8', 'f8', 'h8',
    'a7', 'c7', 'e7', 'g7',
    'b6', 'd6', 'f6', 'h6',
    'a5', 'c5', 'e5', 'g5',
    'b4', 'd4', 'f4', 'h4',
    'a3', 'c3', 'e3', 'g3',
    'b2', 'd2', 'f2', 'h2',
    'a1', 'c1', 'e1', 'g1',
  ]
  for (const coordinates of whites) {
    const { x, y } = Coordinates.fromFriendlyCoordinates(coordinates as TFriendlyCoordinates);
    expect(board.cells[x][y].color).toEqual(CELL_COLORS.White)
  }

  for (const coordinates of blackies) {
    const { x, y } = Coordinates.fromFriendlyCoordinates(coordinates as TFriendlyCoordinates);
    expect(board.cells[x][y].color).toEqual(CELL_COLORS.Black)
  }
});


test('Placing figures on the board works correctly', async () => {
  const board = new Board()
  const black_coords = [
    'b8', 'd8', 'f8', 'h8',
    'a7', 'c7', 'e7', 'g7',
    'b6', 'd6', 'f6', 'h6',
  ].map(c => Coordinates.fromFriendlyCoordinates(c as TFriendlyCoordinates))
  const white_coords = [
    'a3', 'c3', 'e3', 'g3',
    'b2', 'd2', 'f2', 'h2',
    'a1', 'c1', 'e1', 'g1'
  ].map(c => Coordinates.fromFriendlyCoordinates(c as TFriendlyCoordinates))
  const checkBlackCoordinates = ({ x, y }: { x: number; y: number; }): boolean => {
    return Boolean(black_coords.find(c => c.x === x && c.y === y))
  };
  const checkWhiteCoordinates = ({ x, y }: { x: number; y: number; }): boolean => {
    return Boolean(white_coords.find(c => c.x === x && c.y === y))
  }
  for (const figure of board.black_figures) {
    expect(figure.color).toEqual(CELL_COLORS.Black)
    expect(figure.coordinates).toSatisfy(checkBlackCoordinates)
  }
  for (const figure of board.white_figures) {
    expect(figure.color).toEqual(CELL_COLORS.White)
    expect(figure.coordinates).toSatisfy(checkWhiteCoordinates)
  }
  for (const coords of white_coords) {
    const f = board.cells[coords.x][coords.y].figure;
    expect(f?.color).toEqual(CELL_COLORS.White)
  }
  for (const coords of black_coords) {
    const f = board.cells[coords.x][coords.y].figure;
    expect(f?.color).toEqual(CELL_COLORS.Black)
  }
});

test('Board updateCoordinates', () => {
  const board = new Board();

  const coord = 'b6'
  const { x, y } = Coordinates.fromFriendlyCoordinates(coord);
  const f = board.cells[x][y].figure;

  const newCoord = 'a5';
  const { x: newX, y: newY } = Coordinates.fromFriendlyCoordinates(newCoord);

  (board as any).updateCoordinates(f, { x: newX, y: newY });
  expect(board.cells[x][y].figure).toEqual(undefined);
  expect(f?.coordinates).toEqual({ x: newX, y: newY });
})

test('Board beat', () => {
  const board = new Board();

  const coord = 'b6'
  const { x, y } = Coordinates.fromFriendlyCoordinates(coord);
  const f = board.cells[x][y].figure;

  (board as any).beat(f, { x, y });
  expect(board.cells[x][y].figure).toEqual(undefined);
  expect(board.cells[x][y].figure).toEqual(undefined);
})