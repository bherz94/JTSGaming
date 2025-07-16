import Game from '../abstract-game';
import type { GameObject } from '../abstract-game-object';
import type { Button } from '../button';
import type InputHandler from '../input-handler';
import { Fruit } from './objects/fruit';
import { Snake } from './objects/snake';

export class SnakeGame extends Game {
  objects: GameObject[];

  frames: number = 0;
  fps: number = 60;
  msPrev: number;
  msPerFrame: number = 1000 / this.fps;

  startedAt: number;

  lastFpsUpdateTime = 0;
  fpsUpdateInterval = 1000;
  actualFps = 0;

  snake: Snake;
  fruit: Fruit;
  tickCounter: number = 0;

  paused = false;

  restartButton: Button = {
    x: 0, // Will be calculated dynamically
    y: 0, // Will be calculated dynamically
    width: 90,
    height: 40,
    text: 'Restart',
    borderColor: '#ff0000ff',
    hoverColor: '#ff4141ff',
    isHovered: false,
  };

  menuButton: Button = {
    x: 0, // Will be calculated dynamically
    y: 0, // Will be calculated dynamically
    width: 90,
    height: 40,
    text: 'Menu',
    borderColor: '#ff0000ff',
    hoverColor: '#ff4141ff',
    isHovered: false,
  };

  acceptedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  constructor(
    width: number,
    height: number,
    hudOffset: number,
    canvas: HTMLCanvasElement,
    input: InputHandler
  ) {
    super({ width, height }, hudOffset, canvas, input);

    this.state = 'running';

    this.input.setAcceptedKeys(this.acceptedKeys);
    this.objects = [];

    this.startedAt = window.performance.now();
    this.msPrev = window.performance.now();

    this.snake = new Snake(this);

    this.fruit = new Fruit(this);
    this.objects.push(this.fruit);
  }

  restart = () => {
    // Event listener for mouse clicks on the canvas
    this.canvas.removeEventListener('click', this.handleClick);
    // Event listener for mouse movement on the canvas (for hover effect)
    this.canvas.removeEventListener('mousemove', this.handleMove);

    this.input.setAcceptedKeys(this.acceptedKeys);
    this.objects = [];

    this.startedAt = window.performance.now();
    this.msPrev = window.performance.now();

    this.snake = new Snake(this);

    this.fruit = new Fruit(this);
    this.objects.push(this.fruit);

    this.state = 'running';
  };

  update = () => {
    if (this.tickCounter >= 8) {
      this.snake.update(this.input.keys);
      // check if we collided with the fruit
      if (
        this.snake.position.x === this.fruit.position.x &&
        this.snake.position.y === this.fruit.position.y
      ) {
        this.fruit.nextPosition();
        this.snake.eat();
      }
      this.tickCounter = 0;
    } else {
      this.tickCounter++;
    }

    this.objects.forEach((o) => {
      o.update();
    });
  };

  draw = () => {
    const { x, y } = this.boardSize();

    this.ctx.clearRect(0, 0, x.max, y.max);

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x.min, y.min, x.max, y.max);

