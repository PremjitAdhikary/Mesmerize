/**
 *   e
 *  / \
 * d---c
 * |   |
 * a---b
 */
class PythagoranBase {

  constructor(x1,y1,x2,y2,angle,deep,lineArt) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._angle = angle;
    this._deep = deep;
    this._lineArt = lineArt;

    this._a = createVector(x1,y1);
    this._b = createVector(x2,y2);

    this._c = p5.Vector.sub(this._b, this._a);
    this._c.rotate(-HALF_PI);
    this._c.add(this._b);

    this._d = p5.Vector.sub(this._b, this._a);
    this._d.rotate(-HALF_PI);
    this._d.add(this._a);

    this._e = p5.Vector.sub(this._c, this._d);
    this._e.mult(cos(this._angle));
    this._e.rotate(-this._angle);
    this._e.add(this._d);

    this.addBranches();
  }

  addBranches() {
    if (this._deep > 0) {
      this._branchDE = 
        new PythagoranBase(this._d.x, this._d.y, this._e.x, this._e.y, this._angle, 
          this._deep-1, this._lineArt);
      this._branchEC = 
        new PythagoranBase(this._e.x, this._e.y, this._c.x, this._c.y, this._angle, 
          this._deep-1, this._lineArt);
    }
  }

  show() {
    if (this._lineArt) {
      stroke(SketchColor.greenyellow().stringify());
      strokeWeight(1);
      noFill();
      line(this._a.x, this._a.y, this._b.x, this._b.y);
      line(this._b.x, this._b.y, this._c.x, this._c.y);
      line(this._a.x, this._a.y, this._d.x, this._d.y);
      line(this._c.x, this._c.y, this._d.x, this._d.y);
    } else {
      noStroke();
      let color = PythagoranBase._BLENDED_COLORS[PythagoranBase._BLENDED_COLORS.length-this._deep-1];
      fill(color.stringify());
      quad(this._a.x, this._a.y, this._b.x, this._b.y, this._c.x, this._c.y, this._d.x, this._d.y);
    }

    if (this._branchDE) {
      this._branchDE.show();
    }
    if (this._branchEC) {
      this._branchEC.show();
    }
  }

}

PythagoranBase._BLENDED_COLORS = [
  SketchColor.violet(),
  SketchColor.blend(SketchColor.violet(),SketchColor.blue()),
  SketchColor.blue(),
  SketchColor.blend(SketchColor.green(),SketchColor.blue()),
  SketchColor.green(),
  SketchColor.blend(SketchColor.green(),SketchColor.yellow()),
  SketchColor.yellow(),
  SketchColor.blend(SketchColor.orange(),SketchColor.yellow()),
  SketchColor.orange(),
  SketchColor.blend(SketchColor.orange(),SketchColor.red()),
  SketchColor.red()
];