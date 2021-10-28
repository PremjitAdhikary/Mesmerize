class FlowerPot extends FwParticle {

  constructor(x, y, totalCount) {
    super(x, y);
    this._totalCount = totalCount;
    this._currentCount = 0;

    this._sparks = [];
  }
  
  show(envX, envY) {
    if (this.isOver()) return;
    this.update();
    this._sparks.forEach( s => s.show(envX, envY) );
  }

  update() {
    if (this._currentCount >= this._totalCount) return;
    this._currentCount++;
    this.addSpark();
  }

  isOver() {
    return !(this._currentCount != this._totalCount || !this._sparks[this._totalCount-1].isOver());
  }

  addSpark() {
    let spark = new Rocket(this._absX, this._absY, 
      random([SketchColor.white(), SketchColor.yellow(), SketchColor.white()]));
    spark.timer = Math.floor(random(35, 40));
    spark.acceleration = createVector(random(-0.03, 0.03), random(0.1, 0.2));
    spark.velocity = createVector(0,random(-3, -4));
    spark.showLead = false;
    this._sparks.push(spark);
  }

}