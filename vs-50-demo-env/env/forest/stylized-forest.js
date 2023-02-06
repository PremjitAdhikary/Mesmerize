class StylizedForest extends Forest {

  constructor(config, cx) {
    super(config, cx);
    if (this.config.tint) this.tint = this.config.tint();
  }

  generateTree(i) {
    return  new StylizedTree(Forest.BUFFER/2 + this.dX*i + this.dX/2 + random(-10, 10), 
      400, this.forestBG, this.config);
  }

  render() {
    super.render();
    if (this.tint) {
      noStroke();
      fill(this.tint);
      rect(0, 0, width, height);
    }
  }

}