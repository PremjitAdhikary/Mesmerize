class StylizedBranch extends Branch {

  constructor(start, end, angle, branchColor, weight, level, 
      maxBranches, minLengthMult, maxLengthMult, 
      leafEnclosureSize, minLeaves, maxLeaves, bg) {
    super(start, end, angle, branchColor, weight, level, 
      maxBranches, minLengthMult, maxLengthMult, 
      leafEnclosureSize, minLeaves, maxLeaves, bg);
    this.scribble = new Scribble(this.bg);
    this.scribble.numEllipseSteps = random([5,6,7]);
  }

  createSubBranch(subBranch) {
    return new StylizedBranch(
      this.end, subBranch, this.angle, this.color, 
      max(1, this.weight*0.6), this.level-1, this.maxBranches, 
      this.minLengthMult, this.maxLengthMult, 
      this.leafEnclosureSize, this.minLeaves, this.maxLeaves, this.bg);
  }

  updateLeafColors(leafColors) {
    this.leafColors = leafColors;
    
    if (this.hasSubBranches()) {
      this.branches.forEach( b => b.updateLeafColors(leafColors) );
    }
  }

  show() {
    this.bg.stroke(this.color);
    this.bg.fill(this.color);
    this.bg.strokeWeight(this.weight);
    this.scribble.scribbleLine(this.start.x, this.start.y, this.end.x, this.end.y);
    
    if (this.hasSubBranches()) {
      this.branches.forEach( b => b.show() );
    }

    if (this.hasLeaves()) {
      this.leaves.forEach( l => this.drawLeaf(l) );
    }
  }

  drawLeaf(leaf) {
    let randomLeafColor = random(this.leafColors);
    this.bg.stroke(randomLeafColor);
    this.bg.fill(randomLeafColor);
    this.bg.strokeWeight(1);
    this.bg.circle(leaf.pos.x, leaf.pos.y, leaf.size);
    this.bg.strokeWeight(3);
    this.scribble.scribbleEllipse(leaf.pos.x, leaf.pos.y, leaf.size, leaf.size);
  }

}