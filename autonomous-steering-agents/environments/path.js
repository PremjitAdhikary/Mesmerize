/**
 * Holds a path
 * points holds all the turns
 * wid, is the width of the path
 * If isClosed is true, the path is a loop
 * addPoints(x, y), adds a turn. A Path must have atleast 2 points 
 */
class Path {

  constructor(wid, isClosed = false) {
    this._points = [];
    this._wid = wid;
    this._color = SketchColor.grey().stringify();
    this._lineColor = SketchColor.black().stringify();
    this._isClosed = isClosed;
  }

  addPoints(x, y) {
    this._points.push(createVector(x, y));
  }

  show() {
    if (this._points.length < 2) return;
    this.drawPath(this._wid, this._color);
    this.drawPath(1, this._lineColor);
  }

  drawPath(strokeWt, strokeColor) {
    stroke(strokeColor);
    strokeWeight(strokeWt);
    noFill();
    beginShape();
    this._points.forEach(p => vertex(p.x, p.y));
    if (this._isClosed)
      vertex(this._points[0].x, this._points[0].y);
    endShape();
  }
  
}