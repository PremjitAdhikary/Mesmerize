class Tree {

  constructor(params) {
    this.qtAttractors = new QuadTree(width/2, height/2, width, height, 10);
    this.qtBranches = new QuadTree(width/2, height/2, width, height, 10);

    this.attractors = this.constructAttractors(params);
    this.branchColor = params.branchColor;
    this.root = new Branch(
      null, 
      params.root, 
      createVector(0,-1), 
      params.branchLen, 
      params.branchWid, 
      params.branchMinWid, 
      params.branchWidRatio,
      params.branchColor);
    this.branches = [];
    this.branches.push(this.root);
    this.minDist = params.minDist;
    this.maxDist = params.maxDist;

    this.mainStemInVicinity = false;
    this.allGrown = false;
    if (params.quadTreeColor) {
      this.qtBranches.color = params.quadTreeColor;
    }
    this.qtBranches.insert(this.root.pos.x, this.root.pos.y, this.root);

    this.colorQuadTree = false;
  }

  constructAttractors(params) {
    let attractors = [];
    for (let a=0; a<params.attractorsCount; a++) {
      let attractor = new Attractor(params.generateV(), params.attractorColor);
      attractors.push(attractor);
      this.qtAttractors.insert(attractor.pos.x, attractor.pos.y, attractor);
    }
    return attractors;
  }

  show() {
    if (this.colorQuadTree) {
      this.qtBranches.show();
    }
    this.branches.forEach(b => b.show());
    this.attractors.forEach(l => l.show());
  }

  grow() {
    if (!this.mainStemInVicinity) {
      this.growMainStem();
    } else if (!this.allGrown) {
      this.growBranches();
    }
  }

  growMainStem() {
    let grown = false;
    for (let b=this.branches.length-1; b>=0; b--) {
      if (this.branches[b].extended) continue;
      if (!this.branches[b].extended && this.getProximalAttractors(this.branches[b]).length == 0) {
        let branch = this.branches[b].next();
        this.qtBranches.insert(branch.pos.x, branch.pos.y, branch);
        this.branches.push(branch);
        grown = true;
      }
    }
    if (!grown) {
      this.mainStemInVicinity = true;
    }
  }

  getProximalAttractors(branch) {
    let qtResult = this.qtAttractors.query(
      branch.pos.x, branch.pos.y, this.maxDist*2, this.maxDist*2);
    return qtResult.filter(l => p5.Vector.dist(l.pos, branch.pos) <= this.maxDist);
  }

  growBranches() {
    let grown = false;
    this.attractors.forEach(attractor => {
      if (!attractor.reached) {
        let closestBranch = this.getClosestBranch(attractor);
        if (closestBranch != null) {
          this.setupNextBranch(closestBranch, attractor);
        }
      }
    });

    for (let b=this.branches.length-1; b>=0; b--) {
      if (this.branches[b].count > 0) {
        this.growNextBranch(this.branches[b]);
        grown = true;
      }
    }

    if (!grown) {
      this.allGrown = true;
    }
  }
  
  getClosestBranch(attractor) {
    let qtResult = this.qtBranches.query(
      attractor.pos.x, attractor.pos.y, this.maxDist*2, this.maxDist*2);
    let closestBranch = null;
    let minDistYet = this.maxDist;
    for (let b=0; b<qtResult.length; b++) {
      let branch = qtResult[b];
      let dist = p5.Vector.dist(attractor.pos, branch.pos);
      if (dist < this.minDist) {
        closestBranch = null;
        attractor.reached = true;
        break;
      } else if (dist < minDistYet) {
        closestBranch = branch;
        minDistYet = dist;
      }
    }
    return closestBranch;
  }

  setupNextBranch(branch, attractor) {
    let newDir = p5.Vector.sub(attractor.pos, branch.pos);
    newDir.normalize();
    branch.dir.add(newDir);
    branch.count++;
  }

  growNextBranch(branch) {
    branch.dir.div(branch.count+1);
    let newBranch = branch.next();
    this.qtBranches.insert(newBranch.pos.x, newBranch.pos.y, newBranch);
    this.branches.push(newBranch);
    branch.reset();
  }
  
}