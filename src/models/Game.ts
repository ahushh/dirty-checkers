import { IHistory } from '../components/MovesHistory';
import { Board } from './Board';
import { Coordinates, TFriendlyCoordinates } from './Coordinates';
import { FIGURE_COLORS, Figure, TFigureColor } from './Figure';


export type GameState = any;

export class Game {
  board: Board;
  // if set to true, rotate the board and swipe colors pretending to be black
  isClient?: boolean;
  player?: TFigureColor;
  constructor() {
    this.board = new Board()
  }
  isStarted = true;
  turn: TFigureColor = FIGURE_COLORS.White;

  start() {
    this.isStarted = true;
    this.board = new Board()
    this.turn = FIGURE_COLORS.White;
    this.history = {
      White: [],
      Black: [],
    }
  }

  history: IHistory = {
    White: [] as any[],
    Black: [] as any[],
  }
  isOver() {
    if (this.board.black_figures.filter(f => f.alive).length === 0) {
      return FIGURE_COLORS.White
    }
    if (this.board.white_figures.filter(f => f.alive).length === 0) {
      return FIGURE_COLORS.Black
    }
    return false
  }

  nextTurn() {
    if (this.turn === FIGURE_COLORS.Black) {
      this.turn = FIGURE_COLORS.White;
    } else {
      this.turn = FIGURE_COLORS.Black;
    }
  }

  toState() {
    const board = new Array(this.board.size).fill(0).map((_, i) => new Array(this.board.size).fill(0));
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.size; j++) {
        const f = this.board.cells[i][j].figure;
        const cell = {
          color: this.board.cells[i][j].color,
          x: this.board.cells[i][j].x,
          y: this.board.cells[i][j].y,
          fc: this.board.cells[i][j].friendlyCoordinates,
        }
        if (f?.alive) {
          const figure = { id: f.id, color: f.color, x: f.x, y: f.y, fc: f.friendlyCoordinates, isDame: f.isDame };
          board[j][i] = { cell, figure }
        } else {
          board[j][i] = { cell }
        }
      }
    }
    const fs = this.turn === FIGURE_COLORS.Black ? this.board.black_figures : this.board.white_figures;
    const figuresMustJump = fs
      .filter(figure => this.board.getAvailableJumps(figure).length && figure.alive)
      .map(figure => {
        return figure.friendlyCoordinates
      })
    const reversedBoard = false; // this.player === FIGURE_COLORS.Black;
    return {
      board: board, // reversedBoard ? board.reverse() : board,
      figures: {
        [FIGURE_COLORS.White]: this.board.white_figures.map(figure => figure.friendlyCoordinates),
        [FIGURE_COLORS.Black]: this.board.black_figures.map(figure => figure.friendlyCoordinates),
      },
      turn: this.turn,
      dames: [
        ...this.board.white_figures.filter(figure => figure.isDame && figure.alive).map(figure => figure.friendlyCoordinates),
        ...this.board.black_figures.filter(figure => figure.isDame && figure.alive).map(figure => figure.friendlyCoordinates)
      ],
      figuresMustJump,
      hitstory: this.history,
      reversedBoard,
      isStarted: this.isStarted
    }
  }

  move(figureCoordinates: TFriendlyCoordinates, to: TFriendlyCoordinates) {
    const { x, y } = Coordinates.fromFriendlyCoordinates(figureCoordinates);
    const figure = this.board.cells[x][y].figure;
    const { isJump, newCoordinates } = this.board.moveOrJump(figure as Figure, Coordinates.fromFriendlyCoordinates(to));
    const hRecord = {
      from: figureCoordinates,
      to: Coordinates.getFriendlyCoordinates(newCoordinates),
      time: new Date(),
    }
    this.history[this.turn].push(hRecord);
    return { isJump, newCoordinates: Coordinates.getFriendlyCoordinates(newCoordinates) }
  }
  getMoves(figureCoordinates: TFriendlyCoordinates) {
    const { x, y } = Coordinates.fromFriendlyCoordinates(figureCoordinates);
    const figure = this.board.cells[x][y].figure;
    if (figure) {
      return this.board.getAvailableMoves(figure).map(c => Coordinates.getFriendlyCoordinates(c));
    }
    return []
  }
  getJumps(figureCoordinates: TFriendlyCoordinates) {
    const { x, y } = Coordinates.fromFriendlyCoordinates(figureCoordinates);
    const figure = this.board.cells[x][y].figure;
    if (figure) {
      return this.board.getAvailableJumps(figure).map(c => Coordinates.getFriendlyCoordinates(c));
    }
    return []
  }
}