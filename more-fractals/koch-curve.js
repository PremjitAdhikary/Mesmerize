class KochCurve extends BaseKochCurve {

  constructor() {
    super(7, SketchColor.blend(SketchColor.violet(), SketchColor.white()).stringify());
  }

  initCurve() {
    this._currentCurve.push(
      new KochLine(createVector(0, height*2/3), createVector(width, height*2/3)));
  }

}