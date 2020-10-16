class BloomingTree extends Tree {

  constructor(params) {
    super(params);
    this.bloomingColor = params.bloomingColor;
    this.bloomingRadius = params.bloomingRadius;
    this.bloomingFunction = params.bloomingFunction;
    this.bloomingPoints = [];
  }

  grow() {
    super.grow();
    if (this.allGrown) {
      this.bloom();
    }
  }

  bloom() {
    for (let b=0; b<this.branches.length; b++) {
      let branch = this.branches[b];
      if (!branch.extended 
          && !branch.bloom 
          && this.bloomingRadius > branch.wid) {
        this.bloomingFunction(this.bloomingPoints, branch.pos);
        branch.bloom = true;
        break;
      }
    }
  }

  show() {
    super.show();
    this.bloomingPoints.forEach(bloomingPoint => {
        noStroke();
        fill(this.bloomingColor);
        circle(bloomingPoint.x,bloomingPoint.y,this.bloomingRadius);
    });
  }
  
}