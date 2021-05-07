class RinzlerCycle extends LightCycle {

  constructor(id, start, direction, grid, maxSpeed) {
    super(id, start, direction, SketchColor.red(), grid, maxSpeed);
  }

  checkIfCollision() {
    this._currentGridR = this._grid.getTileRowIndex(this._current);
    this._currentGridC = this._grid.getTileColIndex(this._current);
    return !this._grid.isTileFree(this._currentGridR, this._currentGridC) 
      && this._grid.getTileOccupiedBy(this._currentGridR, this._currentGridC) != this._id;
  }

  updateMoveOnGrid() {
    if (this._currentGridR != this._previousGridR || this._currentGridC != this._previousGridC) {
      this._grid.setTileOccupiedBy(this._previousGridR, this._previousGridC, this._id);
      this._previousGridR = this._currentGridR;
      this._previousGridC = this._currentGridC;
    }
  }

}