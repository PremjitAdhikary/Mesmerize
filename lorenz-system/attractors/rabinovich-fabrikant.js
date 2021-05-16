/**
 * Constants:
 * a = 0.14, v = 0.1
 * 
 * Formulae:
 * dx
 * -- = y(z - 1 + x^2) + vx
 * dt
 * 
 * dy
 * -- = x(3z + 1 - x^2) + vy
 * dt
 * 
 * dz
 * -- = -2z(a + xy)
 * dt
 */
class RabinovichFabrikant extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 0.14;
    this._v = 0.1;

    this._h = 0.05;
  }

  calculatePoints() {
    let dt = 0.5;
    let dx = (this._y * (this._z - 1 + this._x * this._x) + this._v * this._x) * dt;
    let dy = (this._x * (3 * this._z + 1 - this._x * this._x) + this._v * this._y) * dt;
    let dz = -(2 * this._z * (this._a + this._x * this._y)) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}