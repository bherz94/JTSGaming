import type Game from './game/abstract-game';
import { AssetLoader } from './game/asset-loader';
import BravioGame from './game/bravio/bravio-game';
import type { Button } from './game/button';
import InputHandler from './game/input-handler';

class Main {
  game: Game;
  input: InputHandler;
  canvas: HTMLCanvasElement;
  assetLoader: AssetLoader;

  buttons: Button[] = [
    {
      x: 0, // Will be calculated dynamically
      y: 0, // Will be calculated dynamically
      width: 90,
      height: 40,
      text: 'Snake',
      borderColor: '#ff0000ff',
      hoverColor: '#ff4141ff',
      isHovered: false,
    },
    {
      x: 0, // Will be calculated dynamically
      y: 0, // Will be calculated dynamically
      width: 90,
      height: 40,
      text: 'Bravio',
      borderColor: '#ff0000ff',
      hoverColor: '#ff4141ff',
      isHovered: false,
    },
  ];

  constructor(
    game: Game,
    input: InputHandler,
    canvas: HTMLCanvasElement,
    assetLoader: AssetLoader
  ) {
    this.game = game;
    this.input = input;
    this.canvas = canvas;
    this.assetLoader = assetLoader;

    // this.canvas.style = 'visibility: hidden';
  }

  selectGame = (game: Game) => {
    this.game = game;
  };

  startGame = () => {
    this.game.animate();
  };

  drawMenuScreen = (ctx: CanvasRenderingContext2D) => {
    const box = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, box.width, box.height);
  };
}

var main;

window.addEventListener('load', async () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

  if (!canvas) return;

  canvas.width = 500;
  canvas.height = 540;

  const input = new InputHandler();
  const assetLoader = new AssetLoader();
  // const game = new SnakeGame(500, 500, 40, canvas, input);
  const game = new BravioGame(
    { width: 500, height: 500 },
    40,
    canvas,
    input,
    assetLoader
  );
  await game.loadAssets();
  main = new Main(game, input, canvas, assetLoader);
  main.game.animate();
});
