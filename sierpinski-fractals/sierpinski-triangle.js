class SierpinskiTriangle {

  constructor(gens, color, initSize, fill, useSquareUnit) {
    this._generations = gens;
    this._currentGeneration = 1;
    this._currentShapes;
    this._prevShapes;
    this._color = color;
    this._initSize = initSize;
    this._fill = fill;
    this._useSquareUnit = useSquareUnit;
    this.initShape();
  }

  show() {
    this.drawShapes();
    if (this._currentGeneration >= this._generations) {
      return;
    }
    this.generateNextShapes();
    this._currentGeneration++;
  }

  drawShapes() {
    for (let shape of this._currentShapes) {
      shape.show();
    }
  }

  generateNextShapes() {
    this._prevShapes = this._currentShapes;
    this._currentShapes = [];
    for (let shape of this._prevShapes) {
      this._currentShapes.push(shape.getLeft());
      this._currentShapes.push(shape.getRight());
      this._currentShapes.push(shape.getTop());
    }
  }

  reset() {
    this.initShape();
  }

  initShape() {
    this._currentGeneration = 1;
    let h = sqrt(3) * this._initSize / 2;
    let t;
    if (!this._useSquareUnit) {
      t = new TriangleUnit(
        (width - this._initSize)/2, height - (height - h)/2, this._initSize, this._color, this._fill);
    } else {
      t = new SquareUnit((width - this._initSize)/2, (height - this._initSize)/2, 
            this._initSize, this._color, this._fill);
    }
    this._currentShapes = [];
    this._currentShapes.push(t);
  }

}