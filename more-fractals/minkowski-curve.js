class MinkowskiCurve extends BaseMinkowskiCurve {

  constructor() {
    super(7, SketchColor.blend(SketchColor.blue(), SketchColor.violet(), SketchColor.white()).stringify());
  }

  initCurve() {
    this._currentCurve.push(
      new MinkowskiLine(createVector(0, height/2), createVector(width, height/2)));
  }

}