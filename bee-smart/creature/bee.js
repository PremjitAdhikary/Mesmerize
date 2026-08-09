class Bee {
  constructor(start, dna) {
    this._position = createVector(start._x, start._y);
    this._velocity = createVector(0, 0);
    this._acceleration = createVector(0, 0);
    this._mover = new MoverAdaptor(this);
    this._renderer = new WingedRenderer(15);
    this._renderer._strokeColor = greenyellow;
    this._renderer._appendageColor = greenyellow;
    this._renderer._eyeColor = greenyellow;
    this._renderer._wingColor = greenyellowTransparent;
    this._renderer._fillColor = greenyellow;
    this._targetReached = false;
    this._escaped = false;
    this._crashed = false;
    this._active = true;
    this._path = [];

    this._dna = dna;
    this._moves = 0;
  }

  get x() { return this._position.x };
  get y() { return this._position.y };

  show() {
    this._renderer.render(this._mover);
  }

  showPathTaken() {
    strokeWeight(2);
    stroke(violet);
    noFill();
    beginShape();
    this._path.forEach(v => vertex(v.x, v.y));
    endShape();
  }

  fly() {
    if (!this._active) return;
    this.applyForce();
    this._position.add(this._velocity);
    this._path.push({ x: this._position.x, y: this._position.y });
    if (this.hasEscaped()) {
      this._active = false;
      this._escaped = true;
    }
  }

  applyForce() {
    this._acceleration.mult(0);
    this._acceleration.add(this._dna._genes[this._moves++]);
    this._velocity.add(this._acceleration);
    this._velocity.limit(Bee.VELOCITY_LIMIT);
  }

  reachedTarget() {
    this._active = false;
    this._targetReached = true;
  }

  hasCrashed() {
    this._active = false;
    this._crashed = true;
  }

  hasEscaped() {
    return this._position.x < -10 || this._position.x > width+10 || this._position.y < -10 || this._position.y > height+10;
  }
}

Bee.VELOCITY_LIMIT = 5;