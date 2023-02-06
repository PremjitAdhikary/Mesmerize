/**
 * Configuration: The configuration sets up how the animation for the line will be rendered. 
 * start: The starting point of the line
 * z: The depth
 * totalFrames: total frames before the line fades out
 * strokeWeight: 
 * strokeCap: SQUARE / ROUND / PROJECT
 * color: color of the line trail
 */
class TrailLine {

  constructor(config) {
    this.config = config;
    this.framesLeft = config.totalFrames;
    this.strokeWeight = config.strokeWeight ? config.strokeWeight : 5;
    this.strokeCap = config.strokeCap ? config.strokeCap : ROUND;
    this.removeObj = false;
    this.pathOver = false;
    this.z = config.z;
    this.path = [];
    this.addToPath(config.start);
    this.clr = config.color ? config.color : SketchColor.white();
  }

  render(originX) {
    if (this.removeObj) return;
    let a = map(this.framesLeft, 0, this.config.totalFrames, 0.2, 0.5);
    let c = this.clr.alpha(a).stringify();
    stroke(c);
    strokeWeight(this.strokeWeight);
    strokeCap(this.strokeCap);
    noFill();
    beginShape();
    for (let p of this.path) vertex(p.x - originX, p.y);
    endShape();
    if (this.pathOver) this.framesLeft--;
    if (this.framesLeft == 0) this.removeObj = true;
  }

  addToPath(node) {
    if (this.pathOver || this.removeObj) return;
    this.path.push(node);
  }

  fade() {
    if (this.removeObj) return;
    this.pathOver = true;
  }

}