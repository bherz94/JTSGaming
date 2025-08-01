import Game from '../abstract-game';
import type { GameObject } from '../abstract-game-object';
import type { AssetLoader } from '../asset-loader';
import type { Dimensions } from '../dimensions';
import type InputHandler from '../input-handler';
import Bravio from './objects/Bravio';
import Platform from './objects/Platform';

export default class BravioGame extends Game {
  acceptedKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'w',
    'a',
    's',
    'd',
    ' ',
    'Shift',
  ]; // the ' ' is spacebar

  bravio: Bravio;
  objects: GameObject[] = [];

  gravity = 0.5;

  constructor(
    dimensions: Dimensions,
    hudOffset: number,
    canvas: HTMLCanvasElement,
    input: InputHandler,
    assetLoader: AssetLoader
  ) {
    super(dimensions, hudOffset, canvas, input, assetLoader);
    input.setAcceptedKeys(this.acceptedKeys);

    this.bravio = new Bravio(this);
    const platform = new Platform(
      { width: 150, height: 30 },
      { x: 250, y: 450 },
      this
    );
    this.objects.push(platform);
  }

  loadAssets = async () => {
    await this.assetLoader.loadAll([
      {
        type: 'image',
        name: 'playerIdle',
        src: './src/game/bravio/assets/main/main_Idle_4.png',
      },
      {
        type: 'image',
        name: 'playerWalk',
        src: './src/game/bravio/assets/main/main_Walk_6.png',
      },
      {
        type: 'image',
        name: 'playerRun',
        src: './src/game/bravio/assets/main/main_Run_6.png',
      },
      {
        type: 'image',
        name: 'playerJump',
        src: './src/game/bravio/assets/main/main_Jump_8.png',
      },
    ]);
  };

  restart = () => {};

  update = () => {
    this.bravio.update(this.input.keys);

    this.objects.forEach((go) => {
      go.update();
    });

    const playerLeft = this.bravio.position.x;
    const playerRight = playerLeft + this.bravio.dimensions.width;

    this.objects.forEach((go) => {
      const objLeft = go.position.x;
      const objRight = objLeft + go.dimensions.width;
      if (
        playerRight < objLeft ||
        playerLeft > objRight ||
        this.bravio.position.y + this.bravio.dimensions.height >
          go.position.y + go.dimensions.height
      ) {
        this.bravio.setGround(undefined);
      } else {
        if (this.bravio.currentState.stateType !== 'jump') {
          this.bravio.setGround(go);
        }
      }
    });
  };

  draw = () => {
    const { x, y } = this.boardSize();
    this.ctx.clearRect(x.min, y.min, x.max, y.max);

    this.objects.forEach((go) => {
      go.draw(this.ctx);
    });

    this.bravio.draw(this.ctx);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    if (!this.fpsLogic()) return;
    // print hud
    this.drawHud();
    this.draw();
    this.update();
  };

  getPoints = () => {
    return 0;
  };
}
