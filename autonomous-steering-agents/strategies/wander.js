/**
 * Seeks a ever changing random target
 * wanderAngleChange() sets how much will be the range for randomization of velocity
 * wanderRadius() restrict the magnitude of velocity change
 * wanderDistance() sets how far ahead to set the wander target
 * showWandering() whether to show the calculated vectors
 */
class Wander {

  constructor() {
    this._seek = new Seek(new DummyTarget(0, 0));
    this._radius = 20;
    this._dist = 100;
    this._change = 0.2;
    this._angle = 0;
    this._showWandering = false;
  }

  run(vehicle) {
    this._angle += random(-this._change, this._change);
    let wanderPos = vehicle.velocity.copy().normalize().mult(this._dist).add(vehicle.position);
    let heading = vehicle.velocity.heading();
    let offset = createVector(
      this._radius * cos(this._angle + heading),
      this._radius * sin(this._angle + heading)
    );
    this._seek._target._position = p5.Vector.add(wanderPos, offset);
    this.show(vehicle, wanderPos);
    return this._seek.run(vehicle);
  }

  show(vehicle, wanderPos) {
    if (!this._showWandering) return;
    strokeWeight(1);
    stroke(255);
    noFill();
    ellipseMode(CENTER);
    circle(wanderPos.x, wanderPos.y, this._radius * 2);
    fill(255);
    circle(this._seek._target._position.x, this._seek._target._position.y, 8);
    line(vehicle.position.x, vehicle.position.y, wanderPos.x, wanderPos.y);
    line(wanderPos.x, wanderPos.y, this._seek._target.x, this._seek._target.y);
  }

  wanderAngleChange(value) {
    this._change = value;
    return this;
  }

  wanderRadius(value) {
    this._radius = value;
    return this;
  }

  wanderDistance(value) {
    this._dist = value;
    return this;
  }

  showWandering(value) {
    this._showWandering = value;
    return this;
  }

}