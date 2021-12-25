class AirBaseBG {

  constructor() {
    this.groundColor = SketchColor.blend(SketchColor.green(), SketchColor.grey()).stringify();
    this.clouds = [];
    this.clouds.push(new CloudLoc(100, 150, -0.05));
    this.clouds.push(new CloudLoc(380, 175, -0.05));
    this.clouds.push(new CloudLoc(240, 60, -0.05));
    this.clouds.push(new CloudLoc(530, 70, -0.05));
    this.ops = [];
    this.ops.push(new AirBaseOp(65, 262));
    this.ops.push(new AirBaseOp(42, 262));
    this.ops.push(new AirBasePacingOp(50, 262, 47, 60, 0.2, 150));
  }

  show() {
    this.showGround(360);
    this.showBuilding(-10, 320);
    this.clouds.forEach( cloud => this.showCloud(cloud.x, cloud.y) );
    this.ops.forEach(op => op.show());
  }

  animate() {
    this.clouds.forEach( cloud => cloud.move() );
    this.ops.forEach( op => op.move() );
  }

  showGround(y) {
    drawLine(0, y, width, y, lineColor, 2);
  }

  showBuilding(x, y) {
    let baseColor = 210;
    let shadeColor = 195;
    // tower base
    drawRect(x+50, y-40, 30, 50, lineColor, 2, true, baseColor);
    drawRect(x+55, y-35, 10, 10, lineColor, 1, true, shadeColor);
    drawRect(x+65, y-15, 10, 10, lineColor, 1, true, shadeColor);
    // building base
    drawRect(x, y, 100, 60, lineColor, 2, true, baseColor);
    drawRect(x+30, y+40, 10, 20, lineColor, 1, true, shadeColor);
    drawRect(x+40, y+40, 10, 20, lineColor, 1, true, shadeColor);
    drawRect(x+80, y+40, 10, 20, lineColor, 1, true, shadeColor);
    drawRect(x+20, y+15, 10, 10, lineColor, 1, true, shadeColor);
    drawRect(x+45, y+15, 10, 10, lineColor, 1, true, shadeColor);
    drawRect(x+70, y+15, 10, 10, lineColor, 1, true, shadeColor);
    // tower top
    drawRect(x+60, y-80, 10, 10, lineColor, 2, true, baseColor);
    drawPoly([x+50, x+80, x+95, x+35], [y-40, y-40, y-70, y-70], lineColor, 2, true, baseColor, 
      true, [x+52, x+78, x+93, x+37], [y-38, y-38, y-72, y-72], lineColor);
    drawRect(x+47, y-65, 36, 10, lineColor, 1, true, baseColor);
  }

  showCloud(x, y) {
    strokeWeight(1);
    noFill();
    stroke(lineColor);
    if (graphics == SCRIBBLE) {
      scribble.scribbleCurve(x - 20, y + 10, x + 20, y + 10, x - 25, y + 18, x + 25, y + 18);
      scribble.scribbleCurve(x - 20, y + 10, x - 15, y - 12, x - 60, y + 5, x - 25, y - 25);
      scribble.scribbleCurve(x - 15, y - 12, x + 12, y - 8, x - 30, y - 50, x + 30, y - 30);
      scribble.scribbleCurve(x + 20, y + 10, x + 12, y - 8, x + 50, y + 10, x + 18, y - 20);
    } else if (graphics == BASIC) {
      bezier(x - 20, y + 10, x - 25, y + 18, x + 25, y + 18, x + 20, y + 10);
      bezier(x - 20, y + 10, x - 60, y + 5, x - 25, y - 25, x - 15, y - 12);
      bezier(x - 15, y - 12, x - 30, y - 50, x + 30, y - 30, x + 12, y - 8);
      bezier(x + 20, y + 10, x + 50, y + 10, x + 18, y - 20, x + 12, y - 8);
    }
  }

}

class CloudLoc {

  constructor(x, y, dx) {
    this.x = x; 
    this.y = y;
    this.dx = dx;
  }

  move() {
    this.x += this.dx;
    if (this.x < -30) {
      this.x = width + 30;
    }
  }
}

class AirBaseOp {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    stroke(lineColor);
    strokeWeight(3);
    line(this.x, this.y-2, this.x, this.y+2);
    strokeWeight(6);
    point(this.x, this.y-3)
  }

  move() {}

}

class AirBasePacingOp extends AirBaseOp {

  constructor(x, y, rangeMinX, rangeMaxX, pace = 0.1, waitTime = 30) {
    super(x, y);
    this.rangeMinX = rangeMinX;
    this.rangeMaxX = rangeMaxX;
    this.pace = pace;
    this.waitTime = waitTime;
    this.waitCount = 0;
  }

  move() {
    if (this.waitCount > 0) {
      this.waitCount--;
      return;
    }
    if (this.xInRange()) {
      this.x += this.pace;
    }
    if (!this.xInRange()) {
      this.pace *= -1;
      this.x += this.pace;
      this.waitCount = this.waitTime;
    }
  }

  xInRange() {
    return this.x > this.rangeMinX && this.x < this.rangeMaxX;
  }

}