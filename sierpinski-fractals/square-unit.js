class SquareUnit {

  constructor(topX, topY, side, color, fill) {
    this._x = topX;
    this._y = topY;
    this._side = side;
    this._color = color;
    this._fill = fill;
  }

  show() {
    stroke(this._color);
    strokeWeight(1);
    if (!this._fill) {
      noFill();
    } else {
      fill(this._color);
    }
    square(this._x, this._y, this._side);
  }

  // For the Triangle

  getLeft() {
    return new SquareUnit(this._x, this._y + this._side/2, this._side/2, this._color, this._fill);
  }

  getRight() {
    return new SquareUnit(this._x + this._side/2, this._y + this._side/2, this._side/2, this._color, this._fill);
  }

  getTop() {
    return new SquareUnit(this._x + this._side/4, this._y, this._side / 2, this._color, this._fill);
  }

  // for the Carpet

  getNorth() {
    return new SquareUnit(this._x + this._side/3, this._y, this._side/3, this._color, this._fill);
  }

  getSouth() {
    return new SquareUnit(this._x + this._side/3, this._y + this._side*2/3, this._side/3, this._color, this._fill);
  }

  getEast() {
    return new SquareUnit(this._x + this._side*2/3, this._y + this._side/3, this._side/3, this._color, this._fill);
  }

  getWest() {
    return new SquareUnit(this._x, this._y + this._side/3, this._side/3, this._color, this._fill);
  }

  getNorthEast() {
    return new SquareUnit(this._x + this._side*2/3, this._y, this._side/3, this._color, this._fill);
  }

  getSouthEast() {
    return new SquareUnit(this._x + this._side*2/3, this._y + this._side*2/3, this._side/3, this._color, this._fill);
  }

  getNorthWest() {
    return new SquareUnit(this._x, this._y, this._side/3, this._color, this._fill);
  }

  getSouthWest() {
    return new SquareUnit(this._x, this._y + this._side*2/3, this._side/3, this._color, this._fill);
  }
}