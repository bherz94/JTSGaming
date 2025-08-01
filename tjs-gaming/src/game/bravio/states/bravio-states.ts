import type { AssetLoader } from '../../asset-loader';
import type Bravio from '../objects/Bravio';

export type BravioStateTypes = 'idle' | 'jump' | 'move' | 'run' | 'fall';
export type AnimationSpec = {
  image: HTMLImageElement;
  frameCount: number;
  frameDuration: number;
};

export abstract class BravioState {
  stateType: BravioStateTypes;
  bravio: Bravio;

  constructor(bravio: Bravio, stateType: BravioStateTypes) {
    this.bravio = bravio;
    this.stateType = stateType;
  }

  abstract handleInput(input: string[]): void;
  abstract enter(): void;
  abstract getImage(assetLoader: AssetLoader): AnimationSpec;
}

export class Idle extends BravioState {
  constructor(bravio: Bravio) {
    super(bravio, 'idle');
  }
  enter() {
    this.bravio.velocity.x = 0;
  }
  handleInput(input: string[]): void {
    if (this.bravio.velocity.y < 0) {
      this.bravio.setState('fall');
    } else if (input.includes(' ')) {
      this.bravio.setState('jump');
    } else if (
      input.includes('ArrowLeft') ||
      input.includes('a') ||
      input.includes('ArrowRight') ||
      input.includes('d')
    ) {
      this.bravio.setState('move');
    }
  }
  getImage(assetLoader: AssetLoader): AnimationSpec {
    return {
      image: assetLoader.getImage('playerIdle')!,
      frameCount: 4,
      frameDuration: 100,
    };
  }
}

export class Move extends BravioState {
  sprinting = false;
  constructor(bravio: Bravio) {
    super(bravio, 'move');
  }
  enter() {
    if (this.bravio.direction === 'l') {
      this.bravio.velocity.x -= this.bravio.accelerator;
    } else {
      this.bravio.velocity.x += this.bravio.accelerator;
    }
  }
  handleInput(input: string[]): void {
    if (input.includes('Shift')) {
      this.sprinting = true;
    } else {
      this.sprinting = false;
    }

    if (input.includes(' ')) {
      this.bravio.setState('jump');
    } else if (
      !input.includes('ArrowLeft') &&
      !input.includes('a') &&
      !input.includes('ArrowRight') &&
      !input.includes('d')
    ) {
      this.bravio.setState('idle');
    }
  }
  getImage(assetLoader: AssetLoader): AnimationSpec {
    return {
      image: this.sprinting
        ? assetLoader.getImage('playerRun')!
        : assetLoader.getImage('playerWalk')!,
      frameCount: 6,
      frameDuration: 100,
    };
  }
}

export class Jump extends BravioState {
  constructor(bravio: Bravio) {
    super(bravio, 'jump');
  }
  enter() {
    this.bravio.velocity.y = -10;
  }
  handleInput(input: string[]): void {
    if (this.bravio.velocity.y > 0) {
      this.bravio.setState('fall');
    }
  }
  getImage(assetLoader: AssetLoader): AnimationSpec {
    return {
      image: assetLoader.getImage('playerJump')!,
      frameCount: 4,
      frameDuration: 100,
    };
  }
}

export class Fall extends BravioState {
  constructor(bravio: Bravio) {
    super(bravio, 'fall');
  }
  enter() {
    return;
  }
  handleInput(input: string[]): void {
    if (this.bravio.isOnGround()) {
      if (this.bravio.velocity.x === 0) {
        this.bravio.setState('idle');
      } else {
        this.bravio.setState('move');
      }
    }
  }
  getImage(assetLoader: AssetLoader): AnimationSpec {
    return {
      image: assetLoader.getImage('playerJump')!,
      frameCount: 8,
      frameDuration: 100,
    };
  }
}
