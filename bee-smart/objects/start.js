class Start {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._hexagon = new NGonUnit(x, y, 5, 20, orange, true);
  }

  render() {
    this._hexagon.show();
  }

}