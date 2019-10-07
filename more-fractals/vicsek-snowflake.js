class VicsekSnowflake extends BaseCantor {

  constructor() {
    super(7, SketchColor.red().stringify());
  }

  initCantor() {
    this.cross(width/2, height/2, height * 0.95, this._currentGeneration);
  }

  cross(x, y, len, gen) {
    line(x - len/2, y, x + len/2, y);
    line(x, y - len/2, x, y + len/2);

    if (gen > 1) {
      let nextLen = len / 3;
      this.cross(x - nextLen, y, nextLen, gen - 1);
      this.cross(x + nextLen, y, nextLen, gen - 1);
      this.cross(x, y, nextLen, gen - 1);
      this.cross(x, y - nextLen, nextLen, gen - 1);
      this.cross(x, y + nextLen, nextLen, gen - 1);
    }
  }

}