/**
 * Configuration: The configuration sets up how the animation for the sweeping arc will be rendered. 
 * center: The center point of the arc
 * z: The depth
 * totalFrames: total frames before the arc fades out
 * strokeWeight: thickness of the arc
 * speed: how fast the arc sweeps
 * w / h: width / height of the ellipse based on which the arc will be rendered
 * startA / endA: start angle and end angle for the arc to be rendered. Note that this is clockwise
 * color: color of the arc trail
 */
 class SweepArc {

  constructor(config) {
    this.config = config;
    this.currFrame = 0;
    this.removeObj = false;
    this.z = config.z;
    this.clr = config.color ? config.color : SketchColor.white();
    this.startA = radians(this.config.startA);
    this.stopA = radians(this.config.stopA);
  }

  render(originX) {
    if (this.removeObj) return;
    let a = map(this.currFrame, 0, this.config.totalFrames, 1.0, 0.2);
    let c = this.clr.alpha(a).stringify();
    stroke(c);
    strokeWeight(this.config.strokeWeight + (this.currFrame*2));
    strokeCap(PROJECT);
    noFill();
    let dist = this.currFrame * this.config.speed;
    arc(this.config.center.x - originX, this.config.center.y, 
      this.config.w + dist, this.config.h + dist, 
      this.startA, this.stopA)
    this.currFrame++;
    if (this.currFrame == this.config.totalFrames) this.removeObj = true;
  }

}