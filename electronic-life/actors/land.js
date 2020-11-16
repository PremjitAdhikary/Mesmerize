/**
 * To depict the land tile in the world. This has no other purpose but to sit in the world grid.
 * Event the show() method is not there as this is already pre rendered in Electronic 
 * Environment.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 */
class Land extends WorldActor {
  constructor(world, r, c) {
    super(world, r, c, Land.TYPE);
  }

  dayUpdated() {
    // dummy
  }
}

Land.TYPE = 'land';