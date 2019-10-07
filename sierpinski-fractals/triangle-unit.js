class TriangleUnit {

  constructor(leftX, leftY, side, color, fill) {
    this._x1 = leftX;
    this._y1 = leftY;
    this._side = side;
    this._x2 = leftX + side;
    this._y2 = leftY;
    this._x3 = leftX + side/2;
    this._y3 = leftY - (sqrt(3) * side / 2);
    this._color = color;
    this._fill = fill;
    this._base = TriangleUnit.NONE;
  }

  show() {
    stroke(this._color);
    strokeWeight(1);
    if (!this._fill) {
      noFill();
    } else {
      fill(this._color);
    }
    triangle(this._x1, this._y1, this._x2, this._y2, this._x3, this._y3);
  }

  getLeft() {
    return new TriangleUnit(this._x1, this._y1, this._side/2, this._color, this._fill);
  }

  getRight() {
    return new TriangleUnit(this._x1 + this._side/2, this._y1, this._side/2, this._color, this._fill);
  }

  getTop() {
    return new TriangleUnit(this._x1 + this._side/4, this._y1 - (this._y1 - this._y3) / 2, this._side / 2, this._color, this._fill);
  }

  // curve logic

  showCurve() {
    stroke(this._baseColor);
    strokeWeight(2);
    switch(this._base) {
      case TriangleUnit.BASE:
        line(this._x1, this._y1, this._x2, this._y2);
        break;
      case TriangleUnit.SIDE:
        line(this._x1, this._y1, this._x3, this._y3);
        break;
      case TriangleUnit.OPP:
        line(this._x3, this._y3, this._x2, this._y2);
        break;
    }
  }

  getBase() {
    return this._base;
  }

  setBase(base) {
    this._base = base;
  }

  setBaseColor(color) {
    this._baseColor = color;
  }

}

TriangleUnit.NONE = 0;
TriangleUnit.BASE = 1;
TriangleUnit.SIDE = 2;
TriangleUnit.OPP = 3;