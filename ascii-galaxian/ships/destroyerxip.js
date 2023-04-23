import { DESTROYER } from '../constants.js';
import { Sentryxip } from './sentryxip.js';
import { Missile } from '../game-objects/missile.js';
import { addGameObject, updateObjOnScreen, 
  longExplosionSound, blasterSound } from '../game-engine.js';

export class Destroyerxip extends Sentryxip {

  constructor(config) {
    super(config);
    this.xipClass = DESTROYER;
  }

  attack() {
    blasterSound.play();
    for (let my=this.y+2; my<22; my++) {
      addGameObject(new Missile({
        x: this.x, y: my, speed: 5, damage: 3, team: this.team
      }));
      addGameObject(new Missile({
        x: this.x+7, y: my, speed: 5, damage: 3, team: this.team
      }));
    }
  }

  kamikazeMode() { } // no kamikaze for destroyer

  drawShip() {
    updateObjOnScreen(this.x-2, this.y, '_');
    updateObjOnScreen(this.x-1, this.y, '_');
    updateObjOnScreen(this.x, this.y, '|');
    updateObjOnScreen(this.x+1, this.y, '|');
    updateObjOnScreen(this.x+2, this.y, '=');
    updateObjOnScreen(this.x+3, this.y, '"');
    updateObjOnScreen(this.x+4, this.y, '"');
    updateObjOnScreen(this.x+5, this.y, '=');
    updateObjOnScreen(this.x+6, this.y, '|');
    updateObjOnScreen(this.x+7, this.y, '|');
    updateObjOnScreen(this.x+8, this.y, '_');
    updateObjOnScreen(this.x+9, this.y, '_');
    updateObjOnScreen(this.x-2, this.y+1, '\\');
    updateObjOnScreen(this.x-1, this.y+1, '_');
    updateObjOnScreen(this.x, this.y+1, '|');
    updateObjOnScreen(this.x+1, this.y+1, '|');
    updateObjOnScreen(this.x+2, this.y+1, '_');
    updateObjOnScreen(this.x+3, this.y+1, '[');
    updateObjOnScreen(this.x+4, this.y+1, ']');
    updateObjOnScreen(this.x+5, this.y+1, '_');
    updateObjOnScreen(this.x+6, this.y+1, '|');
    updateObjOnScreen(this.x+7, this.y+1, '|');
    updateObjOnScreen(this.x+8, this.y+1, '_');
    updateObjOnScreen(this.x+9, this.y+1, '/');
    updateObjOnScreen(this.x, this.y+2, '|');
    updateObjOnScreen(this.x+1, this.y+2, '/');
    updateObjOnScreen(this.x+3, this.y+2, '\\');
    updateObjOnScreen(this.x+4, this.y+2, '/');
    updateObjOnScreen(this.x+6, this.y+2, '\\');
    updateObjOnScreen(this.x+7, this.y+2, '|');
  }

  drawBlast() {
    updateObjOnScreen(this.x-2, this.y, '\'');
    updateObjOnScreen(this.x-1, this.y, ':');
    updateObjOnScreen(this.x, this.y, '(');
    updateObjOnScreen(this.x+1, this.y, '(');
    updateObjOnScreen(this.x+2, this.y, ':');
    updateObjOnScreen(this.x+3, this.y, '\'');
    updateObjOnScreen(this.x+4, this.y, '\'');
    updateObjOnScreen(this.x+5, this.y, ':');
    updateObjOnScreen(this.x+6, this.y, ')');
    updateObjOnScreen(this.x+7, this.y, ')');
    updateObjOnScreen(this.x+8, this.y, ':');
    updateObjOnScreen(this.x+9, this.y, '\'');
    updateObjOnScreen(this.x-2, this.y+1, '(');
    updateObjOnScreen(this.x-1, this.y+1, '.');
    updateObjOnScreen(this.x, this.y+1, '|');
    updateObjOnScreen(this.x+1, this.y+1, '|');
    updateObjOnScreen(this.x+2, this.y+1, '[');
    updateObjOnScreen(this.x+3, this.y+1, ':');
    updateObjOnScreen(this.x+4, this.y+1, ':');
    updateObjOnScreen(this.x+5, this.y+1, ']');
    updateObjOnScreen(this.x+6, this.y+1, '|');
    updateObjOnScreen(this.x+7, this.y+1, '|');
    updateObjOnScreen(this.x+8, this.y+1, '.');
    updateObjOnScreen(this.x+9, this.y+1, ')');
    updateObjOnScreen(this.x, this.y+2, ':');
    updateObjOnScreen(this.x+1, this.y+2, '(');
    updateObjOnScreen(this.x+3, this.y+2, '(');
    updateObjOnScreen(this.x+4, this.y+2, ')');
    updateObjOnScreen(this.x+6, this.y+2, ')');
    updateObjOnScreen(this.x+7, this.y+2, ':');
    longExplosionSound.play();
    this.deactivate();
  }

  rightTip() {
    return this.x + 7;
  }

}