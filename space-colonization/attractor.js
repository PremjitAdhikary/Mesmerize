class Attractor {

  constructor(v, color) {
    this.pos = v.copy();
    this.color = color;
    this.reached = false;
  }

  show() {
    if (this.reached) return;
    noStroke();
    fill(this.color);
    circle(this.pos.x,this.pos.y,4);
  }

}