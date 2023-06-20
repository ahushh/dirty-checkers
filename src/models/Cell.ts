import { Coordinates, TCoordinates } from './Coordinates';
import { Figure } from './Figure';

export const CELL_COLORS = {
  White: 'White' as const,
  Black: 'Black' as const,
}

export type TCellColor = keyof typeof CELL_COLORS

export class Cell {
  color: TCellColor;
  x: number;
  y: number;
  figure: Figure | undefined;
  
  constructor(public coordinates: TCoordinates, public size: number) {
    if ((coordinates.x + 1) % 2) {
      this.color = (coordinates.y + 1) % 2 ? CELL_COLORS.White : CELL_COLORS.Black;
    } else {
      this.color = (coordinates.y + 1) % 2 ? CELL_COLORS.Black : CELL_COLORS.White;
    }
    this.x = coordinates.x;
    this.y = coordinates.y;
  }
  get friendlyCoordinates() {
    return Coordinates.getFriendlyCoordinates({ x: this.coordinates.x, y: this.coordinates.y })
  }
}
