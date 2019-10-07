class SierpinskiCarpet {

  constructor(gens, color, initSize, fill) {
    this._generations = gens;
    this._currentGeneration = 1;
    this._currentShapes;
    this._prevShapes;
    this._color = color;
    this._initSize = initSize;
    this._fill = fill;
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
      this._currentShapes.push(shape.getNorth());
      this._currentShapes.push(shape.getSouth());
      this._currentShapes.push(shape.getEast());
      this._currentShapes.push(shape.getWest());
      this._currentShapes.push(shape.getNorthEast());
      this._currentShapes.push(shape.getSouthEast());
      this._currentShapes.push(shape.getNorthWest());
      this._currentShapes.push(shape.getSouthWest());
    }
  }

  reset() {
    this.initShape();
  }

  initShape() {
    this._currentGeneration = 1;
    let h = sqrt(3) * this._initSize / 2;
    let t = new SquareUnit((width - this._initSize)/2, (height - this._initSize)/2, 
            this._initSize, this._color, this._fill);
    this._currentShapes = [];
    this._currentShapes.push(t);
  }

}