class Bomb extends FwParticle {

  constructor(x, y, colors = [SketchColor.yellow()]) {
    super(x, y);
    this._colors = colors;
    this._timer = Math.floor(random(180, 240));
    this._particles = [];
    this._totalParticles = Math.floor(random(10, 15));
    this._particleSize = 5;
    this._particleTrailSize = 5;

    this._hasExploded = false;
  }

  set timer(value) { this._timer = value; }

  set totalParticles(value) { this._totalParticles = value; }

  set particleSize(value) { this._particleSize = value; }

  set particleTrailSize(value) { this._particleTrailSize = value; }

  set soundPool(value) { this._soundPool = value; }

  explode(x = this._absX, y = this._absY) {
    if (this._soundPool) this._soundPool.play();
    this._absX = x, this._absY = y;
    for (let p = 0; p < this._totalParticles; p++) {
      let particle = new BombParticle(this._absX, this._absY, 
        random(this._colors), this._particleSize, this._particleTrailSize);
      particle.registerTimerFunc(() => this._timer);
      this._particles.push(particle);
    }
    this._hasExploded = true;
  }

  show(envX, envY) {
    if (this.isOver()) return;
    if (!this._hasExploded) return;
    this._particles.forEach( p => p.show(envX, envY) );
    this._timer--;
  }

  isOver() {
    return this._timer <= 0;
  }

}

class BombParticle extends FwParticle {

  constructor(x, y, color, size, trailSize) {
    super(x, y);
    this._color = color;
    this._frameCount = 0;
    this._noUpdate = 10;
    this._trailSize = trailSize;

    this._vel = (p5.Vector.random2D()).mult(random(4,6));
    this._acc = createVector(0, 0.3);
    this._alpha = 1.0;
    this._path = [];
    this._size = size;

    this.timerFunc;
  }

  registerTimerFunc(func) {
    this.timerFunc = func;
    if (this.timerFunc() > this._noUpdate) 
      this._dAlpha = 1 / (this.timerFunc() + 2 - this._noUpdate);
  }

  show(envX, envY) {
    if (this.isOver()) return;
    this.update();
    this.draw(envX, envY);
    this._frameCount++;
  }

  isOver() {
    return this.timerFunc() <= 0;
  }

  draw(envX, envY) {
    stroke(this._color.alpha(this._alpha).stringify());
    for (let s = this._path.length-1; s >=0 && s >= this._path.length - this._trailSize; s--) {
      let rX = this.getRelativeX(envX, this._path[s].x);
      let rY = this.getRelativeX(envY, this._path[s].y);
      strokeWeight(s<this._path.length-1 ? this._size/2 : this._size);
      point(rX, rY);
    }
  }

  update() {
    this._path.push(createVector(this._absX, this._absY));
    this._absX += this._vel.x;
    this._absY += this._vel.y;
    if (this._frameCount < this._noUpdate) return;
    this._vel.add(this._acc);
    this._alpha -= this._dAlpha;
  }

}