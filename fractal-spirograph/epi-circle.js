class EpiCircle {
  constructor(x, y, radius, level, parent, direction, k, ratio) {
    this._x = x;
    this._y = y;
    this._r = radius;
    this._level = level;
    this._parent = parent;
    this._direction = direction;
    this._angle = -HALF_PI;
    this._oneRevolution = false;
    this._k = k;
    this._angleVelocity = radians((level%2==0?1:-1) * (Math.pow(k, this._level-1))) * 0.05;
    this._ratio = ratio;
  }

  update() {
    if (this._parent) {
      let rSum = this._parent._r + ((this._direction == EpiCircle.OUTSIDE? 1 : -1)*this._r);
      this._x = this._parent._x + rSum * cos(this._angle);
      this._y = this._parent._y + rSum * sin(this._angle);
      if (Math.abs((this._angle + HALF_PI)/TWO_PI) >= 1) {
        this._oneRevolution = true;
      }
      this._angle += this._angleVelocity;
    }
  }

  addChild() {
    let newR = this._r * this._ratio;
    let newX = this._x + this._r + (this._direction == EpiCircle.OUTSIDE? newR : -newR) ;
    this._child = new EpiCircle(newX, this._y, newR, this._level+1, this, 
      this._direction, this._k, this._ratio);
    return this._child;
  }

  show() {
    stroke(SketchColor.gold().alpha50().stringify());
    noFill();
    circle(this._x, this._y, this._r*2);
  }
}

EpiCircle.INSIDE = 0;
EpiCircle.OUTSIDE = 1;