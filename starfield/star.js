class Star {
  constructor() {
    this._warp = false;
    this.reset();
  }

  reset() {
    this._x = random(-height/2,height/2);
    this._y = random(-height/2,height/2);
    this._z = random(height/2);
    this._pz = this._z;
    this.setSpeed();
  }

  update() {
    this._z = this._z - this._speed;
    if (this._z <= 1) this.reset();
  }

  toggleWarp() {
    this._warp = !this._warp;
    this._pz = this._z;
    this.setSpeed();
  }

  setSpeed() {
    this._speed = (!this._warp ? random(1,2) : random(4,5));
  }

  show() {
    noStroke();
    fill(SketchColor.white().stringify());
    let currX = map(this._x/this._z, 0, 1, 0, height/2);
    let currY = map(this._y/this._z, 0, 1, 0, height/2);
    let r = map(this._z, 0, height/2, 10, 0);
    circle(currX, currY, r);

    if (this._warp) {
      let prevX = map(this._x/this._pz, 0, 1, 0, height/2);
      let prevY = map(this._y/this._pz, 0, 1, 0, height/2);
      fill(SketchColor.white().alpha50().stringify());
      triangle(prevX, prevY, currX, currY-r/2, currX, currY+r/2);
    }
  }
}