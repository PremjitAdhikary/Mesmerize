/**
 * Constants:
 * a = 3, b = 2.7, c = 1.7, d = 2, e = 9
 * 
 * Formulae:
 * dx
 * -- = y -ax + byz
 * dt
 * 
 * dy
 * -- = cy - xz + z
 * dt
 * 
 * dz
 * -- = dxy - ez
 * dt
 */
class Dadras extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 3;
    this._b = 2.7;
    this._c = 1.7;
    this._d = 2;
    this._e = 9;
  }

  calculatePoints() {
    let dt = 0.01;
    let dx = (this._y - this._a * this._x + this._b * this._y * this._z) * dt;
    let dy = (this._c * this._y - this._x * this._z + this._z) * dt;
    let dz = (this._d * this._x * this._y - this._e * this._z) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}