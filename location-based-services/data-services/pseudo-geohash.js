class PseudoGeoHash extends BaseDataService {

  constructor(maxLevel = 5) {
    super();
    this._maxLevel = maxLevel;
    this._geoMap = new Map();
    this._root = new GeoCell('', 0, this._maxLevel, createVector(0,0), createVector(width, height));
    this.setupGeoCells(this._root);
    this.setupGeoRangeQuery();

    this._geoHashColor = SketchColor.grey().alpha(0.08).stringify();
    this._queryCellColor = SketchColor.blend(
      SketchColor.violet(), SketchColor.grey()).alpha(0.6).stringify();
  }

  setupGeoCells(parent) {
    let children = parent.spawnChildren();
    children.forEach(c => {
      this._geoMap.set(c._hash, c);
      this.setupGeoCells(c);
    });
    this._cellWidths = [width];
    this._cellHeights = [height];
    for (let level = 1; level <= this._maxLevel; level++) {
      this._cellWidths.push(this._cellWidths[level-1]/2);
      this._cellHeights.push(this._cellHeights[level-1]/2);
    }
  }

  setupGeoRangeQuery() {
    let me = this;
    let getItemsForCellAndNeighbors = level => (loc) => {
      let cell = me._geoMap.get(this.hash(loc, level));
      me._currQueryCells = [cell];
      let allItems = me.items(cell._hash);
      cell.neighbors.forEach( n => {
        this._currQueryCells.push(me._geoMap.get(n));
        allItems = [...allItems, ...me.items(n)];
      } );
      return allItems;
    };
    let minRanges = width > height ? this._cellHeights : this._cellWidths;
    this._rangeMap = new Map();
    for (let l = this._maxLevel; l > 0; l--) {
      this._rangeMap.set(minRanges[l]*3, getItemsForCellAndNeighbors(l));
    }
    this._rangeKeys = [...this._rangeMap.keys()].sort( (a, b) => a - b );
  }

  items(cellHash) {
    let cell = this._geoMap.get(cellHash);
    if (cell.isLeaf) 
      return cell._items;
    let allItems = [];
    for (let childHash of cell.children) 
      allItems = allItems.concat(this.items(childHash));
    return allItems;
  }

  addLocation(location) {
    let h = this.hash(createVector(location._x, location._y));
    this._geoMap.get(h)._items.push(location);
    location._hash = h;
  }

  deleteLocation(location) {
    let geoLoc = this._geoMap.get(location._hash);
    if (!geoLoc) return;
    let index = geoLoc._items.indexOf(location);
    if (index > -1) {
      geoLoc._items.splice(index, 1);
    }
    location._hash = '';
  }

  updateLocation(location) {
    this.deleteLocation(location);
    this.addLocation(location);
  }

  findLocationsInDB(position, range) {
    let i = 0;
    while(this._rangeKeys[i] < range) i++;
    return this._rangeMap.get(this._rangeKeys[i])(position)
      .filter( loc => 
        loc._x >= (position.x - range/2) && loc._x <= (position.x + range/2) 
        && loc._y >= (position.y - range/2) && loc._y <= (position.y + range/2)
      );
  }

  hash(location, level = this._maxLevel) {
    let chars = ['a', 'b', 'c', 'd'];
    let minX = 0, minY = 0, maxX = width, maxY = height;
    let hash = '';
    for (let i = 0; i < level; i++) {
      let halfX = (maxX - minX) / 2, halfY = (maxY - minY) / 2;
      let x = minX + halfX > location.x ? 0 : 1;
      let y = minY + halfY > location.y ? 0 : 1;
      hash += chars[y*2 + x];
      minX = x == 0 ? minX : minX + halfX;
      minY = y == 0 ? minY : minY + halfY;
      maxX = x == 0 ? minX + halfX : maxX;
      maxY = y == 0 ? minY + halfY : maxY;
    }
    return hash;
  }

  resetQuery() {
    super.resetQuery();
    this._currQueryCells = null;
  }

  render() {
    stroke(this._geoHashColor);
    strokeWeight(1);
    let divisions = 2;
    for (let level = 1; level <= this._maxLevel; level++) {
      for (let c = 1; c < divisions; c++) 
        line(c * this._cellWidths[level], 0, c * this._cellWidths[level], height);
      for (let r = 1; r < divisions; r++) 
        line(0, r * this._cellHeights[level], width, r * this._cellHeights[level]);
      divisions *= 2;
    }
    super.render();
  }

  renderResults() {
    if (!this._currQuery) return;
    stroke(this._queryCellColor);
    noFill();
    for (let cell of this._currQueryCells) {
      cell.render(this._queryCellColor);
    }
    super.renderResults();
  }

}

/**
 *  a  |  b
 * ---------
 *  c  |  d
 * 
 */
class GeoCell {

  constructor(hash, level, maxLevel, topLeft, bottomRight) {
    this._hash = hash;
    this._level = level;
    this._tl = topLeft;
    this._br = bottomRight;
    this._maxLevel = maxLevel;
    this._items = [];
  }

