/**
 * Constants:
 * b = 0.208186
 * 
 * Formulae:
 * dx
 * -- = (z - b)x - Dy
 * dt
 * 
 * dy
 * -- = Dx + (z - b)y
 * dt
 * 
 * dz            z^3
 * -- = c + az - --- - (x^2 + y^2)(1 + ez) + fzx^3
 * dt             3
 */
class Aizawa extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 0.95;
    this._b = 0.7;
    this._c = 0.6;
    this._D = 3.5;
    this._e = 0.25;
    this._f = 0.1;
  }

  calculatePoints() {
    let dt = 0.01;
    let dx = (this._x * (this._z - this._b) - this._D * this._y) * dt;
    let dy = (this._D * this._x + this._y * (this._z - this._b)) * dt;
    let dz = (this._c + this._a * this._z - (this._z * this._z * this._z) / 3.0 
      - (this._x * this._x + this._y * this._y) * (1 + this._e * this._z) 
      + this._f * this._z * this._x * this._x * this._x) * dt;
    this._x += dx;
    this._y += dy;
    this._z += dz;
  
    return createVector(this._x, this._y, this._z);
  }

}