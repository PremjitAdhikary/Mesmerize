class KochAntiSnowFlake extends BaseKochCurve {

  constructor() {
    super(7, SketchColor.blend(SketchColor.orange(), SketchColor.green()).stringify());
  }

  generateNextCurve() {
    this._prevCurve = this._currentCurve;
    this._currentCurve = [];
    for (let line of this._prevCurve) {
      this._currentCurve.push(new KochLine(line.getA(), line.getB()));
      this._currentCurve.push(new KochLine(line.getB(), line.getCdash()));
      this._currentCurve.push(new KochLine(line.getCdash(), line.getD()));
      this._currentCurve.push(new KochLine(line.getD(), line.getE()));
    }
  }

  initCurve() {
    let len = height;// * 3/4;
    let a = createVector(width/2 - len/2, height * 0.08);
    let b = createVector(width/2 + len/2, height * 0.08);

    let v = p5.Vector.sub(b, a);
    let c = a.copy();
    v.rotate(PI/3);
    c.add(v);

    this._currentCurve.push(new KochLine(a, b));
    this._currentCurve.push(new KochLine(b, c));
    this._currentCurve.push(new KochLine(c, a));
  }

}