/**
 * Pentagon
 *   d
 * e   c
 *  a b
 * Hexagon
 *  e d
 * f   c
 *  a b
 * If center is x,y, side is s and number of sides are n,
 * we can find the n vertices of the regular polygon by creating a vector which lies on the y axis 
 * and extends till size, then rotate it by 360/n degrees for n times.
 * 
 * From https://wikivisually.com/wiki/n-flake#Pentaflake
 * The scale factor of the side of the childs are given by the formula:
 *                1
 * r = ---------------------------
 *           n/4
 *     2(1 + sum (cos(2.PI.k/n)) )
 *           k=1
 */
class NGonUnit {

  constructor(x, y, n, side, color, fill) {
    this._c = createVector(x,y);
    this._x = x;
    this._y = y;
    this._n = n;
    this._side = side;
    this._color = color;
    this._fill = fill;

    this._points = new Array(n);
    for (let i=0; i<n; i++) {
      let v = createVector(side,0);
      v.rotate(-(HALF_PI+(TWO_PI*i/n)));
      v.add(this._c);
      this._points[i] = v;
    }
  }

  show() {
    if (this._fill) {
      noStroke();
      fill(this._color);
      beginShape();
      for (let i=0; i<this._n; i++) {
        let v = this._points[i];
        vertex(v.x, v.y);
      }
      endShape();
    } else {
      stroke(this._color);
      strokeWeight(1);
      for (let i=0; i<this._n; i++) {
        let v = this._points[i];
        line(this._x,this._y,v.x, v.y);
      }
    }
  }

  getChildren() {
    let cosSum = 0;
    for (let k=1; k<this._n/4; k++) {
      cosSum += cos(TWO_PI*k/this._n);
    }
    let scale = 1 / (2*(1+cosSum));
    let children = new Array(this._n);
    for (let i=0; i<this._n; i++) {
      let v = createVector(this._side*(1-scale),0);
      v.rotate(-(HALF_PI+(TWO_PI*i/this._n)));
      v.add(this._c);
      children[i] = new NGonUnit(v.x, v.y, this._n, this._side*scale, this._color, this._fill);
    }
    return children;
  }

}