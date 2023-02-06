/**
 * Configuration: The configuration sets up how the animation for the line will be rendered. 
 * start: The starting point of the line
 * end: The ending point of the line
 * z: The depth
 * totalFrames: total frames before the line fades out
 * startWidth: width of stroke at start
 * endWidth: width of stroke at end
 * color: color of the line trail
 */
 class TeleportLine {

  constructor(config) {
    this.config = config;
    this.end = config.end;
    this.framesLeft = config.totalFrames;
    this.removeObj = false;
    this.z = config.z;
    this.clr = config.color ? config.color : SketchColor.white();
  }

  render(originX) {
    if (this.removeObj) return;
    let a = map(this.framesLeft, 0, this.config.totalFrames, 0.2, 1.0);
    let c = this.clr.alpha(a).stringify();
    noStroke();
    fill(c);
    beginShape();
    vertex(this.config.start.x - originX, this.config.start.y - this.config.startWidth/2);
    vertex(this.config.start.x - originX, this.config.start.y + this.config.startWidth/2);
    vertex(this.end.x - originX, this.end.y + this.config.endWidth/2);
    vertex(this.end.x - originX, this.end.y - this.config.endWidth/2);
    endShape();
    this.framesLeft--;
    if (this.framesLeft == 0) this.removeObj = true;
  }

  updateEnd(end) {
    this.end = end;
  }

}