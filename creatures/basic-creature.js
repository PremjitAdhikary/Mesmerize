/**
 * Composite class which takes in a mover and a renderer to rnder a creature moving around.
 * 
 * Constructor:
 * - mover: The mover to delegate all the locomotion.
 * - renderer: The renderer to render the creature.
 * 
 * Other Methods:
 * - onLocation(location): returns whether the creature has reached location or not.
 * - moveTo(location): If the creature is not already on the location, move to it.
 * - render(): passes the mover to the renderer and renders the creature.
 * 
 */
class BasicCreature {

  constructor(mover, renderer) {
    this._mover = mover;
    this._renderer = renderer;
  }

  onLocation(location) {
    return p5.Vector.dist(this._mover._location, location) < this._renderer._len/2;
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