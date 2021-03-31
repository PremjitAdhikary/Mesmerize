class GridFloor {
  constructor() {
    this._lines = [];
    this.setupFloor();
  }

  show() {
    for (let line of this._lines) {
      line.show();
    }
  }

  setupFloor() {
    this._lines.push(new FloorLine(createVector(0, 52), ['18e', '37s', '18w']));
    this._lines.push(new FloorLine(createVector(72, height), ['5n', '3m', '27n', '5o', 
      '17n', '20w']));
    this._lines.push(new FloorLine(createVector(100, height), ['2n', '7m', '21n', '5o', 
      '40n', '3m', '17n', '4o', '21n']));
    this._lines.push(new FloorLine(createVector(160, 0), ['45s', '5r', '38s', '10r', 
      '10s', '4t', '8s']));
    this._lines.push(new FloorLine(createVector(150, height), ['50n', '13o', '10n', '5m', '42n']));
    this._lines.push(new FloorLine(createVector(240, 0), ['24s', '7r', '20s', '5t', '25s', '10r', 
      '15s', '5t', '10s']));
    this._lines.push(new FloorLine(createVector(224, height), ['12n', '10o', '10n', '4m', '50n', 
      '5o', '15n', '3o', '12n']));
    this._lines.push(new FloorLine(createVector(290, height), ['35n', '8m', '32n', '11o', '34n']));
    this._lines.push(new FloorLine(createVector(320, 0), ['38s', '5t', '10e', '24s', '3o', '28n', 
      '14w', '36n']));
    this._lines.push(new FloorLine(createVector(350, 0), ['20s', '15t', '32s', '10r', '12w', '3r', 
      '40s']));
    this._lines.push(new FloorLine(createVector(350, height), ['15n', '25e', '15s']));
    this._lines.push(new FloorLine(createVector(460, height), ['18n', '10w', '20n', '6o', '25n', 
      '5m', '48n']));
    this._lines.push(new FloorLine(createVector(460, 0), ['16s', '25e', '3o', '5e', '3t', '9e']));
    this._lines.push(new FloorLine(createVector(470, 0), ['14s', '20e', '14n']));
    this._lines.push(new FloorLine(createVector(490, height), ['25n', '4m', '30n', '4o', '10e', 
      '18n', '4o', '25e']));
    this._lines.push(new FloorLine(createVector(width, 180), ['24w', '15s', '12w', '30s', '4t', 
      '10s', '4r', '12s']));
    this._lines.push(new FloorLine(createVector(530, height), ['30n', '5e', '5t', '20e']));
    this._lines.push(new FloorLine(createVector(width, 350), ['2w', '5r', '8w', '4m', '12w', 
      '24n', '15e', '6o', '10e']));

    this._lines.push(new FloorLine(createVector(width/2-50,height/2-50), ['25e', '25s']));
    this._lines.push(new FloorLine(createVector(width/2+50,height/2+50), ['25w', '25n']));
  }
}

class FloorLine {
  constructor(start, path) {
    this._points = [];
    this._points.push(start.copy());
    this.processPath(path);
    this._blipColor = blue.copy().alpha(0.5).stringify();
    this._lineColor = blue.copy().alpha(0.3).stringify();
    this._blipIndex = 0;
  }

  processPath(path) {
    for (let p of path) {
      let dir = GridFloor.directionMap.get(p.slice(-1));
      let loops = parseInt(p.slice(0, -1));
      for (let i=0; i<loops; i++) {
        let nextV = this._points[this._points.length-1].copy();
        nextV.x += dir.x;
        nextV.y += dir.y;
        this._points.push(nextV);
      }
    }
  }

  show() {
    noFill();
    strokeWeight(2);
    stroke(this._lineColor);
    beginShape();
    for (let i = 0; i < this._points.length; i++) {
      vertex(this._points[i].x, this._points[i].y);
    }
    endShape();
    strokeWeight(4);
    stroke(this._blipColor);
    line(this._points[this._blipIndex].x, this._points[this._blipIndex].y, 
      this._points[this._blipIndex+1].x, this._points[this._blipIndex+1].y, );
    this._blipIndex++;
    if (this._blipIndex >= this._points.length-2) 
      this._blipIndex = 0;
  }
}

/**
 * mno
 * w e
 * rst
 */
GridFloor.directionMap = new Map();
GridFloor.directionMap.set('n', {x:0, y:-4});
GridFloor.directionMap.set('s', {x:0, y:4});
GridFloor.directionMap.set('e', {x:4, y:0});
GridFloor.directionMap.set('w', {x:-4, y:0});

GridFloor.directionMap.set('m', {x:-4, y:-4});
GridFloor.directionMap.set('o', {x:4, y:-4});
GridFloor.directionMap.set('r', {x:-4, y:4});
GridFloor.directionMap.set('t', {x:4, y:4});