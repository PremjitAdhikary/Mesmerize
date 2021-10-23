class BouncingTarget extends DummyTarget {

  constructor(x, y) {
    super(x, y);
    this.udpateMaxSpeed(5);
  }

  show() {
    super.show();
    this.update();
  }

  update() {
    this._position.add(this._velocity);
    this.restrict();
  }

  udpateMaxSpeed(maxSpeed) {
    this._maxSpeed = maxSpeed;
    this._velocity = p5.Vector.random2D();
    this._velocity.mult(this._maxSpeed);
    this._velocity.limit(this._maxSpeed);
  }

  restrict() {
    if (this._position.x > width || this._position.x < 0) {
      let n = createVector(-30, 0);
      this._velocity.reflect(n);
    }
    if (this._position.y > height || this._position.y < 0) {
      let n = createVector(0, -30);
      this._velocity.reflect(n);
    } 
  }

}