    this.ctx.fillStyle = 'red';
    this.ctx.font = '16px IBM Plex Mono';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      `${this.actualFps <= 0 ? '-' : this.actualFps} FPS`,
      5,
      20
    );
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${this.snake.getPoints()} PTS`, x.max - 5, 20);

    this.snake.draw(this.ctx);

    this.objects.forEach((o) => {
      o.draw(this.ctx);
    });

    // Set line color and width for the grid lines
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    // Draw horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.hudOffset);
    this.ctx.lineTo(x.max, this.hudOffset);
    this.ctx.stroke();
  };

  animate = () => {
    window.requestAnimationFrame(this.animate);

    const msNow = window.performance.now();
    const msPassed = msNow - this.msPrev;

    if (msPassed < this.msPerFrame) return;

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

    switch (this.state) {
      case 'menu':
      case 'paused':
      case 'running':
        this.update();
        this.draw();
        this.checkGameOver();
        break;
      case 'game-over':
        this.draw();
        this.drawGameOverOverlay();
        break;
    }
  };

  checkGameOver = () => {
    if (this.snake.isDead) this.state = 'game-over';

    // Event listener for mouse clicks on the canvas
    this.canvas.addEventListener('click', this.handleClick);

    // Event listener for mouse movement on the canvas (for hover effect)
    this.canvas.addEventListener('mousemove', this.handleMove);
  };

  drawGameOverOverlay = () => {
    const { x, y } = this.boardSize();

    this.ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
    this.ctx.fillRect(x.min, y.min, x.max, y.max);

    this.ctx.font = '48px IBM Plex Mono';
    this.ctx.textAlign = 'center';

    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`GAME OVER`, x.max / 2, y.max / 2 - 75);
    this.ctx.fillStyle = 'red';
    this.ctx.fillText(`GAME OVER`, x.max / 2 - 3, y.max / 2 - 77);

    this.ctx.font = '22px IBM Plex Mono';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      `Score: ${this.snake.getPoints()}`,
      x.max / 2,
      y.max / 2 - 42
    );
    this.ctx.fillStyle = 'red';
    this.ctx.fillText(
      `Score: ${this.snake.getPoints()}`,
      x.max / 2 - 2,
      y.max / 2 - 43
    );

    // Calculate restart button position to be centered
    this.restartButton.x = x.max / 2 - this.restartButton.width / 2;
    this.restartButton.y = y.max / 2 - this.restartButton.height / 2;

    // Draw the restart button border
    this.ctx.beginPath();
    this.ctx.rect(
      this.restartButton.x,
      this.restartButton.y + 5,
      this.restartButton.width,
      this.restartButton.height
    );
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.restartButton.isHovered
      ? this.restartButton.hoverColor
      : this.restartButton.borderColor;
    this.ctx.stroke();

    // Draw the restart text
    this.ctx.font = '16px IBM Plex Mono'; // Text color changes on hover
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      this.restartButton.text,
      this.restartButton.x + this.restartButton.width / 2,
      this.restartButton.y + this.restartButton.height / 2 + 5
    );
    this.ctx.fillStyle = this.restartButton.isHovered
      ? this.restartButton.hoverColor
      : this.restartButton.borderColor;
    this.ctx.fillText(
      this.restartButton.text,
      this.restartButton.x + this.restartButton.width / 2 - 1,
      this.restartButton.y + this.restartButton.height / 2 + 4
    );

    // Calculate menu button position to be centered
    this.menuButton.x = x.max / 2 - this.restartButton.width / 2;
    this.menuButton.y = y.max / 2 - this.restartButton.height / 2 + this.restartButton.height + 10;

    // Draw the menu button border
    this.ctx.beginPath();
    this.ctx.rect(
      this.menuButton.x,
      this.menuButton.y + 5,
      this.menuButton.width,
      this.menuButton.height
    );
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.menuButton.isHovered
      ? this.menuButton.hoverColor
      : this.menuButton.borderColor;
    this.ctx.stroke();

    // Draw the menu text
    this.ctx.font = '16px IBM Plex Mono'; // Text color changes on hover
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(
      this.menuButton.text,
      this.menuButton.x + this.menuButton.width / 2,
      this.menuButton.y + this.menuButton.height / 2 + 5
    );
    this.ctx.fillStyle = this.menuButton.isHovered
      ? this.menuButton.hoverColor
      : this.menuButton.borderColor;
    this.ctx.fillText(
      this.menuButton.text,
      this.menuButton.x + this.menuButton.width / 2 - 1,
      this.menuButton.y + this.menuButton.height / 2 + 4
    );
  };

  // Function to check if a point is inside the button
  isPointInButton(x: number, y: number, button: any) {
    return (
      x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y + 5 &&
      y <= button.y + button.height + 5
    );
  }

  handleClick = (event: MouseEvent) => {
    // Get mouse coordinates relative to the canvas
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isPointInButton(mouseX, mouseY, this.restartButton)) {
      // Simulate game restart logic
      this.restart();
    }

    if (this.isPointInButton(mouseX, mouseY, this.menuButton)) {
      // Simulate game restart logic
      console.log('menu');
    }
  };

  handleMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const wasRestartHovered = this.restartButton.isHovered;
    this.restartButton.isHovered = this.isPointInButton(
      mouseX,
      mouseY,
      this.restartButton
    );

    const wasMenuHovered = this.menuButton.isHovered;
    this.menuButton.isHovered = this.isPointInButton(
      mouseX,
      mouseY,
      this.menuButton
    );

    // Only redraw if hover state changed
    if (
      this.restartButton.isHovered !== wasRestartHovered ||
      this.menuButton.isHovered !== wasMenuHovered
    ) {
      this.canvas.style.cursor =
        this.restartButton.isHovered || this.menuButton.isHovered
          ? 'pointer'
          : 'default'; // Change cursor on hover
    }
  };
}
