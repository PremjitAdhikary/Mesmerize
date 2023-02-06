class Sky {

  constructor(groundLevel) {
    this.groundLevel = groundLevel;
    this.skyBG = createGraphics(width, height);
    this.renderReady = false;
  }

  preRender() {
    if (this.renderReady) return;
    this.skyBG.noFill();
    this.skyBG.strokeWeight(1);
    for (let i = 0; i <= this.groundLevel; i++) {
      let inter = map(i, 0, this.groundLevel, 185, 255);
      this.skyBG.stroke(round(inter));
      this.skyBG.line(0, i, width, i);
    }
    this.renderReady = true;
  }

  render() {
    if (!this.renderReady) return;
    image(this.skyBG, 0, 0);
  }

  updateCX() { }

  get objectsBuilt() { return this.renderReady ? 1 : 0; }

  get totalObjects() { return 1; }

}