/**
 * Constants:
 * a = 32.48, b = 45.84, c = 1.18, d = 0.13, e = 0.57, f = 14.7
 * 
 * Formulae:
 * dx
 * -- = a (y - x) + dxz
 * dt
 * 
 * dy
 * -- = bx - xz + fy
 * dt
 * 
 * dz
 * -- = cz + xy - ex^2
 * dt
 */
class ThreeScrollUnifiedChaoticSystem extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._a = 32.48;
    this._b = 45.84;
    this._c = 1.18;
    this._d = 0.13;
    this._e = 0.57;
    this._f = 14.7;
    this._h = 0.0007;
  }

  calculatePoints() {
    let dt = 0.5;
    let dx = (this._a * (this._y - this._x) + this._d * this._x * this._z) * dt;
    let dy = (this._b * this._x - this._x * this._z + this._f * this._y) * dt;
    let dz = (this._c * this._z + this._x * this._y - this._e * this._x * this._x) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}