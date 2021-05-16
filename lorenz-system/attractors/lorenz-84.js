/**
 * Constants:
 * a = 0.95, b = 7.91, f = 4.83, g = 4.66
 * 
 * Formulae:
 * dx
 * -- = -ax - y^2 - z^2 + af
 * dt
 * 
 * dy
 * -- = -y + xy - bxz + g
 * dt
 * 
 * dz
 * -- = -z + bxy + xz
 * dt
 */
class Lorenz84 extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 0.95;
    this._b = 7.91;
    this._f = 4.83;
    this._g = 4.66;
  }

  calculatePoints() {
    let dt = 0.01;
    let dx = (this._a * (this._f - this._x) - this._y * this._y - this._z * this._z) * dt;
    let dy = (this._y * (this._x - 1) - this._b * this._x * this._z + this._g) * dt;
    let dz = (this._z * (this._x - 1) + this._b * this._x * this._y) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}