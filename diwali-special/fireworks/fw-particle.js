class FwParticle {

  constructor(x, y) {
    this._absX = x;
    this._absY = y;
  }

  show(envX, envY) {
    // implemnt by sub classes
  }

  getRelativeX(envX, absX = this._absX) {
    return absX - envX;
  }

  getRelativeY(envY, absY = this._absY) {
    return absY - envY;
  }

  isOver() {
    return true;
  }

}