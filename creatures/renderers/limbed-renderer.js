/**
 * Limbed Renderer renders a bug with 4 limbs.
 * 
 * Constructor:
 * - len: The base length of the limbed bug. 
 * 
 * Other Methods:
 * - render(mover): renders the bug based on the mover passed. Direction alignment is same 
 *     as the AxisRenderer. The walking limbs are denoted by 2 lines oscillating between 
 *     (HALF_PI-PI/6) and (HALF_PI+PI/6) angles.
 */
class LimbedRenderer {
  
  constructor(len) {
    this._len = len;
    this._strokeColor = 0;
    this._bodyColor = SketchColor.grey().stringify();
    this._headColor = SketchColor.grey().stringify();
    this._limbColor = 0;

    this._limbAngle = HALF_PI;
    this._limbAngleIncrement = 0.06;
  }

  render(mover) {
    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderLimbs();
    this.renderBody();
    this.renderHead();
    pop();
    this.updateLimbAngle(mover);
  }

  renderBody() {
    stroke(this._strokeColor);
    fill(this._bodyColor);
    strokeWeight(1);
    ellipse(0, 0, this._len, this._len * 0.7);
  }

  renderHead() {
    stroke(this._strokeColor);
    fill(this._headColor);
    strokeWeight(1);
    circle(this._len/2, 0, this._len/3);
  }

  renderLimbs() {
    stroke(this._limbColor);
    strokeWeight(2);
    let px = this._len/2 * cos(this._limbAngle);
    let py = this._len/2 * sin(this._limbAngle);
    let qx = this._len/2 * cos(this._limbAngle + PI);
    let qy = this._len/2 * sin(this._limbAngle + PI);

    let ax = this._len/4 + px;
    let bx = this._len/4 + qx;
    line(ax,py,bx,qy);

    let cx = -this._len/4 - px;
    let dx = -this._len/4 - qx;
    line(cx,py,dx,qy);
  }

  updateLimbAngle(mover) {
    if (!mover.isMoving()) 
      return;

    this._limbAngle += this._limbAngleIncrement;
    if (!(this._limbAngle < (HALF_PI+PI/6) && this._limbAngle > (HALF_PI-PI/6))) {
      this._limbAngleIncrement = -this._limbAngleIncrement;
    }
  }

}