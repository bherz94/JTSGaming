import { GameObject } from '../../abstract-game-object';
import type BravioGame from '../bravio-game';
import {
  Fall,
  Idle,
  Jump,
  Move,
  type BravioState,
  type BravioStateTypes,
} from '../states/bravio-states';

export type Directions = 'l' | 'r';

export default class Bravio extends GameObject {
  velocity: { x: number; y: number };
  states: BravioState[] = [
    new Idle(this),
    new Jump(this),
    new Fall(this),
    new Move(this),
  ];
  currentState: BravioState;

  ground: GameObject | undefined;

  maxSpeed = 7;
  walkSpeed = 5;
  accelerator = 0.3;

  animationFrame: number = 0;
  lastAnimStamp: number;

  direction: Directions = 'r';

  declare game: BravioGame;

  constructor(game: BravioGame) {
    super(
      {
        height: 32,
        width: 32,
      },
      {
        x: 100,
        y: 100,
      },
      game
    );
    this.velocity = { x: 0, y: 0 };
    this.currentState = this.states.find((s) => s.stateType === 'idle')!;
    this.lastAnimStamp = window.performance.now();
  }

  update = (inputs?: string[]): void => {
    if (inputs) {
      this.currentState.handleInput(inputs);
    }

    //update position
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    const groundValue = this.ground
      ? this.ground.position.y
      : this.game.boardSize().y.max;

    if (
      this.position.y + this.dimensions.height + this.velocity.y <=
      groundValue
    ) {
      //apply gravity
      this.velocity.y += this.game.gravity;
    } else {
      this.velocity.y = 0;
      this.position.y = groundValue - this.dimensions.height;
    }

    //do the left right movement here so it gets applied to all states
    if (inputs) {
      if (inputs.includes('ArrowLeft') || inputs.includes('a')) {
        if (this.direction === 'r') {
          this.velocity.x = 0;
          this.direction = 'l';
        }
        this.velocity.x -= this.accelerator;
      } else if (inputs.includes('ArrowRight') || inputs.includes('d')) {
        if (this.direction === 'l') {
          this.velocity.x = 0;
          this.direction = 'r';
        }
        this.velocity.x += this.accelerator;
      }

      if (inputs.includes('Shift')) {
        if (this.velocity.x > this.maxSpeed) {
          this.velocity.x = this.maxSpeed;
        } else if (this.velocity.x < -this.maxSpeed) {
          this.velocity.x = -this.maxSpeed;
        }
      } else {
        if (this.velocity.x > this.walkSpeed) {
          this.velocity.x = this.walkSpeed;
        } else if (this.velocity.x < -this.walkSpeed) {
          this.velocity.x = -this.walkSpeed;
        }
      }
    }
  };

  setGround = (go?: GameObject) => {
    this.ground = go;
  };

  isOnGround = (): boolean => {
    let isGrounded = true;
    if (this.ground) {
      isGrounded =
        this.position.y + this.dimensions.height === this.ground.position.y;
    } else {
      isGrounded =
        this.position.y + this.dimensions.height ===
        this.game.boardSize().y.max;
    }

    return isGrounded;
  };

  setState = (state: BravioStateTypes) => {
    this.currentState = this.states.find((s) => s.stateType === state)!;
    this.animationFrame = 0;
    this.currentState.enter();
  };

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = 'red';
    const image = this.currentState.getImage(this.game.assetLoader);

    const now = window.performance.now();

    if (now - this.lastAnimStamp > image.frameDuration) {
      this.animationFrame++;
      if (this.animationFrame >= image.frameCount) this.animationFrame = 0;
      this.lastAnimStamp = now;
    }

    if (this.direction === 'r') {
      ctx.drawImage(
        image.image,
        this.animationFrame * this.dimensions.width,
        0,
        this.dimensions.width,
        this.dimensions.height,
        this.position.x,
        this.position.y,
        this.dimensions.width,
        this.dimensions.height
      );
    } else {
      ctx.save();
      ctx.translate(
        this.position.x + this.dimensions.width / 2,
        this.position.y + this.dimensions.height / 2
      );
      ctx.scale(-1, 1); // Flip horizontally
      ctx.drawImage(
        image.image,
        this.animationFrame * this.dimensions.width,
        0,
        this.dimensions.width,
        this.dimensions.height,
        -this.dimensions.width / 2,
        -this.dimensions.height / 2,
        this.dimensions.width,
        this.dimensions.height
      );
      ctx.restore();
    }
  };
}
