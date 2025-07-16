import type Game from './game/abstract-game';
import InputHandler from './game/input-handler';
import { SnakeGame } from './game/snake/snake-game';

class Main {
  game: Game;
  input: InputHandler;
  canvas: HTMLCanvasElement;

  

  constructor(game: Game, input: InputHandler, canvas: HTMLCanvasElement) {
    this.game = game;
    this.input = input;
    this.canvas = canvas;
  }

  selectGame = (game: Game) => {
    this.game = game;
    this.startGame();
  }

  startGame = () => {
    this.game.animate();
  };

  drawMenuScreen = (ctx: CanvasRenderingContext2D) => {
    const {x, y} = this.game.boardSize();
    ctx.clearRect(0, 0, x.max, y.max);


  }
}

var main;

window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

  if (!canvas) return;

  canvas.width = 500;
  canvas.height = 540;

  const input = new InputHandler();
  const game = new SnakeGame(500, 500, 40, canvas, input);
  main = new Main(game, input, canvas);

  main.startGame();
});
