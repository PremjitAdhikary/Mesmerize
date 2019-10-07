class SierpinskiGasket {

  constructor(gens, guideColor, curveColor, initSize, showGuide) {
    this._generations = gens;
    this._currentGeneration = 1;
    this._currentShapes;
    this._prevShapes;
    this._guideColor = guideColor;
    this._curveColor = curveColor;
    this._initSize = initSize;
    this._fill = false;
    this._currentCurve;
    this._prevCurve;
    this._showGuide = showGuide;
    this.initShape();
  }

  show() {
    this.drawShapes();
    this.drawCurve();
    if (this._currentGeneration >= this._generations) {
      return;
    }
    this.generateNextShapes();
    this._currentGeneration++;
  }

  drawShapes() {
    if (!this._showGuide) return;
    for (let shape of this._currentShapes) {
      shape.show();
    }
  }

  drawCurve() {
    for (let shape of this._currentShapes) {
      shape.showCurve();
    }
  }

  generateNextShapes() {
    this._prevShapes = this._currentShapes;
    this._currentShapes = [];
    for (let shape of this._prevShapes) {
      let left = shape.getLeft();
      left.setBaseColor(this._curveColor);
      this.setLeftBase(left, shape.getBase());
      this._currentShapes.push(left);
      
      let right = shape.getRight();
      right.setBaseColor(this._curveColor);
      this.setRightBase(right, shape.getBase());
      this._currentShapes.push(right);
      
      let top = shape.getTop();
      top.setBaseColor(this._curveColor);
      this.setTopBase(top, shape.getBase());
      this._currentShapes.push(top);
    }
  }

  setLeftBase(triangle, parentBase) {
    switch(parentBase) {
      case TriangleUnit.BASE: triangle.setBase(TriangleUnit.SIDE); break;
      case TriangleUnit.SIDE: triangle.setBase(TriangleUnit.BASE); break;
      case TriangleUnit.OPP: triangle.setBase(TriangleUnit.OPP); break;
    }
  }

  setRightBase(triangle, parentBase) {
    switch(parentBase) {
      case TriangleUnit.BASE: triangle.setBase(TriangleUnit.OPP); break;
      case TriangleUnit.SIDE: triangle.setBase(TriangleUnit.SIDE); break;
      case TriangleUnit.OPP: triangle.setBase(TriangleUnit.BASE); break;
    }
  }

  setTopBase(triangle, parentBase) {
    switch(parentBase) {
      case TriangleUnit.BASE: triangle.setBase(TriangleUnit.BASE); break;
      case TriangleUnit.SIDE: triangle.setBase(TriangleUnit.OPP); break;
      case TriangleUnit.OPP: triangle.setBase(TriangleUnit.SIDE); break;
    }
  }

  generateNextCurve() {
    this._prevCurve = this._currentCurve;
    this._currentCurve = [];
    for (let shape of this._prevCurve) {
      this._currentCurve.push(shape.getLeft());
    }
  }

  reset() {
    this.initShape();
  }

  initShape() {
    this._currentGeneration = 1;
    let h = sqrt(3) * this._initSize / 2;
    let t = new TriangleUnit(
        (width - this._initSize)/2, height - (height - h)/2, this._initSize, 
        this._guideColor, this._fill);
    t.setBase(TriangleUnit.BASE);
    t.setBaseColor(this._curveColor);
    this._currentShapes = [];
    this._currentShapes.push(t);
  }

}