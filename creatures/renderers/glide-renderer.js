class GlideRenderer {
  
  constructor(len) {
    this._len = len;
    this._wid = len * 0.3;
    this._strokeColor = 0;
    this._fillColor = 150;
    this._stretch = true;
    this._currLen = len;
  }

  render(mover) {
    if (mover.isMoving()) {
      this.calculateCurrentLength();
    }

    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderBody();
    pop();
  }

  calculateCurrentLength() {
    if (this._stretch) {
      this._currLen += (this._len * GlideRenderer.INCREMENT);
      if (this._currLen >= this._len * GlideRenderer.MULTIPLIER) {
        this._stretch = false;
      }
    } else {
      this._currLen -= (this._len * GlideRenderer.INCREMENT);
      if (this._currLen <= this._len) {
        this._stretch = true;
      }
    }
  }

  /**
   * The body is bunch of connected segments, first one representing the head with a circle 
   * and consecutive segments gradually tapering out.
   * The movement is squash and stretch (hence the name) like earthworms?
   */
  renderBody() {
    let headPos = (this._currLen - this._len) + this._len/2;
    let segments = this._len / GlideRenderer.SEGMENT_SIZE;
    let segDist = this._currLen / segments;

    stroke(this._strokeColor);
    strokeWeight(2);
    line(headPos, 0, headPos-this._currLen, 0);

    for (let i=0; i<segments; i++) {
      if (i === 0) {
        this.renderHead(headPos - (i*segDist), this._wid*0.8);
      } else {
        this.renderSegment(
          (headPos - (i*segDist)),
          (this._len*0.8/segments),
          map(i,0,segments-1,this._wid*0.9,this._wid*0.3));
      }
    }
  }

  renderHead(x, r) {
    strokeWeight(1);
    stroke(this._strokeColor);
    fill(this._fillColor);
    circle(x, 0, r);
  }

  renderSegment(x, len, wid) {
    strokeWeight(1);
    stroke(this._strokeColor);
    fill(this._fillColor);
    rect(x, 0, len, wid);
  }

}

GlideRenderer.MULTIPLIER = 1.4;
GlideRenderer.INCREMENT = 0.02;
GlideRenderer.SEGMENT_SIZE = 4;