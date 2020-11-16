/**
 * Base class for all Actors which move around.
 * Utilzes the Mover class from 'Creatures' sub-project for all locomotion.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - type: type of the actor
 * - energy: initial energy of the actor
 * - topSpeed: top speed with which the actor can move around the world
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - moveTo(target): instruction to move to target, this is pixel location
 * - onLocation(target): returns true if on target location, this is pixel location
 * - updateLocationOnWorld(loc): updates cell coordinates in the world object for the actor, this 
 *     is not pixel location
 * - updateCurrentLocationOnWorld(): updates cell coordinates in the world object for the actors 
 *     current location
 * - getLocation(): returns the vector of the actor
 * - show(): renders the moving actor
 * - updateRenderColor(): dummy method to be overridden by sub class. Basically this should update 
 *     any actor specific color that needs to change based on situation (here Death)
 */
class LocomotingActor extends LivingActor {

  constructor(world, r, c, type, energy, topSpeed, builder) {
    super(world, r, c, type, energy, builder);
    this._mover = new Mover(this._world.convertCoordinateToPixel(this._r, this._c));
    this._prevC = -1;
    this._prevC = -1;
    this._mover.setTopSpeed(topSpeed);
  }

  moveTo(target) {
    this._creature.moveTo(target);
  }

  onLocation(target) {
    return this._creature.onLocation(target);
  }

  updateLocationOnWorld(loc) {
    this._world.updateRegister(this, this._r, this._c, loc.x, loc.y);
    this._prevR = this._r;
    this._prevC = this._c;
    this._r = loc.x;
    this._c = loc.y;
  }

  updateCurrentLocationOnWorld() {
    let loc = this._world.convertPixelToCoordinate(this.getLocation());
    this.updateLocationOnWorld(loc);
  }

  getLocation() {
    return this._mover.getLocation();
  }

  show() {
    if (this._simulateGrowth && this.isChild()) {
      this._renderer._len = Math.min(
        this._adultLen, 
        this._childLen + (this._adultLen - this._childLen) * this._daysOld / this._adultAge);
    } else {
      this._renderer._len = this._adultLen;
    }
    if (!this.isAlive())
      this.updateRenderColor();
  }

  updateRenderColor() {
    // override
  }

}