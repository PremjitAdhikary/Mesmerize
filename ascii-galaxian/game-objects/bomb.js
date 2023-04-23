import { Projectile } from './projectile.js';
import { updateObjOnScreen } from '../game-engine.js';

export class Bomb extends Projectile {

  constructor(config) {
    super(config);
  }

  updateObjectOn() {
    if (this.active)
      updateObjOnScreen(this.x, this.y, 'o');
  }

}