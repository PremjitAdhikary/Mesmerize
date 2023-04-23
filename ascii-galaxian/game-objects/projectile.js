import { SCREEN_WIDTH, SCREEN_HEIGHT, PROJECTILE } from '../constants.js';

export class Projectile {

  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.speed = config.speed;
    this.active = true;
    this.type = PROJECTILE;
    this.team = config.team;
    this.damage = config.damage;
  }

  animate() {
    this.y += this.speed;
    if (this.x < 0 || this.x >= SCREEN_WIDTH || 
        this.y < 0 || this.y >= SCREEN_HEIGHT) 
      this.active = false;
  }

  hit() {
    this.active = false;
  }

}