class BrownianSnowflake extends BrownianTree {

  constructor(configs) {
    super(configs);
    this._rotations = configs.rotations;
  }

  show() {
    translate(width/2, height/2);
    for (let i = 0; i < this._rotations; i++) {
      rotate(TWO_PI / this._rotations);
      this._particles.forEach( p => p.show() );
      push();
      scale(1, -1);
      this._particles.forEach( p => p.show() );
      pop();
    }
  }

}

const towardsCenterVelocityFunc = (yOffset, maxYOffset) => (pos, size) => {
  pos.x -= size;
  pos.x = constrain(pos.x, 0, width/2);
  pos.y -= random(-yOffset, yOffset);
  pos.y = constrain(pos.y, 0, maxYOffset);
};

const SNOWFLAKE_VARIANT_1 = {
  treeSize: 50, 
  treeSizeIncr: 50, 
  unstuckNum: 20, 
  maxTreeSize: 300, 
  particleGroup:  5, 
  particleSize: 3, 
  rotations: 6, 
  particleColor: () => 0, 
  startFunc: () => createVector(width/2, 0), 
  endReachedFunc: quadTree => p => {
    if (p.squareDist(0, 0) < p._touchDist) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: towardsCenterVelocityFunc(1.5, 60), 
  onStuckFunc: quadTree => p => {
    p._color = SketchColor.blend(SketchColor.greenyellow(), SketchColor.white()).stringify();
    quadTree.insert(p._current.x, p._current.y, p);
  }
};

const SNOWFLAKE_VARIANT_2 = {
  treeSize: 100, 
  treeSizeIncr: 100, 
  unstuckNum: 20, 
  maxTreeSize: 500, 
  particleGroup:  5, 
  particleSize: 3, 
  rotations: 8, 
  particleColor: () => 0, 
  startFunc: () => createVector(width/2, random(-20, 20)), 
  endReachedFunc: quadTree => p => {
    if (p.squareDist(0, 0) < p._touchDist) {
      return true;
    }
    return particleInQuadTree(quadTree, p);
  }, 
  velocityFunc: towardsCenterVelocityFunc(3, 90), 
  onStuckFunc: quadTree => p => {
    p._color = SketchColor.skyblue().stringify();
    quadTree.insert(p._current.x, p._current.y, p);
  }
};