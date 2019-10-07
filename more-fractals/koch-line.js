/**
 * Koch Line follows the Koch Curve characteristics.
 * Each line can be broken down into 4 parts of length/3 each.
 *  ---------------
 * a               e
 *         c
 *        / \
 *       /   \
 *  -----     -----
 * a     b    d    e
 */
class KochLine {

  constructor(start, end) {
    this._start = start;
    this._end = end;
    this._angle = PI/3;
  }

  show() {
    line(this._start.x, this._start.y, this._end.x, this._end.y);
  }

  getA() {
    return this._start.copy();
  }

  getB() {
    let v = p5.Vector.sub(this._end, this._start); // vector from start to end
    v.div(3); // length/3
    v.add(this._start); // shift to the new point
    return v;
  }

  getC() {
    let v = p5.Vector.sub(this._end, this._start);
    v.div(3);
    let a = this._start.copy();
    a.add(v);
    v.rotate(-this._angle);
    a.add(v);
    return a;
  }

  getD() {
    let v = p5.Vector.sub(this._end, this._start);
    v.mult(2/3); // moved to 2/3 segment
    v.add(this._start);
    return v;
  }

  getE() {
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
    v.rotate(this._angle);
    a.add(v);
    return a;
  }

}