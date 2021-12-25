class Wheel {

  constructor(x, y, r) {
    this.init(x, y);
    this.r = r;
    this.tubeW = r*2/3;
    this.lC = lineColor;
  }

  init(x, y, color) {
    this.lC = color;
    this.x = x;
    this.y = y;
    this.a = 0;
  }

  move(x, y) {
    let da = Math.sqrt((x - this.x)*(x - this.x) + (y - this.y)*(y - this.y))/this.r;
    this.a += ((x - this.x > 0 ? 1 : -1)) * da;
    this.x = x;
    this.y = y;
  }

  animate() {}

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    drawEllipse(0, 0, this.r*2, this.r*2, this.lC, this.tubeW, true, bgColor);
    drawLine(-this.r, 0, this.r, 0, this.lC, 2);
    if (this.r > 7)
      drawLine(0, -this.r, 0, this.r, this.lC, 2);
    pop();
  }

}