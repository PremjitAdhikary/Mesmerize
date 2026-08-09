class Target {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._radius = 25;
    let centers = [{x:0, y:0}, {x:-18, y:0}, {x:18, y:0}, {x:-9, y:-15}, {x:9, y:-15}, {x:-9, y:15}, {x:9, y:15}];
    let len = 11;
    this._hive = [];
    centers.forEach(c => {
      this._hive.push(new NGonUnit(x+c.x, y+c.y, 6, len, orange, true));
      this._hive.push(new NGonUnit(x+c.x, y+c.y, 6, len-2, 0, true));
    });
  }

  render() {
    this._hive.forEach(h => h.show());
  }

  isHit(bee) {
    return dist(this._x, this._y, bee.x, bee.y) < this._radius;
  }
}