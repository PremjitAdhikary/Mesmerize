class StylizedTree extends Tree {

  constructor(x, y, bg, config) {
    super(x, y, bg, config);
  }

  plantRoot(config) {
    this.root = new StylizedBranch(
      createVector(this.x, this.y), 
      createVector(this.x, this.y - Math.floor(random(config.minHeight, config.maxHeight))),
      radians(random(config.minAngle, config.maxAangle)),
      config.branchColor(), config.weight, config.level, config.maxBranches, 
      config.minLengthMult, config.maxLengthMult, config.leafEnclosureSize, 
      config.minLeaves, config.maxLeaves, 
      this.bg);
    this.root.updateLeafColors(config.leafColors());
  }

}