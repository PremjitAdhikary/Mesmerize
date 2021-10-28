class Ladi extends FwParticle {

  constructor(x, y, totalCount, colors = [SketchColor.red(), SketchColor.orange()]) {
    super(x, y);
    this._totalCount = totalCount;
    this._currentCount = 0;
    this._colors = colors;

    this._ladis = [];
  }
  
  show(envX, envY) {
    if (this.isOver()) return;
    this.update();
    this._ladis.forEach( l => l.show(envX, envY) );
  }

  update() {
    if (this._currentCount >= this._totalCount) return;
    this._currentCount++;
    this._offsetX = Math.floor(this._currentCount / 2) * 0.08;
    this._offsetY = this._currentCount % 2 == 0 ? 3 : -3;
    let rX = this._absX + this._offsetX;
    let rY = this._absY + this._offsetY;
    this.addLadi(rX, rY, this._currentCount % 3 == 0);
  }

  isOver() {
    return !(this._currentCount != this._totalCount || !this._ladis[this._totalCount-1].isOver());
  }

  addLadi(x, y, addSound) {
    let bomb = new Bomb(x, y, this._colors);
    bomb.timer = Math.floor(random(3, 4));
    bomb.totalParticles = Math.floor(random(6, 8));
    bomb.particleSize = 3;
    bomb.particleTrailSize = 1;
    if (addSound && random(100) > 50)
      bomb.soundPool = shortSoundPool;
    bomb.explode();
    this._ladis.push(bomb);
  }

}
