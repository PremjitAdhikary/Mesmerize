class InverseTentacle {

  constructor(tentacleLength, numOfSegments, anchored){
    let segmentLength = tentacleLength/numOfSegments;
    this._base = new SimpleSegment(segmentLength, 
      InverseTentacle.baseWidth, 
      SketchColor.gold().stringify(),
      Segment.withAnchor(createVector(width/2, height-10)));
    this._base.setBaseAngle(radians(-90));

    let parent = this._base;
    for(let i=1; i<numOfSegments; i++) {
      let child = new SimpleSegment(segmentLength, 
        InverseTentacle.baseWidth,  
        SketchColor.gold().stringify(),
        Segment.withParent(parent));
      parent = child;
    }
    this._top = parent;
    this._anchored = anchored;
  }

  setAnchor(val) {
    this._anchored = val;
  }
  
  follow(target) {
    let baseAnchor = this._base._anchor.copy();
    this._top.follow(target);
    this._top.update();
    let parent = this._top._parent;
    while(parent) {
      parent.followChild();
      parent.update();
      parent = parent._parent;
    }

    if (this._anchored) {
      this._base.setAnchor(baseAnchor);
    }
  }

  render() {
    this.renderSegments();
    if (this._anchored) {
      this.renderAnchor();
    }
  }

  renderSegments() {
    let current = this._base;
    while(current) {
      current.update();
      current.render();
      current = current._child;
    }
  }

  renderAnchor() {
    stroke(SketchColor.gold().stringify());
    strokeWeight(3);
    noFill();
    circle(this._base._anchor.x, this._base._anchor.y, 15);
  }
}

InverseTentacle.baseWidth = 3;