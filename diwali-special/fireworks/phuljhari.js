class Phuljhari extends FwParticle {

  constructor(x, y, colors = [SketchColor.yellow().stringify()]) {
    super(x, y);
    this._colors = colors;
    this._timer = Math.floor(random(180, 240));

    this._radius = Math.floor(random(4,6));
    this._angle = random(3);
    this._angularVelocity = random(-0.08, 0.08);
  }
  
  show(envX, envY) {
    if (this._timer <= 0) return;
    let numOfLines = Math.floor(random(8, 12));
    for (let l = 0; l < numOfLines; l++) {
      let color = this._colors.length == 1 ? this._colors[0] : random(this._colors);
      stroke(color);
      strokeWeight(1.5);
      push();
      translate(this.getRelativeX(envX) + this._radius*cos(this._angle), 
        this.getRelativeY(envY) + this._radius*sin(this._angle));
      rotate(map(l, 0, numOfLines, 0, TWO_PI));
      let fireLen = Math.floor(random(6, 11));
      line(1, 0, fireLen, 0);
      strokeWeight(1);
      let sLen = random(1,1.5);
      for (let s = 0; s < 4; s++) {
        let sAngle = map(s, 0, 5, 0, TWO_PI);
        line(fireLen + 1, 0, fireLen + sLen * cos(sAngle), sLen * sin(sAngle));
      }
      pop();
    }
    this._angle += this._angularVelocity;
    this._timer--;
  }

  isOver() {
    return this._timer <= 0;
  }

}