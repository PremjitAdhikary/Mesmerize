/**
 * Lily depicts plant life. It doesnt move around. 
 * A typical plant that 'grows' to energize itself (think photosynthesis).
 * Spreads around its seeds to reproduce.
 * For aethestic values, since it doesnt move around, has diff colors for its and numbers of 
 * its petals selected at construction. Sways a little for some animated effect.
 * Also at birth, the lily is just its bud, and as days go by, it enlarges ito its full form.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * - plantBuilder: builder for its offspring
 * 
 * Other Methods:
 * - pickAColor(): Mmethod to be invoked internally by constructor to select petal color
 * - updateRenderer(): update the colors based on alpha
 * - show(): renders the lily
 * - render(): internal method which does the actual rendering
 * - getLocation(): returns the vector of the lily
 */
class Lily extends LivingActor {
  
  constructor(world, r, c, plantBuilder) {
    super(world, r, c, Lily.TYPE, random([10,15,20]), plantBuilder);
    let cellSize = height / world._data.length;
    this._adultAge = 10;
    this._center = this._world.convertCoordinateToPixel(this._r, this._c);
    this._center.add(random(-cellSize/4, cellSize/4), random(-cellSize/4,cellSize/4));
    this._petalSize = Math.floor(cellSize/5);
    this._petals = random([3,4,5]);
    this._currCenter = this._center.copy();
    this._centerOffsetAngle = 0;
    this._centerOffsetAngleIncr = 0.2;

    this._petalColor = this.pickAColor();
    this._budColor = new SketchColor(139,69,19);
    this._petalColorStringified = this._petalColor.stringify();
    this._budColorStringified = this._budColor.stringify();
  }

  pickAColor() {
    return random([
      SketchColor.white(),
      SketchColor.blend(SketchColor.violet(), SketchColor.white()),
      SketchColor.yellow(),
      SketchColor.red(),
      SketchColor.greenyellow()
    ]);
  }

  updateRenderer() {
    this._petalColorStringified = this._petalColor.alpha(this._renderAlpha).stringify();
    this._budColorStringified = this._budColor.alpha(this._renderAlpha).stringify();
  }

  show() {
    super.show();
    if (!this.isAlive()) 
      this.updateRenderer();
    this.render();
  }

  render() {
    let y = map(sin(this._centerOffsetAngle), -1, 1, -2, 2);
    this._currCenter = this._center.copy();
    this._currCenter.add(0, y);
    let petalSize = this._simulateGrowth && this.isChild() ? 
      Math.min(this._petalSize, this._petalSize * this._daysOld / this._adultAge) : this._petalSize;

    let petalDist = Math.ceil(this._petalSize/2);
    for (let i=0; i<this._petals; i++) {
      let v = createVector(petalDist,0);
      v.rotate(-(HALF_PI+(TWO_PI*i/this._petals)));
      v.add(this._currCenter);
      strokeWeight(petalSize);
      stroke(this._petalColorStringified);
      point(v.x, v.y);
    }
    strokeWeight(this._petalSize);
    stroke(this._budColorStringified);
    point(this._currCenter.x, this._currCenter.y);
    this._centerOffsetAngle -= this._centerOffsetAngleIncr;
  }

  getLocation() {
    return this._currCenter.copy();
  }
  
}

Lily.TYPE = 'lily';