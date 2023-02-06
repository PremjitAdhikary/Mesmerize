class StylizedArrow extends Arrow {
  
  constructor(config) {
    super(config);
    this.baseColorGenerator = () => SketchColor.white();
    this.baseColor = this.baseColorGenerator().stringify();
    this.hilightColor = new SketchColor(142, 212, 222).stringify();
  }

  render() {
    this.setupColor();
    strokeWeight(1);
    rect(-1, -1, this.len+2, 4);
    triangle(this.len, -2, this.len, 4, this.len+5, 0);
    if (this.launched) {
      stroke(this.hilightColor);
      fill(this.hilightColor);
      rect(0, 0, this.len, 2);
      triangle(this.len, -2, this.len, 4, this.len+5, 0);
    }
  }

}