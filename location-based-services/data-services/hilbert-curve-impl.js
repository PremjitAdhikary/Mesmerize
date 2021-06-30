class HilbertCurveImpl extends BaseDataService {

  constructor(level = 6) {
    super();
    this._level = level;
    let scaleX = width / Math.pow(2, level);
    let scaleY = height / Math.pow(2, level);

    this._generatedCurve = new HilbertCurve(this._level, scaleX, scaleY, scaleX/2, scaleY/2);

    this._locationOnNode = new Array(this._generatedCurve._N * this._generatedCurve._N);
    
    this._curveColor = SketchColor.grey().alpha(0.25).stringify();
    this._queryCurveColor = SketchColor.blend(
      SketchColor.violet(), SketchColor.grey()).alpha(0.6).stringify();
    this._resultPathColor = SketchColor.blend(
      SketchColor.violet(), SketchColor.grey()).alpha(0.6).stringify();
    this._resultFillColor = SketchColor.grey().alpha(0.4).stringify();

    this._coolRenderer = new CoolRenderer(this._generatedCurve._scaledUpCurve);
  }

  addLocation(location) {
    let hIndex = this._generatedCurve.location2HilbdertIndex(createVector(location._x, location._y));
    if (!this._locationOnNode[hIndex]) this._locationOnNode[hIndex] = [];
    this._locationOnNode[hIndex].push(location);
    location._hIndex = hIndex;
  }

  deleteLocation(location) {
    if (location._hIndex < 0 || location._hIndex >= this._locationOnNode.length) return;
    let index = this._locationOnNode[location._hIndex].indexOf(location);
    if (index > -1) {
      this._locationOnNode[location._hIndex].splice(index, 1);
    }
    location._hIndex = -1;
  }

  updateLocation(location) {
    this.deleteLocation(location);
    this.addLocation(location);
  }

  findLocationsInDB(position, range) {
    let nodeIndex = this._generatedCurve.location2HilbdertIndex(position);
    let nodeIndexRange = Math.floor(range / 
      Math.min(this._generatedCurve._scaleX, this._generatedCurve._scaleY));
    nodeIndexRange = Math.ceil((nodeIndexRange * nodeIndexRange)/3);
    this._currQueryStartNode = nodeIndex - nodeIndexRange;
    this._currQueryEndNode = nodeIndex + nodeIndexRange;
    return this.getItemsFromNodesInRange(this._currQueryStartNode, this._currQueryEndNode)
      .filter( loc => 
        loc._x >= (position.x - range/2) && loc._x <= (position.x + range/2) 
        && loc._y >= (position.y - range/2) && loc._y <= (position.y + range/2)
      );
  }

  getItemsFromNodesInRange(start, end) {
    let allItems = [];
    for (let hIndex = start; hIndex <= end; hIndex++) {
      if (!this._locationOnNode[hIndex]) continue;
      allItems = [...allItems, ...this._locationOnNode[hIndex]];
    }
    return allItems;
  }

  resetQuery() {
    super.resetQuery();
  }

  render() {
    this._generatedCurve.render(this._curveColor, 1);
    this._coolRenderer.render();
    super.render();
  }

  renderResults() {
    if (!this._currResults) return;
    if (this._currQueryEndNode >= 0)
      this._generatedCurve.render(this._resultPathColor, 2, 
        this._currQueryStartNode, this._currQueryEndNode + 1, true, this._resultFillColor);

    super.renderResults();
  }

  coolOn() { this._coolRenderer.coolOn = true; }
  coolOff() { this._coolRenderer.coolOn = false; }

}

class HilbertCurve {

  constructor(level, scaleX, scaleY, offsetX, offsetY) {
    this._N = Math.pow(2, level);
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this.generateCurve();
  }

  location2HilbdertIndex(location) {
    let x = Math.floor(location.x/this._scaleX);
    let y = Math.floor(location.y/this._scaleY);
    return this._unitXY[x][y];
  }

  render(color, strokeWt, start = 0, end = this._N * this._N, fillRange = false, fillColor = 0) {
    if (start < 0) start = 0;
    if (end >= this._N * this._N) end = this._N * this._N;

    if (fillRange) {
      noStroke();
      fill(fillColor);
      for (let v = start; v < end; v++) 
        rect(this._scaledUpCurve[v].x - this._offsetX, this._scaledUpCurve[v].y - this._offsetY, 
          this._scaleX, this._scaleY);
    }

    stroke(color);
    noFill();
    strokeWeight(strokeWt);
    beginShape();
    for (let v = start; v < end; v++)
      vertex(this._scaledUpCurve[v].x, this._scaledUpCurve[v].y);
    endShape();
  }

