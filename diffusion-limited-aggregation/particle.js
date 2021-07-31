class Particle {

  constructor(start, endReached, velocityFunc, size, color, 
    onStuckFunc = () => {}, loops = 50) {
    this._current = start.copy();
    this.endReached = endReached;
    this.velocityFunc = velocityFunc;
    this._size = size;
    this._color = color;
    this.onStuckFunc = onStuckFunc;
    this._loops = loops;

    this._stuck = false;
    this._touchDist = (size * size * 1.1);
  }

  show() {
    noStroke();
    fill(this._color);
    circle(this._current.x, this._current.y, this._size);
  }

  touches(anotherParticle) {
    let distSq = this.squareDist(anotherParticle._current.x, anotherParticle._current.y);
    return distSq < this._touchDist;
  }

  walk() {
    if (this._stuck) return;
    let currLoop = 0;
    while(!this._stuck && currLoop < this._loops) {
      this.velocityFunc(this._current, this._size);
      if (this.endReached(this)) {
        this._stuck = true;
        this.onStuckFunc(this);
      }
      currLoop++;
    }
  }

  squareDist(x, y) {
    let X = (this._current.x - x);
    let Y = (this._current.y - y);
    return X*X + Y*Y;
  }

}