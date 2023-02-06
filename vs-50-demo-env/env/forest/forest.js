class Forest {

  constructor(config, cx) {
    this.forestBGW = config.bgWidth();
    this.forestBG = createGraphics(this.forestBGW + Forest.BUFFER, height);
    this.totalTrees = round(this.forestBGW / config.gap());
    this.dX = (this.forestBGW - Forest.BUFFER) / this.totalTrees;
    this.forest = [];
    this.renderReady = false;
    this.config = config;
    this.cX = cx;
  }

  preRender() {
    if (this.renderReady) return;
    let i = this.forest.length;
    let tree = this.generateTree(i);
    this.forest.push(tree);
    if (this.config.chanceToPlaceTreeAtGap()) tree.show();
    if (this.forest.length == this.totalTrees) this.renderReady = true;
  }

  generateTree(i) {
    return new Tree(Forest.BUFFER/2 + this.dX*i + this.dX/2 + random(-10, 10), 
      400, this.forestBG, this.config);
  }

  render() {
    if (!this.renderReady) return;
    image(this.forestBG, -this.cX, 0);
    if ((this.forestBGW - this.cX) < width) {
      image(this.forestBG, this.forestBGW - this.cX, 0);
    }
  }

  updateCX(cx) {
    if (!this.renderReady) return;
    this.cX = (round(cx) + this.forestBGW) % this.forestBGW;
  }

  get objectsBuilt() { return this.forest.length; }

  get totalObjects() { return this.totalTrees; }
}

Forest.BUFFER = 350;