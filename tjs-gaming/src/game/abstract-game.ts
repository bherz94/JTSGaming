import type { AssetLoader } from './asset-loader';
import type { Dimensions } from './dimensions';
import type InputHandler from './input-handler';

export type GameState = 'menu' | 'paused' | 'running' | 'game-over';

export default abstract class Game {
  dimensions: Dimensions;
  hudOffset: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputHandler;
  assetLoader: AssetLoader;

  state: GameState = 'menu';

  frames: number = 0;
  fps: number = 60;
  msPrev: number;
  msPerFrame: number = 1000 / this.fps;

  startedAt: number;

  lastFpsUpdateTime = 0;
  fpsUpdateInterval = 1000;
  actualFps = 0;

  constructor(
    dimensions: Dimensions,
    hudOffset: number,
    canvas: HTMLCanvasElement,
    input: InputHandler,
    assetLoader: AssetLoader
  ) {
    this.dimensions = dimensions;
    this.hudOffset = hudOffset;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.input = input;
    this.assetLoader = assetLoader;

    this.startedAt = window.performance.now();
    this.msPrev = window.performance.now();
  }

  abstract update: () => void;
  abstract draw: () => void;
  abstract animate: () => void;
  abstract restart: () => void;
  abstract getPoints: () => number;
  boardSize() {
    return {
      x: { min: 0, max: this.dimensions.width },
      y: { min: this.hudOffset, max: this.dimensions.height + this.hudOffset },
    };
  }

  fpsLogic = (): boolean => {
    const msNow = window.performance.now();
    const msPassed = msNow - this.msPrev;

    if (msPassed < this.msPerFrame) return false;

    const excessTime = msPassed % this.msPerFrame;
    this.msPrev = msNow - excessTime;

    this.frames++;
    if (msNow - this.lastFpsUpdateTime >= this.fpsUpdateInterval) {
      this.actualFps = Math.round(
        this.frames / ((msNow - this.lastFpsUpdateTime) / 1000)
      );
      this.frames = 0;
      this.lastFpsUpdateTime = msNow;
    }

    return true;
  };

  drawHud = () => {
    const { x, y } = this.boardSize();

    this.ctx.clearRect(0, 0, x.max, y.max);

    this.ctx.fillStyle = 'red';
    this.ctx.font = '16px IBM Plex Mono';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(
      `${this.actualFps <= 0 ? '-' : this.actualFps} FPS`,
      5,
      20
    );
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${this.getPoints()} PTS`, x.max - 5, 20);
  };
}
