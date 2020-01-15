/**
 * Basic Segment for all your Kinematics needs.
 * Think of the segment as an axis. The constant for the segment is it's length. It's anchor, 
 * it's tip and angle are all subject to external stimuli.
 * 
 * Multiple segments can be connected to assemble a limb/tentacle.
 * The anchor is the base of the segment. It can be initialized to a vector or it can be set 
 * to a parent segment. Setting it to parent segment will keep it connected to it and this segment 
 * will react to parent changes.
 * 
 * Unlike Java, Javascript classes does not allow multiple constructors. So achieve the above, the 
 * solution is to pass a closure to the constructor which sets either the parent or the anchor 
 * based on which closure is passed (Segment.withAnchor(), Segment.withParent()).
 * 
 * As mentioned, this is the axis and can be taken as a base to render upperarm and forearm in case 
 * an arm needs to be drawn. The render() method should be overriden to achieve this.
 */
class Segment {

  constructor(length, setter) {
    this._len = length;
    if (setter) setter.set(this);
    this._baseAngle = 0;
    this._follow = false;
  }

  /**
   * Allows the anchor to be set to a different point. This is propagated through all the children.
   */
  setAnchor(anchor) {
    this._anchor = anchor.copy();
    this.calculateTip();
    if (this._child) {
      this._child.setAnchor(this._tip);
    }
  }

  setBaseAngle(angle) {
    this._baseAngle = angle;
  }

  /**
   * returns the absolute angle
   */
  angle() {
    return this._baseAngle + (this._parent ? this._parent.angle() : 0);
  }

  followChild() {
    this.follow(this._child._anchor.copy());
  }

  /**
   * Given a target, the segment aligns itself so that the tip reaches the target.
   */
  follow(target) {
    this._follow = true;
    let dir = p5.Vector.sub(target, this._anchor);
    this.setBaseAngle(dir.heading());
    dir.setMag(this._len);
    dir.mult(-1);
    this._anchor = p5.Vector.add(target, dir);
  }

  update() {
    if (this._parent && !this._follow) {
      this._anchor = this._parent._tip.copy();
    }
    this.calculateTip();
  }

  calculateTip() {
    let angle = this._follow ? this._baseAngle : this.angle();
    let dx = this._len * cos(angle);
    let dy = this._len * sin(angle);
    this._tip = createVector(this._anchor.x + dx, this._anchor.y + dy);
  }

  render() {
    stroke(255);
    strokeWeight(1);
    line(this._anchor.x, this._anchor.y, this._tip.x, this._tip.y);
  }
}

Segment.withAnchor = (anchor) => {
  return {
    set(me) {
      me._anchor = anchor.copy();
    }
  };
};

Segment.withParent = (parent) => {
  return {
    set(me) {
      me._parent = parent;
      parent._child = me;
    }
  };
};