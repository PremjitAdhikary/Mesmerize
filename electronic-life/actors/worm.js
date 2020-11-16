/**
 * Worm is for the 'Living World' simulation.
 * Worms get thier energy by eating lily. With the energy captured, they swim on water searching 
 * for more lily. And lastly when they have enough energy, they reproduce.
 * For rendering it uses the GlideRenderer from 'Creatures' sub-project.
 * Worms start with somewhat medium energy and have medium energy requirements for reproduction so 
 * that they can reproduce more often.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - show(): renders the worm
 * - updateRenderColor(): updates worm specific color that needs to change based on situation
 */
class Worm extends LocomotingActor {

  constructor(world, r, c, wormBuilder) {
    super(world, r, c, Worm.TYPE, 25, 0.8, wormBuilder);
    this._adultAge = 20;
    this._adultLen = height / world._data.length * 0.4;
    this._childLen = this._adultLen / 2;
    this._renderer = new GlideRenderer(this._simulateGrowth ? this._childLen : this._adultLen);
    this._creature = new BasicCreature(this._mover, this._renderer);

    this._mainColor = SketchColor.blue();

    this.updateRenderColor();
  }

  show() {
    super.show();
    this._creature.render();
    if (this._mover.isMoving()) {
      this._world.ripple(this._mover._location.x, this._mover._location.y);
    }
  }

  updateRenderColor() {
    this._renderer._strokeColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._fillColor = this._mainColor.alpha(this._renderAlpha).stringify();
  }

}

Worm.TYPE = "worm";