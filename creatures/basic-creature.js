class BasicCreature {

  constructor(mover, renderer) {
    this._mover = mover;
    this._renderer = renderer;
  }

  onLocation(location) {
    return p5.Vector.dist(this._mover._location, location) < 5;
  }

  moveTo(location) {
    if (this.onLocation(location)) {
      this._mover.resetVelocity();
      return;
    }
    let dir = this.calculateNormalizedDirection(location);
    dir.mult(this._mover._topSpeed * 0.1);
    this._mover.applyAcceleration(dir);
    this._mover.update();
  }

  calculateNormalizedDirection(location) {
    let dir = p5.Vector.sub(location, this._mover._location);
    dir.normalize();
    return dir;
  }

  render() {
    this._renderer.render(this._mover);
  }

}