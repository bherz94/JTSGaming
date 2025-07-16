import type IGame from '../../abstract-game';
import { GameObject } from '../../abstract-game-object';

export class Fruit extends GameObject {
  constructor(game: IGame) {
    super({ width: 20, height: 20 }, { x: 80, y: 120 }, game);
  }

  update(inputs?: string[]): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(
      this.position.x - 1,
      this.position.y - 1,
      this.dimensions.width - 2,
      this.dimensions.height - 2
    );
  }

  nextPosition() {
    const { x, y } = this.game.boardSize();
    this.position = {
      x: this.getRandomInRange(x.min, x.max - this.dimensions.width),
      y: this.getRandomInRange(y.min, y.max - this.dimensions.height),
    };
  }

  getRandomInRange(min: number, max: number): number {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand % 20 !== 0 ? rand - (rand % 20) : rand;
  }
}
