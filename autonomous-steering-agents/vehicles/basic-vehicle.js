class BasicVehicle {
  
  constructor(x, y, color = SketchColor.white().stringify(), size = 10, 
  velocity = createVector(0, 0), acceleration = createVector(0, 0), 
  maxSpeed = 10, maxForce = 0.5) {
    this._position = createVector(x, y);
    this._color = color;
    this._size = size;
    this._velocity = velocity;
    this._acceleration = acceleration;
    this._maxSpeed = maxSpeed;
    this._maxForce = maxForce;
  }

  get position() { return this._position; }
  set position(value) { this._position = value; }
  get velocity() { return this._velocity; }
  set velocity(value) { this._velocity = value; }
  get size() { return this._size; }
  set size(value) { this._size = value; }
  get maxSpeed() { return this._maxSpeed; }
  set maxSpeed(value) { this._maxSpeed = value; }
  get maxForce() { return this._maxForce; }
  set maxForce(value) { this._maxForce = value; }

  resetVelocity() {
    this._velocity = p5.Vector.random2D();
    this._velocity.mult(this._maxSpeed);
    this._velocity.limit(this._maxSpeed);
  }

  addStrategy(strategy) {
    this._strategy = strategy;
  }

  act() {
    let force = this._strategy.run(this);
    this._acceleration.add(force);
  }

  update() {
    this._velocity.add(this._acceleration);
    this._velocity.limit(this._maxSpeed);
    this._position.add(this._velocity);
    this.restrict();
    this._acceleration.set(0, 0);
  }

  show() {
    strokeWeight(1);
    stroke(this._color);
    strokeWeight(1);
    fill(this._color);
    push();
    translate(this._position.x, this._position.y);
    rotate(this._velocity.heading());
    triangle(-this._size, -this._size / 2, -this._size, this._size / 2, this._size, 0);
    pop();
  }

  restrict() {
    if (this._position.x > width + this._size) {
      this._position.x = -this._size/2;
    } else if (this._position.x < -this._size) {
      this._position.x = width + this._size/2;
    }
    if (this._position.y > height + this._size) {
      this._position.y = -this._size/2;
    } else if (this._position.y < -this._size) {
      this._position.y = height + this._size/2;
    }
  }

}