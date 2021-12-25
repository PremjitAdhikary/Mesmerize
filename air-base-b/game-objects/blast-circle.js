class BlastCircle {

  constructor(pos, vel, r, rmax, dr, delay = 0, burn = false) {
    this.pos = pos;
    this.vel = vel;
    this.r = r;
    this.rmax = rmax;
    this.dr = dr;
    this.delay = delay;
    this.active = true;
    this.blastColor = burn ? burnColor : bgColor;
  }

  show() {
    if (this.delay > 0 || !this.active) return;
    drawEllipse(this.pos.x, this.pos.y, this.r, this.r, darkColor, 2, true, this.blastColor);
    if (this.r >= this.rmax) {
      this.active = false;
    }
  }

  animate() {
    if (!this.active) return;
    this.pos.add(this.vel);
    if (this.delay > 0) {
      this.delay--;
      return;
    }
    if (this.r < this.rmax) {
      this.r += this.dr;
    }
  }

}