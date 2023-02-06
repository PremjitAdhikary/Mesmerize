class Ground {

  constructor(color, level) {
    this.color = color;
    this.level = level;
    this.renderReady = false;
  }

  preRender() {
    if (this.renderReady) return;
    this.renderReady = true;
  }

  render() {
    if (!this.renderReady) return;
    strokeWeight(1);
    stroke(this.color);
    fill(this.color);
    rect(0, this.level, width, height - this.level);
  }

  updateCX() { }

  get objectsBuilt() { return this.renderReady ? 1 : 0; }

  get totalObjects() { return 1; }
}