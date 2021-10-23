/**
 * Pursues a target
 * predictionMax() sets how far to predict
 * slowRadius() sets the radius at which deceleration happens
 * showPrediction() whether to show the calculated vectors
 */
class Pursuit {

  constructor(target) {
    this._target = target;
    this._predictionMax = 2;
    this._predictedTarget = new DummyTarget(0, 0);
    this._seek = new Seek(this._predictedTarget);
    this._showPredictedTarget = false;
  }

  run(vehicle, arrive = false) {
    this._predictedTarget._position = this._target._position.copy();
    let prediction = this._target._velocity ? this._target._velocity.copy() : 0;
    let timeUnits = map(p5.Vector.dist(this._predictedTarget._position, vehicle.position), 
      0, width, 1, this._predictionMax);
    prediction.mult(timeUnits);
    this._predictedTarget._position.add(prediction);

    this.show();
    return this._seek.run(vehicle, arrive);
  }

  show() {
    if (!this._showPredictedTarget) return;
    strokeWeight(1);
    stroke(255);
    line(this._target._position.x, this._target._position.y, 
      this._predictedTarget._position.x,  this._predictedTarget._position.y);
    noFill();
    circle(this._predictedTarget._position.x,  this._predictedTarget._position.y, 8);
  }

  predictionMax(value) {
    this._predictionMax = value;
    return this;
  }

  showPrediction(value) {
    this._showPredictedTarget = value;
    return this;
  }

  slowRadius(value) {
    this._seek.slowdownRadius(value);
    return this;
  }

}