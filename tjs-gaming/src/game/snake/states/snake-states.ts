import type { Position } from '../../position';
import type { Snake } from '../objects/snake';

export type State = 'left' | 'up' | 'right' | 'down';

export abstract class SnakeState {
  state: State;
  snake: Snake;

  constructor(state: State, snake: Snake) {
    this.state = state;
    this.snake = snake;
  }
  abstract updatePos(position: Position): Position;

  abstract handleInput(input: string[]): void;
}

export class LeftState extends SnakeState {
  constructor(snake: Snake) {
    super('left', snake);
  }

  updatePos(position: Position): Position {
    return { x: (position.x -= this.snake.dimensions.width), y: position.y };
  }

  handleInput(input: string[]) {
    const latestKey = input.length > 0 ? input[input.length - 1] : undefined;
    if (latestKey) {
      switch (latestKey) {
        case 'ArrowUp':
          this.snake.setState('up');
          break;
        case 'ArrowDown':
          this.snake.setState('down');
          break;
      }
    }
  }
}

export class RightState extends SnakeState {
  constructor(snake: Snake) {
    super('right', snake);
  }

  updatePos(position: Position): Position {
    return { x: (position.x += this.snake.dimensions.width), y: position.y };
  }

  handleInput(input: string[]) {
    const latestKey = input.length > 0 ? input[input.length - 1] : undefined;
    if (latestKey) {
      switch (latestKey) {
        case 'ArrowUp':
          this.snake.setState('up');
          break;
        case 'ArrowDown':
          this.snake.setState('down');
          break;
      }
    }
  }
}

export class DownState extends SnakeState {
  constructor(snake: Snake) {
    super('down', snake);
  }

  updatePos(position: Position): Position {
    return { x: position.x, y: position.y + this.snake.dimensions.height };
  }

  handleInput(input: string[]) {
    const latestKey = input.length > 0 ? input[input.length - 1] : undefined;
    if (latestKey) {
      switch (latestKey) {
        case 'ArrowLeft':
          this.snake.setState('left');
          break;
        case 'ArrowRight':
          this.snake.setState('right');
          break;
      }
    }
  }
}

export class UpState extends SnakeState {
  constructor(snake: Snake) {
    super('up', snake);
  }

  updatePos(position: Position): Position {
    return { x: position.x, y: (position.y -= this.snake.dimensions.height) };
  }
  handleInput(input: string[]) {
    const latestKey = input.length > 0 ? input[input.length - 1] : undefined;
    if (latestKey) {
      switch (latestKey) {
        case 'ArrowLeft':
          this.snake.setState('left');
          break;
        case 'ArrowRight':
          this.snake.setState('right');
          break;
      }
    }
  }
}
