import { COMMAND } from '../constants.js';
import { Sentryxip } from './sentryxip.js';
import { Missile } from '../game-objects/missile.js';
import { addGameObject, updateObjOnScreen } from '../game-engine.js';

export class Commandxip extends Sentryxip {

  constructor(config) {
    super(config);
    this.xipClass = COMMAND;
  }

  attack() {
    addGameObject(new Missile({
      x: this.x-1, y: this.y+2, speed: 2, damage: 3, team: this.team
    }));
    addGameObject(new Missile({
      x: this.x+1, y: this.y+2, speed: 2, damage: 3, team: this.team
    }));
  }

  kamikazeMode() {
    if (5 > Math.floor(Math.random() * 100)) 
      super.kamikazeMode();
  }

  drawShip() {
    updateObjOnScreen(this.x, this.y, '=');
    updateObjOnScreen(this.x-2, this.y, '/');
    updateObjOnScreen(this.x-1, this.y, '=');
    updateObjOnScreen(this.x+2, this.y, '\\');
    updateObjOnScreen(this.x+1, this.y, '=');
    updateObjOnScreen(this.x, this.y+1, 'O');
    updateObjOnScreen(this.x-1, this.y+1, '_');
    updateObjOnScreen(this.x+1, this.y+1, '_');
    updateObjOnScreen(this.x-2, this.y+1, '\\');
    updateObjOnScreen(this.x+2, this.y+1, '/');
    updateObjOnScreen(this.x-1, this.y+2, 'V');
    updateObjOnScreen(this.x+1, this.y+2, 'V');
  }

}