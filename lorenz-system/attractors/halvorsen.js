/**
 * Constants:
 * a = 1.89
 * 
 * Formulae:
 * dx
 * -- = -ax - 4y - 4z - y^2
 * dt
 * 
 * dy
 * -- = -ay - 4z - 4x - z^2
 * dt
 * 
 * dz
 * -- = -az - 4x - 4y - x^2
 * dt
 */
class Halvorsen extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 1.89;
  }

  calculatePoints() {
    let dt = 0.02;
    let dx = (-(this._a * this._x) - 4 * this._y - 4 * this._z - this._y * this._y) * dt;
    let dy = (-(this._a * this._y) - 4 * this._z - 4 * this._x - this._z * this._z) * dt;
    let dz = (-(this._a * this._z) - 4 * this._x - 4 * this._y - this._x * this._x) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}