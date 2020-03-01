class Mover {
  constructor (location) {
    this._location = location;
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
    return this._velocity.mag() > 0;
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