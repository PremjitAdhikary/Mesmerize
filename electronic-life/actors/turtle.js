/**
 * Turtle is another 'Moving World' actor. It's movement (swimming) is restricted to shallow 
 * waters only! Slow!
 * Just like flies, turtles generate thier energy similar to plant.
 * For rendering it uses the LimbedRenderer from 'Creatures' sub-project.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - show(): renders the turtle
 * - updateRenderColor(): updates turtle specific color that needs to change based on situation
 * - dayUpdated(): is a internal function called to initiate a ripple in the base world.
 */
class Turtle extends LocomotingActor {

  constructor(world, r, c, turtleBuilder) {
    super(world, r, c, Turtle.TYPE, 10, 0.3, turtleBuilder);
    this._adultAge = 40;
    this._adultLen = height / world._data.length * 0.6;
    this._childLen = this._adultLen / 2;
    this._renderer = new LimbedRenderer(this._simulateGrowth ? this._childLen : this._adultLen);
    this._creature = new BasicCreature(this._mover, this._renderer);
    
    this._mainColor = SketchColor.grey();
    this._bodyColor = SketchColor.green();

    this.updateRenderColor();
  }

  show() {
    super.show();
    this._creature.render();
  }

  updateRenderColor() {
    this._renderer._strokeColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._bodyColor = this._bodyColor.alpha(this._renderAlpha).stringify();
    this._renderer._headColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._limbColor = this._mainColor.alpha(this._renderAlpha).stringify();
  }

  dayUpdated() {
    super.dayUpdated();
    if (this._mover.isMoving()) {
      this._world.ripple(this._mover._location.x, this._mover._location.y);
    }
  }
}

Turtle.TYPE = "turtle";