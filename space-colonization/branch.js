class Branch {
  constructor(parent, pos, dir, len, wid, minWid, widRatio, branchColor) {
    this.parent = parent;
    this.pos = pos;
    this.dir = dir;
    this.originalDir = dir;
    this.len = len;
    this.wid = wid;
    this.minWid = minWid;
    this.widRatio = widRatio;
    this.color = branchColor;
    this.extended = false;

    this.count = 0;
    this.me = this;
  }

  show() {
    if (this.parent == null) return;
    stroke(this.color);
    strokeWeight(this.wid);
    line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
  }

  next() {
    let nextDir = p5.Vector.mult(this.dir, this.len);
    let nextPos = p5.Vector.add(this.pos, nextDir);
    this.extended = true;
    let newWid = (this.wid * this.widRatio) < this.minWid ? this.wid : (this.wid * this.widRatio);
    return new Branch(
      this, nextPos, this.dir.copy(), this.len, newWid, this.minWid, this.widRatio, this.color);
  }

  reset() {
    this.dir = this.originalDir;
    this.count = 0;
  }
}