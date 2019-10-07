class BaseMinkowskiCurve {

  constructor(gens, color) {
    this._generations = gens;
    this._currentGeneration = 1;
    this._currentCurve;
    this._prevCurve;
    this._color = color;
    this.reset();
  }

  show() {
    stroke(this._color);
    strokeWeight(1);
    this.drawCurve();
    if (this._currentGeneration >= this._generations) {
      return;
    }
    this.generateNextCurve();
    this._currentGeneration++;
  }

  drawCurve() {
    for (let line of this._currentCurve) {
      line.show();
    }
  }

  generateNextCurve() {
    this._prevCurve = this._currentCurve;
    this._currentCurve = [];
    for (let line of this._prevCurve) {
      this._currentCurve.push(new MinkowskiLine(line.getA(), line.getB()));
      this._currentCurve.push(new MinkowskiLine(line.getB(), line.getC()));
      this._currentCurve.push(new MinkowskiLine(line.getC(), line.getD()));
      this._currentCurve.push(new MinkowskiLine(line.getD(), line.getE()));
      this._currentCurve.push(new MinkowskiLine(line.getE(), line.getF()));
      this._currentCurve.push(new MinkowskiLine(line.getF(), line.getG()));
      this._currentCurve.push(new MinkowskiLine(line.getG(), line.getH()));
    }
  }

  reset() {
    this._currentGeneration = 1;
    this._currentCurve = [];
    this.initCurve();
  }

  initCurve() {
    // impement this
  }

}