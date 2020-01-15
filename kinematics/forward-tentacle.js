class ForwardTentacle {

  constructor(tentacleLength, numOfSegments, baseAngle, segmentAngle) {
    let baseLength = ForwardTentacle.calculateBaseSegmentLength(tentacleLength, numOfSegments);
    this._base = new SimpleSegment(baseLength, 
      ForwardTentacle.baseWidth, 
      SketchColor.gold().stringify(),
      Segment.withAnchor(createVector(width/2, height)));
      this._base.setBaseAngle(baseAngle);
    
    let parent = this._base;
    for(let i=1; i<numOfSegments; i++) {
      let child = new SimpleSegment(parent._len*ForwardTentacle.segmentLengthRatio, 
        map(i, 0, numOfSegments-1, ForwardTentacle.baseWidth, 
          ForwardTentacle.baseWidth/numOfSegments), 
        SketchColor.gold().stringify(),
        Segment.withParent(parent));
      child.setBaseAngle(segmentAngle);
      parent = child;
    }
    this._top = parent;
  }

  render() {
    this.renderSegments();
    this.renderTop();
  }

  renderSegments() {
    let current = this._base;
    while(current) {
      current.update();
      current.render();
      current = current._child;
    }
  }

  renderTop() {
    noStroke();
    fill(SketchColor.red().stringify());
    circle(this._top._tip.x, this._top._tip.y, 5);
  }

  setBaseAngle(angle) {
    this._base.setBaseAngle(angle);
  }

  setSegmentAngle(angle) {
    let current = this._base;
    while(current._child) {
      current._child.setBaseAngle(angle);
      current = current._child;
    }
  }

  topPosition() {
    return this._top._tip.copy();
  }
}

ForwardTentacle.segmentLengthRatio = 0.9;
ForwardTentacle.baseWidth = 10;

/**
 * Given the total number of segments in the tentacle and the tentacle length, considering 
 * every child segment is shorter that its parent by a ratio, here geometric series formula 
 * is used to calculate the base segment length.
 * 
 * Let the base segment be of length a.
 * Let the ratio be r. 
 * Using Geometric Progression, the segments would be as follows:
 * a, ar, a(r^2), a(r^3) ...
 * For n segments, using Geometric Series formula, the length L can be written as:
 * a(1-r^n)/(1-r) = L
 * Here L, r, n is known to us. SO easy to find a.
 */
ForwardTentacle.calculateBaseSegmentLength = (tentacleLength, numOfSegments) => 
    tentacleLength * (1 - ForwardTentacle.segmentLengthRatio) 
    / (1 - Math.pow(ForwardTentacle.segmentLengthRatio, numOfSegments));