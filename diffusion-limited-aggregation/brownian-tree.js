class BrownianTree {

  constructor(configs) {
    this._particles = [];
    this._treeSize = configs.treeSize;
    this._treeSizeIncr = configs.treeSizeIncr;
    this._unstuckNum = configs.unstuckNum;
    this._maxTreeSize = configs.maxTreeSize;
    this._particleGroup = configs.particleGroup;
    this._particleSize = configs.particleSize;
    this._particleColor = configs.particleColor;

    this._quadTree = new QuadTree(width/2, height/2, width, height, 25, true);

    this.particleStartFunc = configs.startFunc;
    this.particleEndReachedFunc = configs.endReachedFunc;
    this.particleVelocityFunc = configs.velocityFunc;
    this.particleOnStuckFunc = configs.onStuckFunc;
  }

  grow() {
    if (this._particles.length > this._maxTreeSize) return;
    
    for (let i=0; i < this._particleGroup && this._particles.length <= this._treeSize; i++) {
      let start = this.generateStartPoint();
      let particle = new Particle(
        start, 
        this.particleEndReachedFunc(this._quadTree), 
        this.particleVelocityFunc, this._particleSize, 
        this._particleColor(this._particles.length), 
        this.particleOnStuckFunc(this._quadTree)
      );
      this._particles.push(particle);
    }

    if (this._particles.length >= (this._treeSize - 20) 
        && (this._particles.length - (this._particles.filter( p => p._stuck )).length) < this._unstuckNum) {
      this._treeSize += this._treeSizeIncr;
      this._treeSize = Math.min(this._maxTreeSize, this._treeSize);
    }
  }

  show() {
    this._particles.forEach( p => p.show() );
  }

  moveParticles() {
    this._particles.forEach( p => p.walk() );
  }

  generateStartPoint() {
    let start = this.particleStartFunc();
    while (true) {
      let sResult = this._quadTree.query(start.x, start.y, this._particleSize, this._particleSize);
      let touches = false;
      for (let sr of sResult) {
        if (sr.squareDist(start.x, start.y) < this._particleSize) {
          start = this.particleStartFunc();
          touches = true;
          break;
        }
      }
      if (!touches) break;
    }
    return start;
  }
}

const fullPortVelocityFunc = (pos, size) => {
  let offset = p5.Vector.random2D().mult(size);
  pos.add(offset);
  pos.x = constrain(pos.x, 0, width);
  pos.y = constrain(pos.y, 0, height);
};

const particleInQuadTree = (quadTree, particle) => {
  let qResult = quadTree.query(particle._current.x, particle._current.y, 15, 15);
  for (let t of qResult) {
    if (t.touches(particle)) {
      return true;
    }
  }
  return false;
};

const BASIC_DLA = {
  treeSize: 500, 
  treeSizeIncr: 500, 
  unstuckNum: 50, 
  maxTreeSize: 5000, 
  particleGroup:  10, 
  particleSize: 5, 
  particleColor: () => 255, 
  startFunc: () => createVector(random(0, width), random(0, height)), 
  endReachedFunc: quadTree => p => {
    if (p.squareDist(width/2, height/2) < p._touchDist) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: fullPortVelocityFunc, 
  onStuckFunc: quadTree => p => {
    p._color = SketchColor.greenyellow().stringify();
    quadTree.insert(p._current.x, p._current.y, p);
  }
};

const LINE_DLA = {
  treeSize: 500, 
  treeSizeIncr: 500, 
  unstuckNum: 50, 
  maxTreeSize: 4000, 
  particleGroup:  10, 
  particleSize: 5, 
  particleColor: () => 255, 
  startFunc: () => createVector(random(0, width), random(0, height)), 
  endReachedFunc: quadTree => p => {
    let py = p._current.y;
    if (py <= p._size) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: fullPortVelocityFunc, 
  onStuckFunc: quadTree => p => {
    p._color = SketchColor.blend(SketchColor.violet(), SketchColor.white()).stringify();
    quadTree.insert(p._current.x, p._current.y, p);
  }
};

const BOX_DLA = {
  treeSize: 500, 
  treeSizeIncr: 500, 
  unstuckNum: 50, 
  maxTreeSize: 5500, 
  particleGroup:  10, 
  particleSize: 5, 
  particleColor: () => 255, 
  startFunc: () => createVector(random(0, width), random(0, height)), 
  endReachedFunc: quadTree => p => {
    let px = p._current.x, py = p._current.y;
    if (px <= p._size || py <= p._size || px >= (width-p._size) || py >= (height-p._size)) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: fullPortVelocityFunc, 
  onStuckFunc: quadTree => p => {
    p._color = SketchColor.blend(SketchColor.green(), SketchColor.white(), SketchColor.white()).stringify();
    quadTree.insert(p._current.x, p._current.y, p);
  }
};

const vibgyor = [
  SketchColor.violet().stringify(),
  SketchColor.blend(SketchColor.indigo(),SketchColor.white()).stringify(),
  SketchColor.skyblue().stringify(),
  SketchColor.greenyellow().stringify(),
  SketchColor.yellow().stringify(),
  SketchColor.orange().stringify(),
  SketchColor.red().stringify(), 
  SketchColor.red().stringify()
];

const CIRCLE_SEED_DLA = {
  treeSize: 500, 
  treeSizeIncr: 500, 
  unstuckNum: 50, 
  maxTreeSize: 3500, 
  particleGroup:  10, 
  particleSize: 3, 
  particleColor: i => vibgyor[Math.floor(i / 500)], 
  startFunc: () => {
    let x = random() < 0.5 ? random(0, width/2 - 150) : random(width/2 + 150, width);
    let y = random() < 0.5 ? random(0, height/2 - 150) : random(height/2 + 150, height);
    return createVector(x, y);
  }, 
  endReachedFunc: quadTree => p => {
    if (p.squareDist(width/2, height/2) < (p._touchDist + 10000)) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: fullPortVelocityFunc, 
  onStuckFunc: quadTree => p => {
    quadTree.insert(p._current.x, p._current.y, p);
  }
};