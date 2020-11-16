/**
 * Fish is in the top of the food chain in the 'Living World' simulation.
 * They eat worms to replenish their energy. With the energy captured, they swim under water 
 * searching for more worms. And lastly when they have enough energy, they reproduce.
 * For rendering it uses the FinnedRenderer from 'Creatures' sub-project.
 * Fishes start with high energy so that they can sustain prolonged periods of starvation. They 
 * have even higher energy requirement for reproduction to keep the predator population low.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - show(): renders the fish
 * - updateRenderColor(): updates fish specific color that needs to change based on situation
 */
class Fish extends LocomotingActor {

  constructor(world, r, c, fishBuilder) {
    super(world, r, c, Fish.TYPE, 160, 1, fishBuilder);
    this._adultAge = 40;
    this._adultLen = height / world._data.length * 0.8;
    this._childLen = this._adultLen / 2;
    this._renderer = new FinnedRenderer(this._simulateGrowth ? this._childLen : this._adultLen);
    this._creature = new BasicCreature(this._mover, this._renderer);

    this._mainColor = SketchColor.white();
    this.updateRenderColor();
  }

  show() {
    super.show();
    this.updateRenderColor();
    this._creature.render();
  }

  updateRenderColor() {
    this._renderer._strokeColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._fillColor = this._mainColor.alpha(this._renderAlpha).stringify();
  }
}

Fish.TYPE = "fish";