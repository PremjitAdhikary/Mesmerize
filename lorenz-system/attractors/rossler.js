/**
 * Constants:
 * a = 0.2, b = 0.2, c = 5.7
 * 
 * Formulae:
 * dx
 * -- = -(y + z)
 * dt
 * 
 * dy
 * -- = x + ay
 * dt
 * 
 * dz
 * -- = b + z(x - c)
 * dt
 */
class Rossler extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 0.2;
    this._b = 0.2;
    this._c = 5.7; // 14 alternate
  }

  calculatePoints() {
    let dt = 0.025;
    let dx = (-(this._y + this._z)) * dt;
    let dy = (this._x + this._a * this._y) * dt;
    let dz = (this._b + this._z * (this._x - this._c)) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}