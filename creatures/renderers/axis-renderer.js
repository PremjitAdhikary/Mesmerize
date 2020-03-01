class AxisRenderer {
  
  constructor(len) {
    this._len = len;
    this._wid = len * 0.3;
    this._strokeColor = 0;
    this._fillColor = 150;
  }

  render(mover) {
    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderBody();
    if (mover.isMoving()) {
      this.renderHead();
    }
    pop();
  }

  renderBody() {
    stroke(this._strokeColor);
    strokeWeight(1);
    fill(this._fillColor);
    rect(0,0,this._len,this._wid);
  }

  renderHead() {
    stroke(SketchColor.red().stringify());
    strokeWeight(5);
    point(this._len/2,0,2);
  }
}