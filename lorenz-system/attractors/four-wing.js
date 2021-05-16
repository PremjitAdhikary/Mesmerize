/**
 * Constants:
 * a = 0.2, b = 0.01, c = -0.4
 * 
 * Formulae:
 * dx
 * -- = ax + yz
 * dt
 * 
 * dy
 * -- = bx + cy - xz
 * dt
 * 
 * dz
 * -- = -z - xy
 * dt
 */
class FourWing extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 0.2;
    this._b = 0.01;
    this._c = -0.4;

    this._h = 0.05;
  }

  calculatePoints() {
    let dt = 3;
    let dx = (this._a * this._x + this._y * this._z) * dt;
    let dy = (this._b * this._x + this._c * this._y - this._x * this._z) * dt;
    let dz = (-this._z - this._x * this._y) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}