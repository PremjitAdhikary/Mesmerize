/**
 * The most basic behavior
 * slowRadius() sets the radius at which deceleration happens
 */
class Seek {

  constructor(target) {
    this._target = target;
    this._slowRadius = 100;
  }

  run(vehicle, arrive = false) {
    let force = p5.Vector.sub(this._target._position, vehicle.position);
    let desiredSpeed = vehicle.maxSpeed;
    if (arrive) {
      let distance = force.mag();
      if (distance < this._slowRadius) {
        desiredSpeed = map(distance, 0, this._slowRadius, 0, vehicle.maxSpeed);
      }
    }
    return force.setMag(desiredSpeed).sub(vehicle.velocity).limit(vehicle.maxForce);
  }

  slowdownRadius(value) {
    this._slowRadius = value;
    return this;
  }

}