  get isLeaf() { return this._hash.length == this._maxLevel }
  get hasChildren() { return !this.isLeaf }
  child(h) { return this.hasChildren ? this._hash + h : null }
  get a() { return this.child('a') }
  get b() { return this.child('b') }
  get c() { return this.child('c') }
  get d() { return this.child('d') }
  get children() { return this.hasChildren ? [this.a, this.b, this.c, this.d] : [] }

  spawnChildren() {
    let children = [];
    if (this.isLeaf) {
      return children;
    };
    children.push(this.spawnChild('a', this._tl.x, this._tl.y, this._tl.x + (this._br.x - this._tl.x)/2, 
      this._tl.y + (this._br.y - this._tl.y)/2));
    children.push(this.spawnChild('b', this._tl.x + (this._br.x - this._tl.x)/2, this._tl.y, this._br.x, 
      this._tl.y + (this._br.y - this._tl.y)/2));
    children.push(this.spawnChild('c', this._tl.x, this._tl.y + (this._br.y - this._tl.y)/2, 
      this._tl.x + (this._br.x - this._tl.x)/2, this._br.y));
    children.push(this.spawnChild('d', this._tl.x + (this._br.x - this._tl.x)/2, 
      this._tl.y + (this._br.y - this._tl.y)/2, this._br.x, this._br.y));
    return children;
  }

  spawnChild(child, tlx, tly, brx, bry) {
    return new GeoCell(
      this._hash + child, this._level + 1, this._maxLevel, createVector(tlx, tly), createVector(brx, bry)
    );
  }

  render(color) {
    stroke(color);
    strokeWeight(2);
    noFill();
    rect(this._tl.x, this._tl.y, this._br.x - this._tl.x, this._br.y - this._tl.y);
  }

  /**
   *  nw | n | ne
   * -------------
   *   w |   | e
   * -------------
   *  sw | s | se
   */

  get neighbors() {
    return [this.n, this.ne, this.e, this.se, this.s, this.sw, this.w, this.nw].filter(e => e);
  }

  ifValueThen = ( x, func ) => x ? func(x) : x;

  get n() { return this.north(this._hash) }
  north(hash) {
    if (!hash) return '';
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return this.ifValueThen(this.north(parentHash), pn => pn + 'c');
      case 'b': return this.ifValueThen(this.north(parentHash), pn => pn + 'd');
      case 'c': return parentHash + 'a';
      case 'd': return parentHash + 'b';
    }
  }

  get s() { return this.south(this._hash) }
  south(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return parentHash + 'c';
      case 'b': return parentHash + 'd';
      case 'c': return this.ifValueThen(this.south(parentHash), ps => ps + 'a');
      case 'd': return this.ifValueThen(this.south(parentHash), ps => ps + 'b');
    }
  }

  get e() { return this.east(this._hash) }
  east(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return parentHash + 'b';
      case 'b': return this.ifValueThen(this.east(parentHash), pe => pe + 'a');
      case 'c': return parentHash + 'd';
      case 'd': return this.ifValueThen(this.east(parentHash), pe => pe + 'c');
    }
  }

  get w() { return this.west(this._hash) }
  west(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return this.ifValueThen(this.west(parentHash), pw => pw + 'b');
      case 'b': return parentHash + 'a';
      case 'c': return this.ifValueThen(this.west(parentHash), pw => pw + 'd');
      case 'd': return parentHash + 'c';
    }
  }

  get nw() { return this.northWest(this._hash) }
  northWest(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return this.ifValueThen(this.northWest(parentHash), pnw => pnw + 'd');
      case 'b': return this.ifValueThen(this.north(parentHash), pn => pn + 'c');
      case 'c': return this.ifValueThen(this.west(parentHash), pw => pw + 'b');
      case 'd': return parentHash + 'a';
    }
  }

  get sw() { return this.southWest(this._hash) }
  southWest(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return this.ifValueThen(this.west(parentHash), pw => pw + 'd');
      case 'b': return parentHash + 'c';
      case 'c': return this.ifValueThen(this.southWest(parentHash), psw => psw + 'b');
      case 'd': return this.ifValueThen(this.south(parentHash), ps => ps + 'a');
    }
  }

  get ne() { return this.northEast(this._hash) }
  northEast(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return this.ifValueThen(this.north(parentHash), pn => pn + 'd');
      case 'b': return this.ifValueThen(this.northEast(parentHash), pne => pne + 'c');
      case 'c': return parentHash + 'b';
      case 'd': return this.ifValueThen(this.east(parentHash), pe => pe + 'a');
    }
  }

  get se() { return this.southEast(this._hash) }
  southEast(hash) {
    if (!hash) return null;
    let parentHash = hash.slice(0, -1);
    switch(hash.slice(-1)) {
      case 'a': return parentHash + 'd';
      case 'b': return this.ifValueThen(this.east(parentHash), pe => pe + 'c');
      case 'c': return this.ifValueThen(this.south(parentHash), ps => ps + 'b');
      case 'd': return this.ifValueThen(this.southEast(parentHash), pse => pse + 'a');
    }
  }

}