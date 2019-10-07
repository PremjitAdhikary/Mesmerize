class CantorSetLines extends BaseCantor {

  constructor() {
    super(12, SketchColor.greenyellow().stringify());
  }

  initCantor() {
    this.cantor(width/2, height/2, width * 0.60, this._currentGeneration, true);
  }

  cantor(x, y, len, gen, horizontal) {
    let x1 = x, x2 = x, y1 = y, y2 = y;
    // if horizontal, y1, y2 remains the same, while x1 and x2 dright len apart horizontally
    if (horizontal) {
      x1 = x - len/2;
      x2 = x + len/2;
    } else {
      // if vertital, x1, x2 remains the same, while y1 and y2 dright len apart vertically
      y1 = y - len/2;
      y2 = y + len/2;
    }
    line(x1, y1, x2, y2);

    if (gen > 1) {
      this.cantor(x1, y1, len * 0.65, gen-1, !horizontal);
      this.cantor(x2, y2, len * 0.65, gen-1, !horizontal);
    }
  }

}