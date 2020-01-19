class TheCell {

  constructor(x, y, size, isAlive) {
    this._x = x;
    this._y = y;
    this._size = size;
    this._currStateIsAlive = isAlive;
    this._futureStateIsAlive = isAlive;
  }

  isAlive() {
    return this._currStateIsAlive;
  }

  setStateForNextUpdate(isAlive) {
    this._futureStateIsAlive = isAlive;
  }

  updateState() {
    this._currStateIsAlive = this._futureStateIsAlive;
  }

  render() {
    if (this._currStateIsAlive) {
      noStroke();
      fill(SketchColor.greenyellow().stringify());
    } else {
      stroke(SketchColor.greenyellow().alpha50().stringify());
      strokeWeight(1);
      noFill();
    }
    square(this._y*this._size, this._x*this._size, this._size);
  }
}