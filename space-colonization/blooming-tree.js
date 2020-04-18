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
    // this.branches.forEach(branch => {
    //   if (branch.bloom && this.bloomingRadius > branch.wid) {
    //     noStroke();
    //     fill(this.bloomingColor);
    //     circle(branch.pos.x,branch.pos.y,this.bloomingRadius);
    //   }
    // });
    this.bloomingPoints.forEach(bloomingPoint => {
      // if (branch.bloom && this.bloomingRadius > branch.wid) {
        noStroke();
        fill(this.bloomingColor);
        circle(bloomingPoint.x,bloomingPoint.y,this.bloomingRadius);
      // }
    });
  }
  
}