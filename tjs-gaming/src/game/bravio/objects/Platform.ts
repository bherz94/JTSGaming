import { GameObject } from '../../abstract-game-object';
import type { Dimensions } from '../../dimensions';
import type { Position } from '../../position';
import type BravioGame from '../bravio-game';

export default class Platform extends GameObject {
  constructor(dimensions: Dimensions, position: Position, game: BravioGame) {
    super(dimensions, position, game);
  }

  update(inputs?: string[]): void {
    return;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'blue';
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );
  }
}
