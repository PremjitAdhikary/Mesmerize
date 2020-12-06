class TspPath {
  constructor(u,v) {
    this._u = u,
    this._v = v;
  }

  draw(color, strokeWt) {
    stroke(color.stringify());
    strokeWeight(strokeWt);
    line(this._u.x, this._u.y, this._v.x, this._v.y);
  }
}