/**
 * Holds Environment information
 * 
 * unreachableRectangles are all those area which are off limits to vehicles
 * walls is, well collection of walls. Each wall consists of an array of corners denoted by 
 * vectors to denote how the wall runs
 * 
 * Call pointInUnreachable(x, y) to check if point (x, y) is in off limits area. 
 * Call pointInUnreachable(x, y, true) to hilight the off limits area where the point is
 */
class BasicEnv {

  constructor() {
    this._unreachableRectangles = [];
    this._walls = [];
    this._unreachableColor = SketchColor.grey().stringify();
    this._wallColor = SketchColor.red().stringify();
  }

  addUnreachableRectangle(tlx, tly, brx, bry) {
    this._unreachableRectangles.push({
      _tlx: tlx, _tly: tly, _brx: brx, _bry: bry
    });
  }

  addWall(corners) {
    this._walls.push(corners);
  }

  pointInUnreachable(x, y, show = false) {
    for (let rectangle of this._unreachableRectangles) {
      if (this.pointInRectangle(x, y, rectangle, show))
        return true;
    }
    return false;
  }

  pointInRectangle(x, y, rectangle, show = false) {
    let intersects = rectangle._tlx <= x && rectangle._brx >= x 
      && rectangle._tly <= y && rectangle._bry >= y;
    if (show && intersects) {
      noStroke();
      fill(this._wallColor);
      rect(rectangle._tlx, rectangle._tly, 
        rectangle._brx - rectangle._tlx, rectangle._bry - rectangle._tly);
    }
    return intersects;
  }

  show() {
    for (let rectangle of this._unreachableRectangles) {
      noStroke();
      fill(this._unreachableColor);
      rect(rectangle._tlx, rectangle._tly, 
        rectangle._brx - rectangle._tlx, rectangle._bry - rectangle._tly);
    }
    for (let wall of this._walls) {
      strokeWeight(2);
      stroke(this._wallColor);
      noFill();
      beginShape();
      for (let corner of wall) {
        vertex(corner.x, corner.y);
      }
      endShape();
    }
  }
}