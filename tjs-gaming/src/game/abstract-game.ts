import type { Dimensions } from './dimensions';
import type InputHandler from './input-handler';

export type GameState = 'menu' | 'paused' | 'running' | 'game-over';

export default abstract class Game {
  dimensions: Dimensions;
  hudOffset: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputHandler;

  state: GameState = 'menu';

  constructor(
    dimensions: Dimensions,
    hudOffset: number,
    canvas: HTMLCanvasElement,
    input: InputHandler
  ) {
    this.dimensions = dimensions;
    this.hudOffset = hudOffset;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.input = input;
  }

  abstract update: () => void;
  abstract draw: () => void;
  abstract animate: () => void;
  abstract restart: () => void;
  boardSize() {
    return {
      x: { min: 0, max: this.dimensions.width },
      y: { min: this.hudOffset, max: this.dimensions.height + this.hudOffset },
    };
  }
}
