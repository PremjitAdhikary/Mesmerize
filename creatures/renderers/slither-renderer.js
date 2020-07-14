class SlitherRenderer {
  
  constructor(len) {
    this._len = len;
    this._wid = Math.min(len * 0.3, SlitherRenderer.SEGMENT_SIZE*2);
    this._strokeColor = 0;
    this._fillColor = SketchColor.grey().alpha50().stringify();
    this._startAngle = 0;
    this._angleOffset = 0.2;
  }

  render(mover) {
    if (mover.isMoving()) {
      this._startAngle += 0.05;
    }

    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderBody();
    // stroke(SketchColor.red().stringify());
    // fill(SketchColor.red().stringify());
    // circle(0,0,5);
    pop();
  }

  renderBody() {
    let headPos = this._len/2;
    let segments = (this._len / SlitherRenderer.SEGMENT_SIZE)*2;
    let segDist = this._len / segments;

    let angle = this._startAngle;
    for (let i=0; i<segments; i++) {
      this.renderSegment(
        headPos - (i*segDist),
        map(sin(angle),-1,1,-this._wid,this._wid),
        map(i,0,segments,this._wid,this._wid*0.7));
      angle -= this._angleOffset;
    }
  }

  renderSegment(x, y, r) {
    stroke(this._strokeColor);
    fill(this._fillColor);
    strokeWeight(1);
    circle(x, y, r);
  }
  
}

SlitherRenderer.SEGMENT_SIZE = 3;