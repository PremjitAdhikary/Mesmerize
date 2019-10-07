class MinkowskiSnowFlake extends BaseMinkowskiCurve {

  constructor() {
    super(4, SketchColor.blend(SketchColor.orange(), SketchColor.green()).stringify());
  }

  initCurve() {
    let len = height * 0.6;
    let a = createVector(width/2 - len/2, height - (height - len) / 2);
    let b = createVector(width/2 + len/2, height - (height - len) / 2);
    let c = createVector(width/2 + len/2, (height - len) / 2);
    let d = createVector(width/2 - len/2, (height - len) / 2);

    this._currentCurve.push(new MinkowskiLine(a, b));
    this._currentCurve.push(new MinkowskiLine(b, c));
    this._currentCurve.push(new MinkowskiLine(c, d));
    this._currentCurve.push(new MinkowskiLine(d, a));
  }

}