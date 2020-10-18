/**
 * Winged Renderer renders a fly.
 * 
 * Constructor:
 * - len: The base length of the glider. The max width is always 30% of length. The segments 
 *     taper towards the tail.
 * 
 * Other Methods:
 * - render(mover): renders the winger based on the mover passed. Direction alignment is same 
 *     as the AxisRenderer. The flying is denoted by flapping wings. There are 4 wings, which 
 *     flap at a particular frequency. There are 2 positions for each of the wings and the wings 
 *     flap between those 2 positions at the determined frequency.
 */
class WingedRenderer {
  
  constructor(len) {
    this._len = len * 0.5;
    this._wid = this._len * 0.3;
    this._strokeColor = 0;
    this._fillColor = 150;
    this._wingColor = 250;

    this._flapForward = true;
    this._flapFrequency = 3;
    this._flapCurrFrequency = 0;

    this._notFlyingLeftTopWing = radians(10);
    this._notFlyingRightTopWing = radians(-10);
    this._notFlyingLeftBottomWing = radians(-20);
    this._notFlyingRightBottomWing = radians(20);
    this._flyingLeftTopWing = radians(30);
    this._flyingRightTopWing = radians(-30);
    this._flyingLeftBottomWing = radians(-40);
    this._flyingRightBottomWing = radians(40);
  }

  render(mover) {
    let flying = mover.isMoving();
    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderAppendages();
    this.renderBody();
    this.renderWings(flying);
    pop();
  }

  renderBody() {
    stroke(this._strokeColor);
    fill(this._fillColor);
    strokeWeight(1);

    circle(this._len/2,this._wid/2,this._wid);
    circle(this._len/2,-this._wid/2,this._wid);
    ellipse(0,0,this._len, this._wid);
  }

  renderAppendages() {
    stroke(this._strokeColor);
    fill(this._fillColor);
    strokeWeight(1);

    line(this._len/2,0,this._len,0);
    line(-this._len/3,this._wid/2,-this._len,this._wid/2);
    line(-this._len/3,-this._wid/2,-this._len,-this._wid/2);
  }

  renderWings(flying) {
    stroke(this._strokeColor);
    fill(this._wingColor);
    strokeWeight(1);

    if (!flying || (flying && !this._flapForward)) {
      this.renderWing(this._notFlyingLeftBottomWing, -this._len/2+this._wid/2);
      this.renderWing(this._notFlyingRightBottomWing, this._len/2-this._wid/2);
      this.renderWing(this._notFlyingLeftTopWing, -this._len/2+this._wid/2);
      this.renderWing(this._notFlyingRightTopWing, this._len/2-this._wid/2);
    } else {
      this.renderWing(this._flyingLeftBottomWing, -this._len/2+this._wid/2);
      this.renderWing(this._flyingRightBottomWing, this._len/2-this._wid/2);
      this.renderWing(this._flyingLeftTopWing, -this._len/2+this._wid/2);
      this.renderWing(this._flyingRightTopWing, this._len/2-this._wid/2);
    }

    if (flying && this._flapCurrFrequency == this._flapFrequency) {
      this._flapForward = !this._flapForward;
      this._flapCurrFrequency = 0;
    }
    if (flying) {
      this._flapCurrFrequency++;
    }
  }

  renderWing(angle, y) {
    push();
    rotate(angle);
    ellipse(0, y, this._wid, this._len*0.7);
    pop();
  }

}