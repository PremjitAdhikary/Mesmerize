/**
 * d   c
 * 
 * a x b
 * a b c d are the 4 points, x is the anchor
 */
class Segment {
  constructor(color) {
    this._color = color;
  }

  height() {
    return this._length;
  }

  update(x,y,angle, length,bottomWidth,topWidth) {
    this._anchor = createVector(x,y);
    this._length = length;
    this._a = createVector(0,bottomWidth/2);
    this._a.rotate(angle);
    this._a.add(this._anchor);
    this._b = createVector(0,-bottomWidth/2);
    this._b.rotate(angle);
    this._b.add(this._anchor);
    let v = createVector(length,0);
    v.rotate(angle);
    this._c = createVector(0,-topWidth/2);
    this._c.rotate(angle);
    this._c.add(v);
    this._c.add(this._anchor);
    this._d = createVector(0,topWidth/2);
    this._d.rotate(angle);
    this._d.add(v);
    this._d.add(this._anchor);
  }

  show() {
    fill(this._color);
    stroke(this._color);
    strokeWeight(1);
    quad(
      this._a.x, this._a.y, this._b.x, this._b.y,
      this._c.x, this._c.y, this._d.x, this._d.y
    );
    strokeWeight(4);
    point(this._anchor.x,this._anchor.y);
  }
}