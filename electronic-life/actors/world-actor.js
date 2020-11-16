/**
 * The base for all actors in this world
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - type: type of the actor
 * 
 * Other Methods:
 * - show(): renders the actor. This needs to be overridden by the sub classes
 * - type(): returns the type of the actor
 */
class WorldActor {

  constructor(world, r, c, type) {
    this._world = world;
    this._r = r;
    this._c = c;
    this._type = type;

    this._world.register(this, r, c);
  }

  show() {
    // override in sub classes to render the actor
  }

  type() {
    return this._type;
  }

}