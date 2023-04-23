import { SCREEN_WIDTH, SCREEN_HEIGHT, SENTRY } from '../constants.js';
import { Basexip } from './basexip.js';
import { Bomb } from '../game-objects/bomb.js';
import { addGameObject, shortExplosionSound, updateObjOnScreen } from '../game-engine.js';

export class Sentryxip extends Basexip {

  constructor(config) {
    super(config);
    this.speed = 1;
    this.padding = 2;
    this.kamikaze = false;
    this.xipClass = SENTRY;
  }

  attack() {
    addGameObject(new Bomb({
      x: this.x, y: this.y+2, speed: 1, damage: 3, team: this.team
    }));
  }

  kamikazeMode() {
    this.armor = Math.ceil(this.armor/2);
    this.kamikaze = true;
  }

  drawShip() {
    updateObjOnScreen(this.x, this.y, 'u');
    updateObjOnScreen(this.x-2, this.y, '~');
    updateObjOnScreen(this.x-1, this.y, '=');
    updateObjOnScreen(this.x+2, this.y, '~');
    updateObjOnScreen(this.x+1, this.y, '=');
    updateObjOnScreen(this.x, this.y+1, 'o');
    updateObjOnScreen(this.x-1, this.y+1, '\\');
    updateObjOnScreen(this.x+1, this.y+1, '/');
    updateObjOnScreen(this.x, this.y+2, 'v');
  }

  drawBlast() {
    updateObjOnScreen(this.x, this.y, '-');
    updateObjOnScreen(this.x-2, this.y, '(');
    updateObjOnScreen(this.x-1, this.y, '-');
    updateObjOnScreen(this.x+2, this.y, ')');
    updateObjOnScreen(this.x+1, this.y, '-');
    updateObjOnScreen(this.x-2, this.y+1, '`');
    updateObjOnScreen(this.x-1, this.y+1, '(');
    updateObjOnScreen(this.x+2, this.y+1, '`');
    updateObjOnScreen(this.x+1, this.y+1, ')');
    updateObjOnScreen(this.x, this.y+2, ':');
    shortExplosionSound.play();
    this.deactivate();
  }

  boundingBox() {
    return { x: this.x-1, y: this.y, w: 3, h: 2 };
  }

  xipOnScreen() {
    return !(this.x-2 < 0 || this.x+2 >= SCREEN_WIDTH || this.y < 0 || this.y+2 >= SCREEN_HEIGHT);
  }

  leftTip() {
    return this.x - 2;
  }

  rightTip() {
    return this.x + 2;
  }

}