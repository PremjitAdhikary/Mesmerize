/**
 * Mover class is reposible for all the locomotion. Given a velocity, this will move in that 
 * direction with the speed until changed or stopped.
 * 
 * Constructor:
 * - location: the initial location vector
 * 
 * Other Methods:
 * - setLocation(location): Sets up the current location of the mover
 * - setVelocity(velocity): Sets up the velocity so that the mover can move in that directin 
 *     at that speed
 * - resetVelocity(): Stops the mover
 * - applyAcceleration(acceleration): adds the acceleration to current acceleration. To decelerate 
 *     the applied acceleration shold be in the opposite direction
 * - isMoving(): whether the mover is moving or not
 * - setTopSpeed(topSpeed): Assures you dont see a tortoise moving like a hare
 * - setAngle(angle): For angular movement
 * - setAngularVelocity(angularVelocity): For angular movement
 * - applyAngularAcceleration(angularAcceleration): For angular movement
 * - update(): This will update the mover location based on velocity, acceleration, angle, 
 *     angularVelocity, angularAcceleration
 * - getLocation(): Returns the current location
 * 
 */
class Mover {
  constructor (location) {
    this._location = location.copy();
    this._velocity = null;
    this._topSpeed = 2;
    this._acceleration = null;

    this._angle = 0;
    this._angularVelocity = 0;
    this._angularAcceleration = 0;
  }

  setLocation(location) {
    this._location = location.copy();
  }

  setVelocity(velocity) {
    this._velocity = velocity.copy();
    this._velocity.limit(this._topSpeed);
  }

  resetVelocity() {
    if (this._velocity != null) this._velocity.mult(0);
  }

  applyAcceleration(acceleration) {
    if (!this._acceleration) {
      this._acceleration = acceleration;
    } else {
      this._acceleration.add(acceleration);
    }
  }

  isMoving() {
    return this._velocity && this._velocity.mag() > 0;
  }

  setTopSpeed(topSpeed) {
    this._topSpeed = topSpeed;
  }

  setAngle(angle) {
    this._angle = angle;
  }

  setAngularVelocity(angularVelocity) {
    this._angularVelocity = angularVelocity;
  }

  applyAngularAcceleration(angularAcceleration) {
    this._angularAcceleration += angularAcceleration;
  }

  update() {
    if (this._acceleration != null) {
      if (this._velocity == null) {
        this._velocity = this._acceleration.copy();
      } else {
        this._velocity.add(this._acceleration);
      }
      this._velocity.limit(this._topSpeed);
    }
    if (this._velocity != null) {
      this._location.add(this._velocity);
      this._angle = this._velocity.heading();
    }

    this._angularVelocity += this._angularAcceleration;
    this._angle += this._angularVelocity;
    
    if (this._acceleration != null) this._acceleration.mult(0);
    this._angularAcceleration = 0;
  }

  getLocation() {
    return this._location.copy();
  }
}