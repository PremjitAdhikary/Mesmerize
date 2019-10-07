/**
 * Minkowski Line follows the Minkowski Curve characteristics.
 * Each line can be broken down into 4 parts of length/4 each.
 *  ---------------
 * a               h
 *  c __ d
 * __|  |  g__h
 * a b  |__|
 *      e  f
 */
class MinkowskiLine {

  constructor(start, end) {
    this._start = start;
    this._end = end;
  }

  show() {
    line(this._start.x, this._start.y, this._end.x, this._end.y);
  }

  getA() {
    return this._start.copy();
  }

  getB() {
    let v = p5.Vector.sub(this._end, this._start); // vector from start to end
    v.div(4); // length/4
    v.add(this._start); // shift to the new point
    return v;
  }

  getC() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(4);
    let c = this._start.copy();
    c.add(v);
    v.rotate(-HALF_PI);
    c.add(v);
    return c;
  }

  getD() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(2);
    let d = this._start.copy();
    d.add(v);
    v.rotate(-HALF_PI);
    v.div(2);
    d.add(v);
    return d;
  }

  getE() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(2);
    let e = this._start.copy();
    e.add(v);
    v.rotate(HALF_PI);
    v.div(2);
    e.add(v);
    return e;
  }

  getF() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(2);
    let f = this._start.copy();
    f.add(v);
    v.div(2);
    f.add(v);
    v.rotate(HALF_PI);
    f.add(v);
    return f;
  }

  getG() {
    let v = p5.Vector.sub(this._end, this._start); // vector from start to end
    v.mult(3/4); // length/4
    v.add(this._start); // shift to the new point
    return v;
  }

  getH() {
    return this._end.copy();
  }

  /**
   *      b     d
   *  -----     -----
   * a     \   /     e
   *        \ /
   *         c
   */
  getCdash() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(3);
    let a = this._start.copy();
    a.add(v);
    // v.rotate(PI/3);
    v.rotate(this._angle);
    a.add(v);
    return a;
  }

}