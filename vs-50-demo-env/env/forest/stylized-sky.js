class StylizedSky extends Sky {

  constructor(groundLevel, hueTop, hueBottom) {
    super(groundLevel);
    this.hue = hue;
    this.hueTop = hueTop;
    this.hueBottom = hueBottom;
  }

  preRender() {
    if (this.renderReady) return;
    this.skyBG.noFill();
    this.skyBG.strokeWeight(1);
    for (let i = 0; i <= this.groundLevel; i++) {
      let hue = Math.floor(map(i, 0, this.groundLevel, this.hueTop, this.hueBottom));
      let saturation = Math.floor(map(i, 0, this.groundLevel, 70, 15));
      this.skyBG.stroke(color('hsb('+hue+', '+saturation+'%, 85%)'));
      this.skyBG.line(0, i, width, i);
    }
    for (let i = 0; i < 50; i++) {
      let c = SketchColor.blend(SketchColor.yellow(), SketchColor.white())
        .alpha((2 + i)/100).stringify();
      this.skyBG.stroke(c);
      this.skyBG.strokeWeight(1);
      this.skyBG.circle(width - 45, 30, 100 - i);
    }
    this.skyBG.fill(SketchColor.blend(SketchColor.yellow(), SketchColor.white()).stringify());
    this.skyBG.circle(width - 45, 30, 50);
    this.renderReady = true;
  }

}