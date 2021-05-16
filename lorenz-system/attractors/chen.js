/**
 * Constants:
 * a = 5, b = -10, d = -0.38
 * 
 * Formulae:
 * dx
 * -- = ax - yz
 * dt
 * 
 * dy
 * -- = by + xz
 * dt
 * 
 * dz
 * -- = dz + xy/3
 * dt
 */
class Chen extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 5;
    this._b = -10;
    this._d = -0.38;
    this._h = 0.02;
  }

  calculatePoints() {
    let dt = 0.5;
    let dx = (this._a * this._x - this._y * this._z) * dt;
    let dy = (this._b * this._y + this._x * this._z) * dt;
    let dz = (this._d * this._z + this._x * this._y / 3) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}