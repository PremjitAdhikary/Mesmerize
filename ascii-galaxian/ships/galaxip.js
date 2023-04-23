import { SCREEN_WIDTH, SCREEN_HEIGHT, FIGHTER } from '../constants.js';
import { Basexip } from './basexip.js';
import { Missile } from '../game-objects/missile.js';
import { addGameObject, updateObjOnScreen, longExplosionSound, bulletSound } from '../game-engine.js';

export class Galaxip extends Basexip {

  constructor(config) {
    super(config);
    this.speed = 2;
    this.alternateAtack = true;
    this.attackEnabled = false;
    this.padding = 3;
    this.xipClass = FIGHTER;
    this.dualGunsActivated = false;
    this.rapidFireActivated = false;
  }

  attack() {
    if (!this.rapidFireActivated && !this.attackEnabled) {
      this.attackEnabled = true;
      return;
    }
    if (this.rapidFireActivated || this.attackEnabled) {
      this.attackEnabled = false;
    }
    if (!this.dualGunsActivated) {
      bulletSound.play();
      addGameObject(new Missile({
        x: this.x, y: this.y-3, speed: -2, damage: 3, team: this.team
      }));
    } else {
      bulletSound.play();
      addGameObject(new Missile({
        x: this.x-1, y: this.y-3, speed: -2, damage: 3, team: this.team
      }));
      addGameObject(new Missile({
        x: this.x+1, y: this.y-3, speed: -2, damage: 3, team: this.team
      }));
    }
  }

  drawShip() {
    updateObjOnScreen(this.x, this.y-2, '|');
    updateObjOnScreen(this.x-1, this.y-1, '/');
    updateObjOnScreen(this.x, this.y-1, 'o');
    updateObjOnScreen(this.x+1, this.y-1, '\\');
    updateObjOnScreen(this.x-2, this.y, '|');
    updateObjOnScreen(this.x-1, this.y, '|');
    updateObjOnScreen(this.x, this.y, '^');
    updateObjOnScreen(this.x+1, this.y, '|');
    updateObjOnScreen(this.x+2, this.y, '|');
  }

  drawBlast() {
    updateObjOnScreen(this.x, this.y-2, '.');
    updateObjOnScreen(this.x-1, this.y-1, '(');
    updateObjOnScreen(this.x+1, this.y-1, ')');
    updateObjOnScreen(this.x-2, this.y, '(');
    updateObjOnScreen(this.x-1, this.y, '.');
    updateObjOnScreen(this.x, this.y, ':');
    updateObjOnScreen(this.x+1, this.y, '.');
    updateObjOnScreen(this.x+2, this.y, ')');
    longExplosionSound.play();
    this.deactivate();
  }

  boundingBox() {
    return { x: this.x-1, y: this.y-2, w: 3, h: 3 };
  }

  xipOnScreen() {
    return !(this.x-2 < 0 || this.x+2 >= SCREEN_WIDTH || this.y-2 < 0 || this.y >= SCREEN_HEIGHT);
  }

}