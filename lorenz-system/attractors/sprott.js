/**
 * Constants:
 * a = 2.07, b = 1.79
 * 
 * Formulae:
 * dx
 * -- = y + axy + xz
 * dt
 * 
 * dy
 * -- = 1 - bx^2 + yz
 * dt
 * 
 * dz
 * -- = x - x^2 - y^2
 * dt
 */
class Sprott extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 2.07;
    this._b = 1.79;

    this._h = 0.01;
  }

  calculatePoints() {
    let dt = 3;
    let dx = (this._y + this._a * this._x * this._y + this._x * this._z) * dt;
    let dy = (1 - this._b * this._x * this._x + this._y * this._z) * dt;
    let dz = (this._x - this._x * this._x - this._y * this._y) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}