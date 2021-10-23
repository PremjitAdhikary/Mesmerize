/**
 * Contains the vehicle in an environment (within its walls)
 * lookAhead gives how far to look ahead for collisions
 * safePoint the point where the vehicle will turn to in case it is in collition course
 * showAhead whether to show the calculated vectors
 */
class Containment {

  constructor(environments) {
    this._environments = environments;
    this._ahead;
    this._aheadHalf;
    this._lookAhead = 80;
    this._showAhead = false;
    this._safePoint = new DummyTarget(width/2, height/2);
    this._seek = new Seek(this._safePoint);
  }

  run(vehicle) {
    this._ahead = p5.Vector.add(
      vehicle.position, vehicle.velocity.copy().setMag(this._lookAhead));
    this._aheadHalf = p5.Vector.add(
      vehicle.position, vehicle.velocity.copy().setMag(this._lookAhead/2));
    this.show(vehicle);
    if (this.vehicleIntersectsEnvironment(vehicle)) {
      return this._seek.run(vehicle);
    }
    return createVector(0, 0);
  }

  vehicleIntersectsEnvironment(vehicle) {
    return this.pointInEnvironment(this._ahead) || this.pointInEnvironment(this._aheadHalf)
       || this.pointInEnvironment(vehicle.position);
  }

  pointInEnvironment(checkPoint, show = false) {
    return this._environments.some(env => env.pointInUnreachable(checkPoint.x, checkPoint.y, show));
  }

  show(vehicle) {
    if (!this._showAhead) return;
    strokeWeight(2);
    stroke(255);
    line(vehicle.position.x, vehicle.position.y, 
      this._ahead.x,  this._ahead.y);
    this.pointInEnvironment(vehicle.position, true);
  }

  showAhead(value) {
    this._showAhead = value;
    return this;
  }

  lookAhead(value) {
    this._lookAhead = value;
    return this;
  }

  safePoint(x, y) {
    this._safePoint.x = x;
    this._safePoint.y = y;
    return this;
  }

}