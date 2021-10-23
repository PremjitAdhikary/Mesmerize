class DummyTarget {

  constructor(x, y, color = SketchColor.red().stringify(), size = 10) {
    this._position = createVector(x, y);
    this._color = color;
    this._size = size;
  }

  show() {
    fill(this._color);
    noStroke();
    circle(this._position.x, this._position.y, this._size);
  }
  
}