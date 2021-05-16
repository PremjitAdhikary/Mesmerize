/**
 * Constants:
 * o = 10, p = 28, B = 8/3 (most popular)
 * 
 * Formulae:
 * dx
 * -- = o (-x + y)
 * dt
 * 
 * dy
 * -- = -xy + px - y
 * dt
 * 
 * dz
 * -- = xy + Bz
 * dt
 * 
 */
class LorenzAttractor extends BaseSystem {

  constructor(x, y, z, o, p, B, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._o = o;
    this._p = p;
    this._B = B;
  }

  calculatePoints() {
    let dt = 0.01;
    let dx = this._o * (this._y - this._x) * dt;
    let dy = (this._x * (this._p - this._z) - this._y) * dt;
    let dz = (this._x * this._y - this._B * this._z) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}