  generateCurve() {
    this._unitCurve = new Array(this._N * this._N);
    this._unitXY = create2DArray(this._N, this._N);
    this._scaledUpCurve = new Array(this._N * this._N);
    for (let i=0; i < this._N * this._N; i++) {
      let hilbertNode = this.hilbertIndex2xy(i);
      this._unitCurve[i] = hilbertNode;
      this._unitXY[hilbertNode.x][hilbertNode.y] = i;

      this._scaledUpCurve[i] = createVector(
        hilbertNode.x * this._scaleX + this._offsetX, hilbertNode.y * this._scaleY + this._offsetY);
    }
  }

  hilbertIndex2xy(hIndex) {
    let last2bits = x => (x & 3);

    let tmp = HilbertCurve.positions[last2bits(hIndex)];
    hIndex = (hIndex >>> 2);

    let x = tmp[0];
    let y = tmp[1];

    for (let n = 4; n <= this._N; n *= 2) {
      let n2 = n / 2;

      switch (last2bits(hIndex)) {
        /**
         * top left
         * N=K curve should coincide with first node of N=2K curve and N=K curve should end next 
         * to the start of case 1 curve. So flip coords around diagonal
         * coords_2K.x = coords_K.y
         * coords_2K.y = coords_K.x
         */
        case 0:
          tmp = x; x = y; y = tmp;
          break;
        /**
         * bottom left
         * N=2K curve contains copies of N=K
         * coords_2K = coords_K + (x:0, y:K)
         */
        case 1:
          x = x;
          y = y + n2;
          break;
        /**
         * bottom right
         * N=2K curve contains copies of N=K
         * coords_2K = coords_K + (x:K, y:K)
         */
        case 2:
          x = x + n2;
          y = y + n2;
          break;
        /**
         * top right
         * similar to case 0, flip coords around second diagonal
         * also translate node coords to the right
         * coords_2K.x = (K-1) - coords_K.y
         * coords_2K.y = (K-1) - coords_K.x
         * coords_2K.x = coords_2K.x + K
         */
        case 3:
          tmp = y;
          y = (n2-1) - x;
          x = (n2-1) - tmp;
          x = x + n2;
          break;
      }
      hIndex = (hIndex >>> 2);
    }
    
    return createVector(x, y);
  }
}

/**
 * positions of nodes in N = 2 curve [ 0, 1, 2, 3 ]
 * quadrant wise in binary:
 * 
 *   00 | 10
 * -----------
 *   01 | 11
 */
HilbertCurve.positions = [ [0, 0], [0, 1], [1, 1], [1, 0] ];

class CoolRenderer {
  constructor(hCurve) {
    this._hCurve = hCurve;
    this._coolOn = false;
    this._totalN = hCurve.length;
    this.setupColors();
  }

  setupColors() {
    this._colors = [];
    for (let i = 0; i < this._totalN; i++) {
      let hu = map(i, 0, this._totalN, 0, 360);
      this._colors.push(color('hsba('+ Math.round(hu) + ', 85%, 85%, 0.95)'));
    }
    this._start = 0;
    this._end = 0;
    this._renderForward = true;
  }

  get coolOn() { return this._coolOn; }

  set coolOn(val) { this._coolOn = val; }

  render() {
    if (!this._coolOn) return;
    this.updateBounds();

    for (let i = this._start + 1; i < this._end; i++) {
      stroke(this._colors[i]);
      strokeWeight(3);
      line(this._hCurve[i-1].x, this._hCurve[i-1].y, this._hCurve[i].x, this._hCurve[i].y);
    }
  }

  updateBounds() {
    let jump = 4;
    if (this._renderForward) {
      if (this._end < this._totalN) {
        this._end += jump;
      } else {
        this._start += jump;
      }
      if (this._start >= this._totalN && this._end >= this._totalN) {
        this._renderForward = false;
      }
    } else {
      if (this._start > 0) {
        this._start -= jump;
      } else {
        this._end -= jump;
      }
      if (this._start <= 0 && this._end <= 0) {
        this._renderForward = true;
      }
    }
  }
}