class CantorSet extends BaseCantor {

  constructor() {
    super(6, SketchColor.yellow().stringify());
    this._gap = 70;
  }

  initCantor() {
    this.cantor(width/8, 50, width*3/4, this._currentGeneration);
  }

  cantor(x, y, len, gen) {
    rect(x, y, len, 10);

    if (gen > 1) {
      this.cantor(x, y + this._gap, len/3, gen-1);
      this.cantor(x+len*2/3, y + this._gap, len/3, gen-1);
    }
  }

}