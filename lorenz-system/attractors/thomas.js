/**
 * Constants:
 * b = 0.208186
 * 
 * Formulae:
 * dx
 * -- = sin y - bx
 * dt
 * 
 * dy
 * -- = sin z - by
 * dt
 * 
 * dz
 * -- = sin x - bz
 * dt
 */
class Thomas extends BaseSystem {

  constructor(x, y, z, hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate) {
    super(hueInit, hueInterval, shapeVerticesInterval, maxPoints, maxPointsToCalculate);
    this._x = x;
    this._y = y;
    this._z = z;
    this._b = 0.208186;

    this._h = 0.027;
  }

  calculatePoints() {
    let dt = 10;
    let dx = (sin(this._y) - this._b * this._x) * dt;
    let dy = (sin(this._z) - this._b * this._y) * dt;
    let dz = (sin(this._x) - this._b * this._z) * dt;
    this._x += (this._h * dx);
    this._y += (this._h * dy);
    this._z += (this._h * dz);
  
    return createVector(this._x, this._y, this._z);
  }

}