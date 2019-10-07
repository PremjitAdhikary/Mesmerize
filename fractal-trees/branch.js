class Branch {

  constructor(start, end, angle, color, branchColor, weight, level) {
    this._start = start;
    this._end = end;
    this._angle = angle;
    this._color = color;
    this._weight = weight;
    this._level = level;
    this._branches;
    this._branchColor = branchColor;
    if (!branchColor) {
      this._branchColor = this._color;
    }

    this.branchOut();
  }

  show() {
    if (this._level <= 3) {
      stroke(this._color);
    } else {
      stroke(this._branchColor);
    }
    strokeWeight(this._weight);
    line(this._start.x, this._start.y, this._end.x, this._end.y);
    
    if (this._branches) {
      for (let b of this._branches) {
        b.show();
      }
    }
  }

  branchOut() {
    if (this._level <= 1) return;
    this._branches = [];

    let dir = p5.Vector.sub(this._end, this._start);
    dir.mult(0.75); // shorten branch
    
    dir.rotate(this._angle);
    let rightEnd = p5.Vector.add(this._end, dir);
    this._branches.push(new Branch(
      this._end, rightEnd, this._angle, this._color, this._branchColor, max(1,this._weight-1), this._level-1));
    
    dir.rotate(-(2*this._angle));
    let leftEnd = p5.Vector.add(this._end, dir);
    this._branches.push(new Branch(
      this._end, leftEnd, this._angle, this._color, this._branchColor, max(1,this._weight-1), this._level-1));
  }

}