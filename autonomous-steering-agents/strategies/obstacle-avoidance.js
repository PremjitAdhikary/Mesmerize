/**
 * Avoid multiple targets
 * lookAhead() gives how far to look ahead for collisions
 * showCollisions() whether to show the calculated vectors
 * 
 * The targets are taken as circles. 
 * The nearest target is selected form the predicted position.
 * Calculate a force away from it
 */
class ObstacleAvoidance {

  constructor(targets) {
    this._targets = targets;
    this._ahead;
    this._aheadHalf;
    this._lookAhead = 100;
    this._showAheadAndCollisions = false;
  }

  run(vehicle) {
    this.calculateAhead(vehicle);
    let nearest = this.nearestTarget(vehicle);
    let force = (nearest ? 
      this.calculateRedirectionForce(nearest) : this.calculateDefaultForce(vehicle));
    force.setMag(vehicle.maxSpeed).limit(vehicle.maxForce);
    this.show(vehicle, nearest);
    return force;
  }

  calculateAhead(vehicle) {
    this._ahead = p5.Vector.add(vehicle.position, 
      p5.Vector.normalize(vehicle.velocity).mult(this._lookAhead));
    this._aheadHalf = p5.Vector.add(vehicle.position, 
      p5.Vector.normalize(vehicle.velocity).mult(this._lookAhead/2));
  }

  nearestTarget(vehicle) {
    let nearest;
    for (let target of this._targets) {
      if (this.lineIntersectsCircle(target, vehicle) 
        && (this.checkIfTargetNearest(vehicle, target, nearest))) {
          nearest = target;
        }
    }
    return nearest;
  }

  checkIfTargetNearest(vehicle, target, nearest) {
    return !nearest || 
      p5.Vector.dist(target._position, vehicle.position) < 
      p5.Vector.dist(nearest._position, vehicle.position);
  }

  calculateRedirectionForce(nearest) {
    return p5.Vector.sub(this._ahead, nearest._position);
  }

  calculateDefaultForce(vehicle) {
    return p5.Vector.normalize(vehicle.velocity);
  }

  /**
   * 3 distances are checked to be more precise. 
   */
  lineIntersectsCircle(target, vehicle) {
    if (!this._ahead || !this._aheadHalf) return false;
    return p5.Vector.dist(target._position, this._ahead) <= (target._size/2 + vehicle.size)
      || p5.Vector.dist(target._position, this._aheadHalf) <= (target._size/2 + vehicle.size)
      || p5.Vector.dist(target._position, vehicle.position) <= (target._size/2 + vehicle.size);
  }

  show(vehicle, nearest) {
    if (!this._showAheadAndCollisions) return;
    strokeWeight(2);
    stroke(255);
    line(vehicle.position.x, vehicle.position.y, 
      this._ahead.x,  this._ahead.y);
    if (nearest) {
      if (p5.Vector.dist(nearest._position, vehicle.position) <= (nearest._size/2)) {
        noStroke();
        fill(255, 0, 0);
        circle(nearest._position.x,  nearest._position.y, nearest._size);
      } else {
        stroke(255, 0, 0);
        noFill();
        circle(nearest._position.x,  nearest._position.y, nearest._size);
      }
    }
  }

  showCollisions(value) {
    this._showAheadAndCollisions = value;
    return this;
  }

  lookAhead(value) {
    this._lookAhead = value;
    return this;
  }

}