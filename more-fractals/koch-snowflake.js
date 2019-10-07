class KochSnowFlake extends BaseKochCurve {

  constructor() {
    super(6, SketchColor.blend(SketchColor.blue(), SketchColor.white()).stringify());
  }

  initCurve() {
    let len = height * 0.8;
    let a = createVector(width/2 - len/2, height * 0.72);
    let b = createVector(width/2 + len/2, height * 0.72);

    let v = p5.Vector.sub(b, a);
    let c = a.copy();
    v.rotate(-PI/3);
    c.add(v);

    this._currentCurve.push(new KochLine(b, a));
    this._currentCurve.push(new KochLine(a, c));
    this._currentCurve.push(new KochLine(c, b));
  }

}