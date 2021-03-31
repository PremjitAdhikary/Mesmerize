class Blob {

  constructor(h, s, b, x, y) {
    this._baseDiameter = 3;
    this._diameter = this._baseDiameter;
    this._numPoints = Math.round(random(35, 65));
    this._h = h;
    this._s = s;
    this._b = b;
    this._x = x;
    this._y = y;

    this.setupPoints();
  }

  setupPoints() {
    this._points = [];
    for (let i = 0; i < this._numPoints; i++) {
      this._points.push(random(0.65, 1.2));
    }
  }

  grow() {
    this._diameter++;
  }

  show() {
    noStroke();
    fill(this._h, this._s, this._b);
    beginShape();
    for (let i = 0; i < this._numPoints; i++) {
      let angle = (360 / this._numPoints) * i;
      let x = cos(angle) * this._diameter/2 * this._points[i] + this._x;
      let y = sin(angle) * this._diameter/2 * this._points[i] + this._y - 20;
      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
}