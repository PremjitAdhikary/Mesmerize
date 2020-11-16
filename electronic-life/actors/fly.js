/**
 * Fly flies around the world from land tile to land tile. It can travel over more than 1 tile 
 * at a time. But needs rest every flight.
 * In the 'Moving World' simulation, flies generate thier energy similar to plant, by Growing. I 
 * know 'Thats not natural', but for simplicity purpose, that's how it is.
 * For rendering it uses the WingedRenderer from 'Creatures' sub-project.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - builder: builder for its offspring
 * 
 * Other Methods:
 * - show(): renders the fly
 * - updateRenderColor(): updates fly specific color that needs to change based on situation
 */
class Fly extends LocomotingActor {

  constructor(world, r, c, flyBuilder) {
    super(world, r, c, Fly.TYPE, 15, 2.5, flyBuilder);
    this._adultAge = 10;
    this._adultLen = height / world._data.length * 0.6;
    this._childLen = this._adultLen / 2;
    this._renderer = new WingedRenderer(this._simulateGrowth ? this._childLen : this._adultLen);
    this._creature = new BasicCreature(this._mover, this._renderer);

    this._mainColor = SketchColor.blue();
    this._eyeColor = SketchColor.red();
    this._wingColor = SketchColor.grey();

    this.updateRenderColor();
  }

  show() {
    super.show();
    this._creature.render();
  }

  updateRenderColor() {
    this._renderer._strokeColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._appendageColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._eyeColor = this._eyeColor.alpha(this._renderAlpha).stringify();
    this._renderer._fillColor = this._mainColor.alpha(this._renderAlpha).stringify();
    this._renderer._wingColor = this._wingColor.alpha(this._renderAlpha/2).stringify();
  }

}

Fly.TYPE = "fly";