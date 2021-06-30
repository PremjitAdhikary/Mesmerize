class BaseDataService {

  constructor() {
    this._queryColor = SketchColor.white().alpha(0.6).stringify();
    this._resultColor = 0;
  }

  findLocations(position, range) {
    this._currQuery = { x: position.x, y: position.y, range };
    this._currResults = this.findLocationsInDB(position, range);
    return this._currResults;
  }

  findLocationsInDB(position, range) {
    // implement
    return [];
  }

  resetQuery() { this._currQuery = null; }

  render() {
    if (this._currQuery) {
      fill(this._queryColor);
      noStroke();
      rect(this._currQuery.x - this._currQuery.range/2, this._currQuery.y - this._currQuery.range/2, 
        this._currQuery.range, this._currQuery.range);
    }
  }

  renderResults() {
    if (!this._currResults) return;
    stroke(this._resultColor);
    strokeWeight(1);
    noFill();
    for (let result of this._currResults) {
      circle(result._x, result._y, 8);
    }
  }
}