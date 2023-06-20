import { Cell } from './Cell';
import { Coordinates, TCoordinates } from './Coordinates';
import { FIGURE_COLORS, Figure, TFigureColor } from './Figure';

export class Board {
  size = 8
  cells: Cell[][] = []

  white_figures: Figure[] = [];
  black_figures: Figure[] = [];

  private createCells() {
    for (let i = 0; i <= this.size; i++) {
      this.cells[i] = []
      for (let j = 0; j <= this.size; j++) {
        this.cells[i][j] = new Cell({ x: i, y: j }, this.size)
      }
    }
  }

  placeFiguresTest() {
    {
      const f = new Figure(0, 5, FIGURE_COLORS.Black);
      f.id = `0`;
      f.isDame = true;
      this.black_figures.push(f);
      this.cells[0][5].figure = f;
    }
    {
      const f = new Figure(1, 2, FIGURE_COLORS.White);
      f.isDame = true;
      f.id = `0`;
      this.white_figures.push(f);
      this.cells[1][2].figure = f;
    }
    {
      const f = new Figure(5, 6, FIGURE_COLORS.Black);
      f.id = `0`;
      f.isDame = true;
      this.black_figures.push(f);
      this.cells[5][6].figure = f;
    }
    {
      const f = new Figure(3, 4, FIGURE_COLORS.White);
      f.isDame = true;
      f.id = `0`;
      this.white_figures.push(f);
      this.cells[3][4].figure = f;
    }
  }

  private placeFigures() {
    let id = 0;
    for (let j = 0; j <= 2; j++) {
      for (let i = (j + 1) % 2 ? 1 : 0; i < this.size; i += 2) {
        const f = new Figure(i, j, FIGURE_COLORS.Black);
        f.id = `${id++}`;
        this.black_figures.push(f)
        this.cells[i][j].figure = f;
      }
    }

    id = 0;
    for (let j = 5; j < 8; j++) {
      for (let i = (j + 1) % 2 ? 1 : 0; i < this.size; i += 2) {
        const f = new Figure(i, j, FIGURE_COLORS.White);
        f.id = `${id++}`;
        this.white_figures.push(f);
        this.cells[i][j].figure = f;
      }
    }
  }

  constructor() {
    this.createCells();
    this.placeFigures();
  }

  private beat(coordinates: TCoordinates) {
    const figureToBeat = this.cells[coordinates.x][coordinates.y].figure;
    if (!figureToBeat) {
      throw new Error(`Figure to beat is not found at ${Coordinates.toString(coordinates)}`)
    }
    figureToBeat.alive = false;
    this.cells[figureToBeat.coordinates.x][figureToBeat.coordinates.y].figure = undefined;
  }

  private updateCoordinates(figure: Figure, to: TCoordinates) {
    this.cells[figure.coordinates.x][figure.coordinates.y].figure = undefined;
    this.cells[to.x][to.y].figure = figure;

    figure.coordinates = to;
  }

  private areCoordinatesWithinBoard = (to: TCoordinates): boolean => {
    if (to.x < 0 || to.x > this.size - 1 || to.y < 0 || to.y > this.size - 1) {
      return false;
    }
    return true;
  }

  private canJump(figure: Figure, figureToJump: TCoordinates): boolean {
    return this.getAvailableJumps(figure).some(({ x, y}) => x === figureToJump.x && y === figureToJump.y);
  }
  private canMove(figure: Figure, to: TCoordinates): boolean {
    return figure.canMove(to) && this.cells[to.x][to.y].figure === undefined;
  }

  getAvailableMoves(figure: Figure): TCoordinates[] {
    return figure.possibleMoves.filter(({ x, y }) => this.cells[x][y].figure === undefined);
  }

  getAvailableJumps(figure: Figure): TCoordinates[] {
    if (!figure.isDame) {
      return figure.possibleJumpDirections
        .map(fn => fn(figure.coordinates))
        .filter(this.areCoordinatesWithinBoard)
        .filter(({ x, y }) => this.cells[x][y].figure?.color === figure.oppositeColor)
        .filter(({ x, y }) => {
          const nextCoord = Coordinates.getNext(figure.coordinates, { x, y });
          if (!this.areCoordinatesWithinBoard(nextCoord)) {
            return false;
          }
          return this.cells[nextCoord.x][nextCoord.y].figure === undefined;
        });
    }
    const result = [];
    for (const fn of figure.possibleJumpDirections) {
      let coordinates = fn(figure.coordinates);
      let directionResult = []
      while (this.areCoordinatesWithinBoard(coordinates)) {
        directionResult.push(coordinates);
        coordinates = fn(coordinates);
      }
      directionResult = directionResult.filter(({ x, y }) => this.cells[x][y].figure?.color === figure.oppositeColor)
        .filter(({ x, y }) => {
          const nextCoord = Coordinates.getNext(figure.coordinates, { x, y });
          if (!this.areCoordinatesWithinBoard(nextCoord)) {
            return false;
          }
          return this.cells[nextCoord.x][nextCoord.y].figure === undefined;
        })
      if (directionResult.length) {
        result.push(directionResult[0])
      }
    }
    return result
  }

  moveOrJump(figure: Figure, to: TCoordinates): { isJump: boolean; newCoordinates: TCoordinates } {
    const jumps = this.getAvailableJumps(figure);
    if (this.canJump(figure, to)) {
      this.beat(to);
      this.updateCoordinates(figure, Coordinates.getNext(figure.coordinates, to));
      figure.upgradeToDameIfNeeded();
      return { isJump: true, newCoordinates: figure.coordinates };
    } else if (this.canMove(figure, to) && !jumps.length) {
      this.updateCoordinates(figure, to);
      figure.upgradeToDameIfNeeded();
      return { isJump: false, newCoordinates: to };
    }
    throw new Error('Illegal move')
  }


}