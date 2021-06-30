class QuadtreeImpl extends BaseDataService {

  constructor() {
    super();
    this._tree = new QuadHilighterQT(width/2, height/2, width, height, 5);
    this._sharedObj = {
      currQuadCells: new Set()
    };
    this._tree._sharedObj = this._sharedObj;
    this._tree.minQuadEdge = 10;
    this._treeColor = SketchColor.grey().alpha(0.15).stringify();
    this._queryQuadColor = SketchColor.blend(
      SketchColor.violet(), SketchColor.grey()).alpha(0.6).stringify();
  }

  addLocation(location) {
    this._tree.insert(location._x, location._y, location);
  }

  findLocationsInDB(position, range) {
    this._sharedObj.currQuadCells.clear();
    return this._tree.query(position.x, position.y, range, range);
  }

  resetQuery() {
    super.resetQuery();
    this._sharedObj.currQuadCells.clear();
  }

  render() {
    this._tree.show(this._treeColor);
    super.render();
  }

  renderResults() {
    if (!this._currResults) return;
    for (let quad of this._sharedObj.currQuadCells) {
      quad.render(this._queryQuadColor);
    }
    super.renderResults();
  }

}

/**
 * Only reason why this sub class is created is to highlight the quads with results when queried.
 */
class QuadHilighterQT extends QuadTree {

  constructor (centerX, centerY, treeWidth, treeHeight, capacity) {
    super(centerX, centerY, treeWidth, treeHeight, capacity, true);
  }

  buildTree(centerX, centerY, wd, ht) {
    let qt = new QuadHilighterQT(centerX, centerY, wd, ht, this.capacity, this.onlyLeafItems);
    qt.minQuadEdge = this.minQuadEdge;
    qt._sharedObj = this._sharedObj;
    return qt;
  }

  queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound) {
    let totalPointsFound = pointsFound.length;

    super.queryRecursive(centerX, centerY, rangeWidth, rangeHeight, pointsFound);

    if (totalPointsFound == pointsFound.length) return;
    
    for (let p of this.points) {
      if (this.pointInRange(p.x, p.y, centerX, centerY, rangeWidth, rangeHeight)) {
        this._sharedObj.currQuadCells.add(this);
      }
    }
  }

  render(color) {
    stroke(color);
    strokeWeight(2);
    noFill();
    rect(
      this.x - this.treeWidth/2, this.y - this.treeHeight/2, this.treeWidth, this.treeHeight);
  }

}