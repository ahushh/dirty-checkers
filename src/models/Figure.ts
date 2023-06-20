import { CELL_COLORS, TCellColor } from './Cell';
import { Coordinates, TCoordinates, TFriendlyCoordinates } from './Coordinates';

export const FIGURE_COLORS = CELL_COLORS;
export type TFigureColor = TCellColor

export class Figure {
  size = 8;
  isDame = false;
  alive = true;
  x: number;
  y: number;
  color: TFigureColor;
  _id?: string;

  set id(id: string) {
    this._id = `${this.color}${id}`;
  }
  get id() {
    return this._id as string;
  }
  get friendlyCoordinates() {
    return Coordinates.getFriendlyCoordinates(this.coordinates)
  }

  get coordinates() {
    return { x: this.x, y: this.y };
  }
  set coordinates(coordinates: TCoordinates) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  constructor(friendlyCoordinates: TFriendlyCoordinates, color: TFigureColor);
  constructor(coordinates: TCoordinates, color: TFigureColor);
  constructor(x: number, y: number, color: TFigureColor);

  constructor(...args: unknown[]) {
    if (args.length === 3) {
      this.x = args[0] as number;
      this.y = args[1] as number;
      this.color = args[2] as TFigureColor;
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        const { x, y } = Coordinates.fromFriendlyCoordinates(args[0] as TFriendlyCoordinates);
        this.x = x;
        this.y = y;
        this.color = args[1] as TFigureColor;
      } else if (typeof args[0] === 'object' && !isNaN((args[0] as TCoordinates).x) && !isNaN((args[0] as TCoordinates).y)) {
        this.x = (args[0] as TCoordinates).x;
        this.y = (args[0] as TCoordinates).y;
        this.color = args[1] as TFigureColor;
      } else {
        throw new Error('Wrong argument type')
      }
    } else {
      throw new Error('Wrong number of arguments.');
    }
  }

  canMove(to: TCoordinates): boolean {
    return Boolean(this.possibleMoves.find(({ x, y }) => x === to.x && y === to.y)) && this.coordinates !== to;
  }

  upgradeToDameIfNeeded() {
    if ((this.color === FIGURE_COLORS.White && this.coordinates.y === 0) || this.color === FIGURE_COLORS.Black && this.coordinates.y === this.size - 1) {
      this.isDame = true;
    }
  }

  get possibleJumpDirections() {
    return [this.getUpperLeft, this.getUpperRight, this.getLowerLeft, this.getLowerRight];
  }
  get possibleJumps(): TCoordinates[] {
    if (!this.isDame) {
      return this.possibleJumpDirections
        .map(fn => fn(this.coordinates))
        .filter(this.areCoordinatesWithinBoard);
    }
    // TODO: doesn't work correcly
    const result = [];
    for (const fn of this.possibleJumpDirections) {
      let coordinates = fn(this.coordinates);
      while (this.areCoordinatesWithinBoard(coordinates)) {
        result.push(coordinates);
        coordinates = fn(coordinates);
      }
    }
    return result;
  }

  get possibleMoveDirections() {
    if (this.isDame) {
      return [this.getUpperLeft, this.getUpperRight, this.getLowerLeft, this.getLowerRight];
    }
    if (this.color === FIGURE_COLORS.Black) {
      return [this.getLowerLeft, this.getLowerRight];
    }
    return [this.getUpperLeft, this.getUpperRight];
  }
  get possibleMoves(): TCoordinates[] {
    if (!this.isDame) {
      return this.possibleMoveDirections
        .map(fn => fn(this.coordinates))
        .filter(this.areCoordinatesWithinBoard);
    }
    const result = [];
    for (const fn of this.possibleMoveDirections) {
      let coordinates = fn(this.coordinates);
      while (this.areCoordinatesWithinBoard(coordinates)) {
        result.push(coordinates);
        coordinates = fn(coordinates);
      }
    }
    return result;
  }

  get oppositeColor() {
    return this.color === FIGURE_COLORS.White ? FIGURE_COLORS.Black : FIGURE_COLORS.White;
  }
  private areCoordinatesWithinBoard = (to: TCoordinates): boolean => {
    if (to.x < 0 || to.x > this.size - 1 || to.y < 0 || to.y > this.size - 1) {
      return false;
    }
    return true;
  }
  private getUpperLeft({ x, y }: TCoordinates) { return { x: x - 1, y: y - 1 } }
  private getUpperRight({ x, y }: TCoordinates) { return { x: x + 1, y: y - 1 } }
  private getLowerLeft({ x, y }: TCoordinates) { return { x: x - 1, y: y + 1 } }
  private getLowerRight({ x, y }: TCoordinates) { return { x: x + 1, y: y + 1 } }

}