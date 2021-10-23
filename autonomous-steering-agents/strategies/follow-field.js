/**
 * Enables vehilce to navigate through a minefield of flows
 * lookAhead gives how far to look ahead for collisions
 */
class FollowField {

  constructor(flowField) {
    this._flowField = flowField;
    this._lookAhead = 50;
  }

  run(vehicle) {
    let prediction = p5.Vector.normalize(vehicle.velocity)
      .mult(this._lookAhead).add(vehicle.position);
    let flow = this._flowField.calcFlow(prediction).copy();
    if (flow.mag() == 0) return flow;
    return flow.setMag(vehicle.maxSpeed).sub(vehicle.velocity).limit(vehicle.maxForce);
  }

  lookAhead(value) {
    this._lookAhead = value;
    return this;
  }

}