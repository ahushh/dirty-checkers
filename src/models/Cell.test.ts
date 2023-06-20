import { assert, expect, test } from 'vitest'
import { Board } from './Board'
import { CELL_COLORS } from './Cell';

test('Cells on board have correct coordinates', async () => {
  const board = new Board()
  let cell = board.cells[0][0]
  expect(cell.coordinates).toEqual({ x: 0, y: 0 })
  cell = board.cells[0][1]
  expect(cell.coordinates).toEqual({ x: 0, y: 1 })
  cell = board.cells[0][2]
  expect(cell.coordinates).toEqual({ x: 0, y: 2})
  cell = board.cells[4][4]
  expect(cell.coordinates).toEqual({ x: 4, y: 4 })
});

test('Cells on board have correct colors', async () => {
  const board = new Board()
  let cell = board.cells[0][0]
  expect(cell.color).toEqual(CELL_COLORS.White)
  cell = board.cells[0][1]
  expect(cell.color).toEqual(CELL_COLORS.Black)
  cell = board.cells[0][2]
  expect(cell.color).toEqual(CELL_COLORS.White)
  cell = board.cells[4][4]
  expect(cell.color).toEqual(CELL_COLORS.White)
});