class Grid {

  constructor(tileSize) {
    this._debugOn = false;
    this._tileSize = tileSize;
    this._floorCellSize = 40;
    this._gridFloor = new GridFloor();
    this._lineColor = SketchColor.white().alpha(.2).stringify();
    this._debugLineColor = SketchColor.white().alpha(.2).stringify();
    this.setupFloor();
  }

  setupFloor() {
    this._rows = height/this._tileSize;
    this._cols = width/this._tileSize;
    this._floor = create2DArray(this._rows, this._cols);
    forEach2DArray(this._floor, (v,r,c) => this._floor[r][c] = 0);
    for (let i=0; i<this._cols; i++) {
      this._floor[0][i] = -1;
      this._floor[this._rows-1][i] = -1;
    }
    for (let i=0; i<this._rows; i++) {
      this._floor[i][0] = -1;
      this._floor[i][this._cols-1] = -1;
    }
  }

  show() {
    noStroke();
    this.showFloor();

    if (this._debugOn) {
      this.showOccupiedCells();
      this.showDebugFloor();
    }
  }

  showFloor() {
    this._gridFloor.show();
  }

  showDebugFloor() {
    fill(this._debugLineColor);
    stroke(this._debugLineColor);
    strokeWeight(1);
    for (let i=1; i<this._rows; i++) {
      line(0, i*this._tileSize, width, i*this._tileSize);
    }
    for (let i=1; i<this._cols; i++) {
      line(i*this._tileSize, 0, i*this._tileSize, height);
    }
  }

  showOccupiedCells() {
    stroke(this._lineColor);
    strokeWeight(1);
    fill(this._lineColor);
    forEach2DArray(this._floor, (v,r,c) => {
      if (v != 0) {
        square(c * this._tileSize, r * this._tileSize, this._tileSize);
      }
    });
  }

  getTileRowIndex(locationVector) {
    return Math.floor(locationVector.y / this._tileSize);
  }

  getTileColIndex(locationVector) {
    return Math.floor(locationVector.x / this._tileSize);
  }

  isTileFree(r, c) {
    if (r < 0 || c < 0 || r >= this._rows || c >= this._cols) return false;
    return this._floor[r][c] === 0;
  }

  getTileOccupiedBy(r, c) {
    return this._floor[r][c];
  }

  setTileOccupiedBy(r, c, v) {
    if (this._floor[r][c] == 0)
      this._floor[r][c] = v;
  }

  removeOccupiedCellsForCycle(id) {
    forEach2DArray(this._floor, (v,r,c) => {
      if (v === id) {
        this._floor[r][c] = 0;
      }
    });
  }
}