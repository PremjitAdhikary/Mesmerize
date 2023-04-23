import { SCREEN_WIDTH, SCREEN_HEIGHT, SHIP } from '../constants.js';

export class Basexip {

  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.isHit = false;
    this.active = true;
    this.type = SHIP;
    this.team = config.team;
    this.armor = config.armor;
    this.onDeactivated = config.onDeactivated;
  }

  moveBy(x, y) {
    this.x += x;
    this.y += y;
  }

  left() { 
    if (this.x > this.padding) this.moveBy(-this.speed, 0);
  }
  right() { 
    if (this.x < SCREEN_WIDTH - this.padding) this.moveBy(this.speed, 0);
  }
  down() {
    this.moveBy(0, this.speed);
    if (this.y > SCREEN_HEIGHT + this.padding) this.y = -this.padding;
  }

  animate() {}

  updateObjectOn() {
    if (!this.active || !this.xipOnScreen()) return;
    this.isHit ? this.drawBlast() : this.drawShip();
  }

  hit(damage) {
    this.armor -= damage;
    if (this.armor <= 0)
      this.isHit = true;
  }

  xipOnScreen() {
    return false;
  }

  deactivate() {
    this.active = false;
    this.onDeactivated(this);
  }

}