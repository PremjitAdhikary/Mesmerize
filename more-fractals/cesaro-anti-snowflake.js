class CesaroAntiSnowFlake extends BaseKochCurve {

  constructor() {
    super(6, SketchColor.blend(SketchColor.violet(), SketchColor.greenyellow()).stringify());
  }

  generateNextCurve() {
    this._prevCurve = this._currentCurve;
    this._currentCurve = [];
    for (let line of this._prevCurve) {
      this._currentCurve.push(new KochLine(line.getA(), line.getB()));
      this._currentCurve.push(new KochLine(line.getB(), line.getC()));
      this._currentCurve.push(new KochLine(line.getC(), line.getD()));
      this._currentCurve.push(new KochLine(line.getD(), line.getE()));
    }
  }

  initCurve() {
    let len = height * 0.9;// * 3/4;
    let a = createVector(width/2 - len/2, height - (height - len) / 2);
    let b = createVector(width/2 + len/2, height - (height - len) / 2);
    let c = createVector(width/2 + len/2, (height - len) / 2);
    let d = createVector(width/2 - len/2, (height - len) / 2);

    this._currentCurve.push(new KochLine(a, b));
    this._currentCurve.push(new KochLine(b, c));
    this._currentCurve.push(new KochLine(c, d));
    this._currentCurve.push(new KochLine(d, a));
  }

}