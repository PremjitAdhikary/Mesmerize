class Tree {

  constructor(x, y, bg, config) {
    this.x = x;
    this.y = y;
    this.z = config.z;
    this.bg = bg;
    this.plantRoot(config)
  }

  plantRoot(config) {
    this.root = new Branch(
      createVector(this.x, this.y), 
      createVector(this.x, this.y - Math.floor(random(config.minHeight, config.maxHeight))),
      radians(random(config.minAngle, config.maxAangle)),
      config.branchColor(), config.weight, config.level, config.maxBranches, 
      config.minLengthMult, config.maxLengthMult, config.leafEnclosureSize, 
      config.minLeaves, config.maxLeaves, 
      this.bg);
  }

  show() {
    this.root.show();
  }

}