class Branch {

  constructor(start, end, angle, color, weight, level, 
      maxBranches, minLengthMult, maxLengthMult, 
      leafEnclosureSize, minLeaves, maxLeaves, bg) {
    this.start = start;
    this.end = end;
    this.angle = angle;
    this.maxBranches = maxBranches;
    this.minLengthMult = minLengthMult;
    this.maxLengthMult = maxLengthMult;
    this.bg = bg;
    this.color = color;
    this.weight = weight;
    this.level = level;
    this.leafEnclosureSize = leafEnclosureSize;
    this.minLeaves = minLeaves;
    this.maxLeaves = maxLeaves;
    this.branches = [];
    this.leaves = [];

    this.branchOut();
  }

  branchOut() {
    if (this.level <= 2) this.addLeaves();
    if (!this.maxBranches || this.level <= 1) return;

    let numOfBranches = round(random(2, this.maxBranches));

    for (let i = 0, a = round(random(2, (this.maxBranches-numOfBranches))); 
        i < numOfBranches; i++, a++) {
      let dir = p5.Vector.sub(this.end, this.start);
      dir.mult(random(this.minLengthMult, this.maxLengthMult));
      dir.rotate(-this.angle/2);
      dir.rotate(a * this.angle / (this.maxBranches+1));
      let subBranch = p5.Vector.add(this.end, dir);
      this.branches.push(this.createSubBranch(subBranch));
    }
  }

  createSubBranch(subBranch) {
    return new Branch(
      this.end, subBranch, this.angle, this.color, 
      max(1, this.weight-1.5), this.level-1, this.maxBranches, 
      this.minLengthMult, this.maxLengthMult, 
      this.leafEnclosureSize, this.minLeaves, this.maxLeaves, this.bg);
  }

  addLeaves() {
    for (let l=0; l<random(this.minLeaves, this.maxLeaves); l++) {
      this.leaves.push(this.randomPointInAnEllipse(this.leafEnclosureSize, this.end.x, 1, this.end.y, 0.6));
    }
  }

  show() {
    this.bg.stroke(this.color);
    this.bg.fill(this.color);
    this.bg.strokeWeight(this.weight);
    this.bg.line(this.start.x, this.start.y, this.end.x, this.end.y);
    
    if (this.hasSubBranches()) {
      this.branches.forEach( b => b.show() );
    }

    if (this.hasLeaves()) {
      this.leaves.forEach( l => this.bg.circle(l.pos.x, l.pos.y, l.size) );
    }
  }

  hasSubBranches() { return this.branches }
  hasLeaves() { return this.leaves }
  
  randomPointInAnEllipse(radius, xOffset, xMult, yOffset, yMult) {
    let a = random(0, TWO_PI);
    let r = radius * sqrt(random(0,1));
    return {
      pos: createVector(xOffset + xMult * r * cos(a), yOffset + yMult * r * sin(a)),
      size: random(1.5, 3.5)
    };
  }

}