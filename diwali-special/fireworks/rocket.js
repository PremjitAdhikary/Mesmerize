class Rocket extends FwParticle {

  constructor(x, y, 
      color = SketchColor.blend(SketchColor.yellow(), SketchColor.white(), SketchColor.white())) {
    super(x, y);
    this._color = color;
    this._timer = 50;
    this._fadeTimer = 25;
    this._showLead = true;
    this._alpha = 1;
    this._dAlpha = 1 / (this._fadeTimer + 1);

    this._angle = random(3);
    this._vel = createVector(0,-5);
    this._acc = createVector(0.02,0.1);

    this._path = [];
    this._path.push(createVector(this._absX, this._absY));
  }

  set timer(value) { this._timer = value; }

  set acceleration(value) { this._acc = value; }

  set velocity(value) {this._vel = value; }

  set showLead(value) {this._showLead = value; }

  addBomb(bomb) {
    this._bomb = bomb;
  }

  show(envX, envY) {
    if (this.isOver()) return;
    this.update();
    this.draw(envX, envY);
    if (this._bomb && this._bomb._hasExploded) 
      this._bomb.show(envX, envY);
  }

  update() {
    if (this.isTopPoint() && !this.isFadeOver()) {
      if (this._bomb && !this._bomb._hasExploded) {
        this._bomb.explode(this._absX, this._absY);
      }
      this._alpha -= this._dAlpha;
      this._fadeTimer--;
    }
    if (!this.isTopPoint()) {
      this._absX += this._vel.x;
      this._absY += this._vel.y;
      this._vel.add(this._acc);
      this._path.push(createVector(this._absX, this._absY));
      this._timer--;
    }
  }

  draw(envX, envY) {
    if (this.isFadeOver()) return;
    stroke(this._color.alpha(this._alpha).stringify());
    let rX, rY, pX, pY;
    for (let i=0; i<this._path.length; i++) {
      rX = this.getRelativeX(envX, this._path[i].x);
      rY = this.getRelativeX(envY, this._path[i].y);
      strokeWeight(i<this._path.length-1 ? 2 : this.getLeadWeight());
      point(rX, rY);
      if (i >= 1) {
        strokeWeight(1);
        line(pX, pY, rX, rY);
      }
      pX = rX;
      pY = rY;
    }
  }

  getLeadWeight() {
    return this._showLead ? 5 : 2;
  }

  isTopPoint() {
    return this._timer <= 0;
  }

  isFadeOver() {
    return this._fadeTimer <= 0;
  }

  isOver() {
    return this._bomb ? this._bomb.isOver() : this.isFadeOver();
  }

}