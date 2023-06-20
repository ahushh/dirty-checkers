import { Cell } from './Cell';

export type TCoordinates = { x: number; y: number }
export type TFriendlyCoordinates =
  'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 
  'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
  'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
  'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
  'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
  'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
  'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
  'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

export class Coordinates {
  static yAxis = [...new Array(8)].map((_, i) => i + 1).reverse();
  static xAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  /***
 * User-Friendly representation of coordinates e.g. a4, b3 and so on.
 */
  static getFriendlyCoordinates({ x, y }: TCoordinates): TFriendlyCoordinates;
  static getFriendlyCoordinates(cell: Cell): TFriendlyCoordinates;
  static getFriendlyCoordinates(arg: unknown): TFriendlyCoordinates {
    let _x, _y;
    if ((arg as Cell) instanceof Cell) {
      const coords = (arg as Cell).coordinates;
      _x = coords.x;
      _y = coords.y;
    } else if (typeof arg === 'object' && !isNaN((arg as TCoordinates).x) && !isNaN((arg as TCoordinates).y)) {
      _x = (arg as TCoordinates).x;
      _y = (arg as TCoordinates).y;
    } else {
      throw new Error('Wrong argument')
    }
    const x = Coordinates.xAxis[_x];
    const y = Coordinates.yAxis[_y];
    return `${x}${y}` as TFriendlyCoordinates;
  }           

  static fromFriendlyCoordinates(coordinates: TFriendlyCoordinates): TCoordinates {
    const [_x, _y] = coordinates.split('');
    const x = Coordinates.xAxis.findIndex((_) => _ === _x);
    const y = Coordinates.yAxis.findIndex((_) => _ === Number(_y));

    return { x, y };
  }

  static contains(setOfCoordinates: TCoordinates[], coordinates: TCoordinates) {
    return Boolean(setOfCoordinates.find(({ x, y }) => coordinates.x === x && coordinates.y === y))
  }

  static toString(coordinates: TCoordinates) {
    return `x=${coordinates.x};y=${coordinates.y}`;
  }

  static getNext(from: TCoordinates, to: TCoordinates) {
    const x = to.x - from.x < 0 ? -1 : 1;
    const y = to.y - from.y < 0 ? -1 : 1;
    return { x: to.x + x, y: to.y + y };
  }
}