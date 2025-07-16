import type { Dimensions } from './dimensions';
import type IGame from './abstract-game';
import type { Position } from './position';

export abstract class GameObject {
  dimensions: Dimensions;
  position: Position;
  game: IGame;

  /**
   *
   */
  constructor(dimensions: Dimensions, position: Position, game: IGame) {
    this.dimensions = dimensions;
    this.position = position;
    this.game = game;
  }

  abstract update(inputs?: string[]): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
