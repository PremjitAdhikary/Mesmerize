class SierpinskiNGon {

  constructor(gens, color, fill, n, initSize) {
    this._generations = gens;
    this._currentGeneration = 1;
    this._currentShapes;
    this._allShapes = new Array(n);
    this._prevShapes;
    this._color = color;
    this._fill = fill;
    this._n = n;
    this._initSize = initSize;
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
    if (this._fill) {
      for (let shape of this._currentShapes) {
        shape.show();
      }
    } else {
      for (let shapes of this._allShapes) {
        for (let shape of shapes) {
          shape.show();
        }
      }
    }
  }

  generateNextShapes() {
    this._prevShapes = this._currentShapes;
    this._currentShapes = [];
    this._allShapes.push([]);
    for (let shape of this._prevShapes) {
      let children = shape.getChildren();
      for (let child of children) {
        this._currentShapes.push(child);
        this._allShapes[this._currentGeneration].push(child);
      }
    }
  }

  reset() {
    this.initShape();
  }

  initShape() {
    this._currentGeneration = 1;
    this._currentShapes = [];
    let t = new NGonUnit(width/2, height/2, this._n, this._initSize, this._color, this._fill);
    this._currentShapes.push(t);
    this._allShapes = [];
    this._allShapes.push([]);
    this._allShapes[0].push(t);
  }
  
}