class BaseCantor {

  constructor(gen, color) {
    this._generations = gen;
    this._currentGeneration = 1;
    this._color = color;
  }

  show() {
    stroke(this._color);
    fill(this._color);
    strokeWeight(1);
    this.initCantor();
    if (this._currentGeneration >= this._generations) {
      return;
    }
    this._currentGeneration++;
  }

  initCantor() {
    // implement
  }

  reset() {
    this._currentGeneration = 1;
  }

}