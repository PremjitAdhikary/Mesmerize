class Grass {

  constructor(gColor) {
    this.blades = width;
    this.bladeLengths = [];
    this.aveLen = height - 20;
    this.lenDiff = 15;
    this.bladesBG = createGraphics(width, height);
    this.renderReady = false;
    this.color = gColor;
    this.cX = round(random(0, width));
  }

  preRender() {
    if (this.renderReady) return;
    for (let i = 0; i < this.blades; i++) {
      this.bladeLengths.push(this.aveLen + random(-this.lenDiff, this.lenDiff));
    }
    this.bladesBG.noStroke();
    this.bladesBG.fill(this.color);
    this.bladesBG.beginShape();
    this.bladesBG.vertex(0, height);
    for (let i = 0; i < this.blades; i++) {
      this.bladesBG.vertex(i, this.bladeLengths[i]);
    }
    this.bladesBG.vertex(width, height);
    this.bladesBG.endShape();
    this.renderReady = true;
  }

  render() {
    if (!this.renderReady) return;
    image(this.bladesBG, -this.cX, 0);
    image(this.bladesBG, width - this.cX, 0);
  }

  updateCX(cx) {
    if (!this.renderReady) return;
    this.cX = (round(cx) + width) % width;
  }

  get objectsBuilt() { return this.renderReady ? 1 : 0; }

  get totalObjects() { return 1; }

}