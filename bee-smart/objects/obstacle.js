class Obstacle {
  constructor(x, y, w, h) {
    this._x = x;
    this._y = y;
    this._wd = w;
    this._ht = h;
  }

  render() {
    rectMode(CENTER);
    stroke(skyblue);
    fill(skyblue);
    strokeWeight(1);
    rect(this._x, this._y, this._wd, this._ht);
  }

  isHit(bee) {
    return bee.x > (this._x - this._wd/2) && bee.x < (this._x + this._wd/2) && bee.y > (this._y - this._ht/2) && bee.y < (this._y + this._ht/2);
  }
}