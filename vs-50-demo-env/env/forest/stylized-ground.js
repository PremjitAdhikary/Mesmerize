class StylizedGround extends Ground {

  constructor(color, stoneColor, level) {
    super(color, level);
    this.stoneColor = stoneColor;
    this.groundBG = createGraphics(width, height);
    this.cX = round(random(0, width));
    this.scribble = new Scribble(this.groundBG);
  }

  preRender() {
    if (this.renderReady) return;
    this.groundBG.stroke(this.color);
    this.groundBG.fill(this.color);
    this.groundBG.rect(0, this.level - 5, width, height - this.level + 5);
    this.renderReady = true;
    let totalStoneChipsOnRoad = width/15;
    this.groundBG.stroke(this.stoneColor);
    this.groundBG.strokeWeight(1);
    for (let j=0; j<12; j++) {
      for (let i=0; i<totalStoneChipsOnRoad; i++) {
        this.scribble.numEllipseSteps = random([5,6,7]);
        if (random(100) > 20)
          this.groundBG.noFill();
        else 
          this.groundBG.fill(this.stoneColor);
        this.scribble.scribbleEllipse(
          width/totalStoneChipsOnRoad * (i + (j%2 == 0 ? 0 : 0.5)), 
          this.level + 6 * (j+0.5) + random(-2, 2), 
          random(15, 20), random(4, 6));
      }
    }
  }

  updateCX(cx) {
    if (!this.renderReady) return;
    this.cX = (round(cx) + width) % width;
  }

  render() {
    if (!this.renderReady) return;
    image(this.groundBG, -this.cX, 0);
    image(this.groundBG, width - this.cX, 0);
  }

}