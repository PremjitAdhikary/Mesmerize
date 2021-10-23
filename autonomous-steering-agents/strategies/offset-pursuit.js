/**
 * Keeps a distance from target while pursueing
 * updateOffsetRadius() gives how far to be from target
 * showPrediction() whether to show the calculated vectors
 */
class OffsetPursuit {

  constructor(target) {
    this._target = target;
    this._dummyTarget = new BouncingTarget(0, 0);
    this._pursuit = new Pursuit(this._dummyTarget);
    this._showDummyTarget = false;
    this.updateOffsetRadius(120);
  }

  run(vehicle) {
    this._dummyTarget._position = this._target._position.copy();
    this._dummyTarget._velocity = this._target._velocity.copy();
    this._dummyTarget._position.add(this._offset);
    this.show();
    return this._pursuit.run(vehicle);
  }

  show() {
    if (!this._showDummyTarget) return;
    strokeWeight(1);
    stroke(255);
    line(this._target._position.x, this._target._position.y, 
      this._dummyTarget._position.x,  this._dummyTarget._position.y);
    noFill();
    circle(this._dummyTarget._position.x,  this._dummyTarget._position.y, 15);
  }

  showPrediction(value) {
    this._showDummyTarget = value;
    this._pursuit.showPrediction(value);
    return this;
  }

  updateOffsetRadius(value) {
    this._radius = value;
    this._offset = p5.Vector.random2D().mult(this._radius);
    return this;
  }

}