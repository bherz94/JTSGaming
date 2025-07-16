import type IGame from '../../abstract-game';
import { GameObject } from '../../abstract-game-object';
import type { Position } from '../../position';
import {
  DownState,
  LeftState,
  RightState,
  SnakeState,
  UpState,
  type State,
} from '../states/snake-states';

export class Snake extends GameObject {
  tiles: Position[] = [];

  states: SnakeState[] = [
    new RightState(this),
    new LeftState(this),
    new DownState(this),
    new UpState(this),
  ];
  currentState = this.states[0];

  hasEaten = false;
  isDead = false;

  constructor(game: IGame) {
    super(
      {
        width: 20,
        height: 20,
      },
      {
        x: 20 * 4,
        y: 20 * 5,
      },
      game
    );

    this.tiles.push(
      {
        x: this.dimensions.width * 3,
        y: this.dimensions.height * 5,
      },
      {
        x: this.dimensions.width * 2,
        y: this.dimensions.height * 5,
      },
      {
        x: this.dimensions.width * 1,
        y: this.dimensions.height * 5,
      }
    );
  }

  eat() {
    this.hasEaten = true;
  }

  setState = (state: State) => {
    this.currentState = this.states.find((s) => s.state === state)!;
  };

  getPoints = (): number => {
    return 10 * (this.tiles.length - 3);
  };

  update = (inputs?: string[]) => {
    if (inputs && this.currentState.handleInput) {
      this.currentState.handleInput(inputs);
    }

    const oldPos = { ...this.position };
    this.position = this.currentState.updatePos(this.position);
    const currentTailPos = { ...this.tiles[this.tiles.length - 1] };

    const { x, y } = this.game.boardSize();

    // teleport on x if going out left or right
    if (this.position.x < x.min) {
      this.position.x = x.max - this.dimensions.width;
    } else if (this.position.x > x.max - this.dimensions.width) {
      this.position.x = x.min;
    }

    // same for up down
    if (this.position.y < y.min) {
      this.position.y = y.max - this.dimensions.height;
    } else if (this.position.y > y.max - this.dimensions.height) {
      this.position.y = y.min;
    }
    // update tiles
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      this.tiles[i] = i === 0 ? oldPos : this.tiles[i - 1];
    }

    if (this.hasEaten) {
      this.tiles.push(currentTailPos);
      this.hasEaten = false;
    }

    this.tiles.forEach((t) => {
      if (this.position.x === t.x && this.position.y === t.y) {
        this.isDead = true;
      }
    });
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'blue';
    this.tiles.forEach((t) => {
      ctx.fillRect(
        t.x + 1,
        t.y + 1,
        this.dimensions.width - 2,
        this.dimensions.height - 2
      );
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );
  };
}
