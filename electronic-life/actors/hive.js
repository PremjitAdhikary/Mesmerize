/**
 * Another non-living tile but with a purpose.
 * 
 * Constructor:
 * - world: the world in which this actor will be registered
 * - r: row of this actor in the world grid
 * - c: col of this actor in the world grid
 * 
 * Other Methods:
 * - buildHiveCells(): internal method to mark the 8 cells around the center cell
 * - initHiveRenderer(): internal method to ready the renderer for the honeycomb
 * - addPollinator(pollinator): adds a pollinator to the hive in one of its cell in a round robin 
 *     manner
 * - addQueen(queen): self explanatory
 * - dayUpdated(): gets invoked everytime a day passes in the world
 * - energize(): sharing is caring
 * - depositNectar(nectar): Convert nectar to energy here
 * - show(): render the hive
 * - calculateStrokeWeight(): calculate stroke weight according to collected energy
 * 
 * Static Methods:
 * - checkIfLocationSuitable(): A method to check if a particular co-ordinate is suitable for 
 *     installing a hive
 */
class Hive extends WorldActor {

  constructor(world, r, c) {
    super(world, r, c, Hive.TYPE);
    this._cells = [];
    this.buildHiveCells();
    this.initHiveRenderer();
    this._pollinatorsInHive = [];
    this._collectedEnergy = 0;
    this._enableEnergize = false;
    this._maxPollinatorsInHive = 8;
    this._energyToPollinators = 8;
  }

  buildHiveCells() {
    this._cellMap = new Map();
    this._cellMap.set('nw', createVector(this._r-1, this._c-1));
    this._cellMap.set('n', createVector(this._r-1, this._c));
    this._cellMap.set('ne', createVector(this._r-1, this._c+1));
    this._cellMap.set('e', createVector(this._r, this._c+1));
    this._cellMap.set('se', createVector(this._r+1, this._c+1));
    this._cellMap.set('s', createVector(this._r+1, this._c));
    this._cellMap.set('sw', createVector(this._r+1, this._c-1));
    this._cellMap.set('w', createVector(this._r, this._c-1));
  }

  initHiveRenderer() {
    let side = 10;
    let fillColor = (new SketchColor(217, 135, 33)).stringify();
    let center = this._world.convertCoordinateToPixel(this._r, this._c);
    let definitelyRender = [
      center, 
      createVector(center.x - side*2, center.y), 
      createVector(center.x + side*2, center.y),
      createVector(center.x + side, center.y - side*1.8), 
      createVector(center.x - side, center.y - side*1.8),
      createVector(center.x + side, center.y + side*1.8),
      createVector(center.x - side, center.y + side*1.8)
    ];
    definitelyRender.forEach(v => this._cells.push(new NGonUnit(v.x, v.y, 6, side, fillColor, true)));
    let randomlyRender = [
      createVector(center.x - side*4, center.y),
      createVector(center.x + side*4, center.y),
      createVector(center.x + side*3, center.y - side*1.8),
      createVector(center.x - side*3, center.y - side*1.8),
      createVector(center.x + side*3, center.y + side*1.8),
      createVector(center.x - side*3, center.y + side*1.8),
      createVector(center.x, center.y - side*3.5),
      createVector(center.x - side*2, center.y - side*3.5),
      createVector(center.x + side*2, center.y - side*3.5),
      createVector(center.x, center.y + side*3.5),
      createVector(center.x - side*2, center.y + side*3.5),
      createVector(center.x + side*2, center.y + side*3.5),
    ];
    randomlyRender.forEach(v => {
      if (random() > 0.5) this._cells.push(new NGonUnit(v.x, v.y, 6, side, fillColor, true));
    });
  }

  addPollinator(pollinator) {
    if (this._pollinatorsInHive.length >= this._maxPollinatorsInHive) return false;
    pollinator._hive = this;
    pollinator._hiveCell = Hive.CellNames[this._pollinatorsInHive.length % Hive.CellNames.length];
    this._pollinatorsInHive.push(pollinator);
    let coordinate = this._cellMap.get(pollinator._hiveCell);
    let homeXY = this._world.convertCoordinateToPixel(coordinate.x, coordinate.y);
    pollinator._mover.setLocation(homeXY);
    pollinator.updateLocationOnWorld(coordinate);
    pollinator.homeCoordinate = () => homeXY;
    this._currentPollinatorsInHive++;
    return true;
  }

  addQueen(queen) {
    this._queen = queen;
    queen._hive = this;
    let homeXY = this._world.convertCoordinateToPixel(this._r, this._c)
    queen._mover.setLocation(homeXY);
    queen.updateLocationOnWorld(createVector(this._r, this._c));
    queen.homeCoordinate = () => homeXY;
  }

  dayUpdated() {
    if (this._enableEnergize && this._pollinatorsInHive.every(p => p.atHome())) {
      this.energize();
      this._enableEnergize = false;
    }
  }

  /**
   * Distributes the collected nectar as energy to the inhabitants of the hive.
   * After distributing to the pollinators (making sure that the hive collected energy never goes 
   * down below 50% while doing so), the half of the rest is given to the Queen
   */
  energize() {
    let energized = 0;
    for (let pollinator of this._pollinatorsInHive) {
      if (this._collectedEnergy - this._energyToPollinators < this._collectedEnergy / 2) break;
      pollinator._energy += this._energyToPollinators;
      energized++;
    }
    this._collectedEnergy -= (this._energyToPollinators * energized);
    if (!this._queen._state) {
      this._queen._energy += this._collectedEnergy/2;
      this._collectedEnergy -= this._collectedEnergy/2;
    }
  }

  depositNectar(nectar) {
    this._collectedEnergy += nectar/1.5;
    this._enableEnergize = true;
  }

  show() {
    this._cells.forEach(cell => {
      cell.show();
      stroke(SketchColor.gold().stringify());
      strokeWeight(this.calculateStrokeWeight());
      point(cell._x, cell._y);
    });
  }

  calculateStrokeWeight() {
    for (let i=Hive._collectedToStrokeWeight.length; i>0; i--) {
      if (this._collectedEnergy >= Hive._collectedToStrokeWeight[i-1]) 
        return i;
    }
    return 0;
  }

}

Hive.TYPE = 'hive';

Hive.checkIfLocationSuitable = (world, r, c) => {
  let env = world._electronicEnvironment._envData;
  if (r-1 < 0 || c-1 < 0 || r+1 >= env.length || c+1 >= env[0].length) return false;
  for (let a=r-1; a<=r+1; a++) {
    for (let b=c-1; b<=c+1; b++) {
      if (env[a][b] != ElectronicEnvironment.LAND_CHAR) 
        return false;
    }
  }
  return true;
}

Hive.CellNames = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

Hive._collectedToStrokeWeight = [10, 20, 40, 75, 125, 200, 300, 500, 750, 1000, 1400, 2000];